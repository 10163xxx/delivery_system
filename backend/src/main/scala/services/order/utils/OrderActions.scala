package services.order.utils

import domain.shared.given

import cats.effect.IO
import domain.customer.*
import domain.merchant.*
import domain.order.*
import domain.review.*
import domain.rider.*
import domain.shared.*
import system.app.*

def createOrder(request: CreateOrderRequest): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        validateCreateOrderRequest(current, request).map(context =>
          applyCreatedOrderState(current, context)
        )
      }
    }

def acceptOrder(orderId: OrderId): IO[Either[ErrorMessage, DeliveryAppState]] =
    transitionOrder(orderId, OrderStatus.PendingMerchantAcceptance, OrderStatus.Preparing, merchantAcceptedNote)

def rejectOrder(orderId: OrderId, request: RejectOrderRequest): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        validateRejectOrderRequest(current, orderId, request).map(context =>
          applyRejectedOrderState(current, orderId, context)
        )
      }
    }

def readyOrder(orderId: OrderId): IO[Either[ErrorMessage, DeliveryAppState]] =
    transitionOrder(orderId, OrderStatus.Preparing, OrderStatus.ReadyForPickup, merchantPreparedNote)

def assignRider(orderId: OrderId, request: AssignRiderRequest): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- findOrder(current, orderId)
          _ <- requireOrderStatus(order, OrderStatus.ReadyForPickup, ValidationMessages.Order.OrderCannotAssignRider)
          _ <- Either.cond(order.riderId.isEmpty, (), ValidationMessages.Order.OrderAlreadyAssignedRider)
          rider <- findRider(current, request.riderId)
          _ <- Either.cond(rider.availability != riderSuspended, (), ValidationMessages.Order.RiderSuspended)
          _ <- Either.cond(rider.availability == riderAvailable, (), ValidationMessages.Order.RiderUnavailable)
        yield
          val timestamp = now()
          val nextOrders = current.orders.map(entry =>
            if entry.id == orderId then assignOrderRider(entry, rider, timestamp)
            else entry
          )
          val nextRiders = current.riders.map(entry =>
            if entry.id == rider.id then
              entry.copy(identity = entry.identity.copy(availability = riderOnDelivery))
            else entry
          )
          withDerivedData(
            current.copy(
              riders = nextRiders,
              deliveryState = current.deliveryState.copy(orders = nextOrders),
            )
          )
      }
    }

def pickupOrder(orderId: OrderId): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- findOrder(current, orderId)
          _ <- requireOrderStatus(order, OrderStatus.ReadyForPickup, ValidationMessages.Order.OrderCannotPickup)
          _ <- Either.cond(order.riderId.nonEmpty, (), ValidationMessages.Order.RiderAssignmentRequired)
        yield
          val timestamp = now()
          val nextOrders = current.orders.map(entry =>
            if entry.id == orderId then markOrderPickedUp(entry, timestamp)
            else entry
          )
          withDerivedData(current.copy(deliveryState = current.deliveryState.copy(orders = nextOrders)))
      }
    }

def deliverOrder(orderId: OrderId): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- findOrder(current, orderId)
          _ <- requireOrderStatus(order, OrderStatus.Delivering, ValidationMessages.Order.OrderCannotDeliver)
        yield
          val timestamp = now()
          val nextOrders = current.orders.map(entry =>
            if entry.id == orderId then markOrderDelivered(entry, timestamp)
            else entry
          )
          val nextRiders = current.riders.map(rider =>
            if Some(rider.id) == order.riderId then
              rider.copy(identity = rider.identity.copy(availability = riderAvailable))
            else rider
          )
          withDerivedData(
            current.copy(
              riders = nextRiders,
              deliveryState = current.deliveryState.copy(orders = nextOrders),
            )
          )
      }
    }

def reviewOrder(orderId: OrderId, request: ReviewOrderRequest): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        validateReviewOrderRequest(current, orderId, request).map(context =>
          applyReviewedOrderState(current, orderId, context)
        )
      }
    }

def appendStoreReviewReply(
    orderId: OrderId,
    request: AppendStoreReviewReplyRequest,
): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        validateStoreReviewReplyRequest(current, orderId, request).map {
          case (_, reply, timestamp) =>
            applyStoreReviewReplyState(current, orderId, reply, timestamp)
        }
      }
    }
