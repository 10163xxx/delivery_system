package services.order.utils

// Business note: order-related state lookups and status guards shared by order actions.
import system.app.objects.*

import services.customer.objects.*
import services.merchant.objects.*
import services.order.objects.*
import services.rider.objects.*
import system.objects.*

def findOrder(
    current: DeliveryAppState,
    orderId: OrderId,
): Either[ErrorMessage, OrderSummary] =
  current.orders.find(_.id == orderId).toRight(ValidationMessages.Order.OrderNotFound)

def findOrderCustomer(
    current: DeliveryAppState,
    customerId: CustomerId,
): Either[ErrorMessage, Customer] =
  current.customers.find(_.id == customerId).toRight(ValidationMessages.Customer.CustomerNotFound)

def findOrderStore(
    current: DeliveryAppState,
    storeId: StoreId,
): Either[ErrorMessage, Store] =
  current.stores.find(_.id == storeId).toRight(ValidationMessages.Merchant.StoreNotFound)

def findRider(
    current: DeliveryAppState,
    riderId: RiderId,
): Either[ErrorMessage, Rider] =
  current.riders.find(_.id == riderId).toRight(ValidationMessages.Merchant.RiderNotFound)

def requireOrderStatus(
    order: OrderSummary,
    status: OrderStatus,
    error: ErrorMessage,
): Either[ErrorMessage, Unit] =
  Either.cond(order.status == status, (), error)
