package domain.merchant

// Backend-only persistence aggregate for merchant tables. This shape is used
// when loading database state and is not mirrored by frontend protocol objects.
final case class PersistedMerchantState(
    stores: List[Store],
    merchantProfiles: List[MerchantProfile],
    merchantApplications: List[MerchantApplication],
)
