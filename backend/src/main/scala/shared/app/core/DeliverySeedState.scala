package shared.app

import domain.shared.given

import domain.admin.*
import domain.customer.*
import domain.merchant.*
import domain.shared.*

private val emptySystemMetrics: SystemMetrics =
  SystemMetrics(
    totalOrders = NumericDefaults.ZeroCount,
    activeOrders = NumericDefaults.ZeroCount,
    resolvedTickets = NumericDefaults.ZeroCount,
    averageRating = NumericDefaults.ZeroAverageRating,
  )

def seedState(): DeliveryAppState =
    val customers = List(
      seedCustomer(
        id = "cust-1",
        phone = phone("13800000001"),
        defaultAddress = address("浦东新区世纪大道 88 号"),
        addresses = List(
          AddressEntry(label("家"), address("浦东新区世纪大道 88 号")),
          AddressEntry(label("公司"), address("浦东新区张杨路 188 号")),
        ),
        balanceCents = 10000,
      ),
      seedCustomer(
        id = "cust-2",
        phone = phone("13800000002"),
        defaultAddress = address("静安区南京西路 318 号"),
        addresses = List(AddressEntry(label("家"), address("静安区南京西路 318 号"))),
        balanceCents = 5000,
      ),
    )
    val stores = List.empty
    val riders = List(
      seedRider("rider-1", person("陈凯"), vehicle("电动车"), zone("浦东")),
      seedRider("rider-2", person("赵晨"), vehicle("摩托车"), zone("静安")),
    )
    val admins = List(
      AdminProfile(
        AdminDefaults.PrimaryAdminId,
        AdminDefaults.PrimaryAdminDisplayName,
        NumericDefaults.ZeroCurrencyCents,
      )
    )

    withDerivedData(
      DeliveryAppState(
        customers = customers,
        stores = stores,
        merchantProfiles = List(
          seedMerchantProfile(
            id = "merchant-1",
            merchantName = person("王师傅"),
            contactPhone = phone("13800138000"),
            payoutAccount = Some(
              MerchantPayoutAccount(
                accountType = MerchantPayoutAccountType.Bank,
                bankName = Some(new BankName("招商银行")),
                accountNumber = new AccountNumber("6225888800004021"),
                accountHolder = new AccountHolderName("王师傅"),
              )
            ),
          ),
          seedMerchantProfile(
            id = "merchant-2",
            merchantName = person("苏宁"),
            contactPhone = phone("13800138001"),
            payoutAccount = Some(
              MerchantPayoutAccount(
                accountType = MerchantPayoutAccountType.Alipay,
                bankName = None,
                accountNumber = new AccountNumber("su_store@demo"),
                accountHolder = new AccountHolderName("苏宁"),
              )
            ),
          ),
        ),
        riders = riders,
        admins = admins,
        merchantApplications = List.empty,
        reviewAppeals = List.empty,
        eligibilityReviews = List.empty,
        orders = List.empty,
        tickets = List.empty,
        metrics = emptySystemMetrics,
      )
    )
