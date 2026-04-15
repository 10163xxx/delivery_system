package shared.app

import domain.shared.given

import domain.merchant.*
import domain.shared.*

private val emptyDerivedPhoneNumber = new PhoneNumber("")

def mergeMerchantProfiles(
    state: DeliveryAppState,
    settledIncomeByMerchant: Map[PersonName, CurrencyCents],
): List[MerchantProfile] =
  val merchantNames = (state.merchantProfiles.map(_.merchantName) ++ state.stores.map(_.merchantName)).distinct
    merchantNames.map { merchantName =>
      val existing = state.merchantProfiles.find(_.merchantName == merchantName)
      val profile = existing.getOrElse(
        MerchantProfile(
          id = nextId(MerchantIdPrefix),
          merchantName = merchantName,
          contactPhone = emptyDerivedPhoneNumber,
          payoutAccount = None,
          settledIncomeCents = NumericDefaults.ZeroCurrencyCents,
          withdrawnCents = NumericDefaults.ZeroCurrencyCents,
          availableToWithdrawCents = NumericDefaults.ZeroCurrencyCents,
          withdrawalHistory = List.empty,
        )
      )
      val settledIncomeCents = settledIncomeByMerchant.getOrElse(merchantName, NumericDefaults.ZeroCurrencyCents)
      profile.copy(
        settledIncomeCents = settledIncomeCents,
        availableToWithdrawCents = Math.max(NumericDefaults.ZeroCurrencyCents, settledIncomeCents - profile.withdrawnCents),
        withdrawalHistory = profile.withdrawalHistory.sortBy(_.requestedAt)(Ordering[IsoDateTime].reverse),
      )
    }
