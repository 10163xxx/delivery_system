package system.app

// Business note: application-level business orchestration and derived state shared by service actions.
import system.objects.given
import system.app.objects.*

import cats.effect.IO
import services.auth.objects.*
import services.order.objects.*
import system.objects.*
import system.{withTransactionConnection, withTransactionConnectionBlocking}
import system.app.core.table.{initializeDeliveryStateTable, loadPersistedDeliveryState, savePersistedDeliveryState, savePersistedDeliveryStateBlocking}

import java.time.Instant
import java.util.UUID
import java.util.concurrent.atomic.AtomicReference

val writeLock = new AnyRef
val stateRef = new AtomicReference[DeliveryAppState](emptyDeliveryAppState())
// The in-memory state is the live app snapshot; each mutating action persists through DeliveryStateTable.

def initializeDeliveryStatePersistence: IO[Unit] =
  withTransactionConnection { connection =>
    for
      _ <- initializeDeliveryStateTable(connection)
      initialState <- loadPersistedDeliveryState(connection).map(_.getOrElse(emptyDeliveryAppState()))
      _ <- IO(stateRef.set(initialState))
    yield ()
  }

def getState: IO[DeliveryAppState] =
  withTransactionConnection { connection =>
    IO.blocking {
      writeLock.synchronized {
        val refreshed = refreshState(stateRef.get(), now())
        stateRef.set(refreshed)
        refreshed
      }
    }.flatTap(refreshed => savePersistedDeliveryState(connection, refreshed))
  }

def getStateForUser(user: AuthAccount): IO[DeliveryAppState] =
  getState.map(state => projectStateForUser(state, user))

def transitionOrder(
      orderId: OrderId,
      expected: OrderStatus,
      next: OrderStatus,
      note: DisplayText,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- current.orders.find(_.id == orderId).toRight(ValidationMessages.Order.OrderNotFound)
          _ <- Either.cond(order.status == expected, (), orderStatusMismatch(expected))
        yield
          val timestamp = now()
          val nextOrders = current.orders.map(entry =>
            if entry.id == orderId then
              entry.copy(
                fulfillment = entry.fulfillment.copy(status = next),
                lifecycle = entry.lifecycle.copy(updatedAt = timestamp),
                activity = entry.activity.copy(
                  timeline = entry.timeline :+ OrderTimelineEntry(next, note, timestamp)
                ),
              )
            else entry
          )
          withDerivedData(current.copy(deliveryState = current.deliveryState.copy(orders = nextOrders)))
      }
    }

def updateState(
      mutate: DeliveryAppState => Either[ErrorMessage, DeliveryAppState]
  ): Either[ErrorMessage, DeliveryAppState] =
    writeLock.synchronized {
      val current = refreshState(stateRef.get(), now())
      mutate(current).map(next =>
        val refreshed = refreshState(next, now())
        withTransactionConnectionBlocking(connection => savePersistedDeliveryStateBlocking(connection, refreshed))
        stateRef.set(refreshed)
        refreshed
      )
    }

def nextId[T](prefix: DisplayText)(using wrapped: WrappedTextType[T]): T =
  wrapText[T](List(prefix.raw, "-", UUID.randomUUID().toString.take(DeliveryBusinessDefaults.GeneratedIdSuffixLength)).mkString)

def now(): IsoDateTime = new IsoDateTime(Instant.now().toString)

private def emptyDeliveryAppState(): DeliveryAppState =
  DeliveryAppState(
    customers = List.empty,
    stores = List.empty,
    merchantProfiles = List.empty,
    riders = List.empty,
    admins = List.empty,
    merchantApplications = List.empty,
    reviewAppeals = List.empty,
    eligibilityReviews = List.empty,
    deliveryState = DeliveryOrderState(
      orders = List.empty,
      tickets = List.empty,
      metrics = SystemMetrics(NumericDefaults.ZeroCount, NumericDefaults.ZeroCount, NumericDefaults.ZeroCount, NumericDefaults.ZeroAverageRating),
    ),
  )
