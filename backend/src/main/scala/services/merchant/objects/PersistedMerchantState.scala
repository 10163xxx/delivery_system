package services.merchant.objects

// Alignment note: backend-only persistence aggregate for merchant tables.
// Frontend protocol objects intentionally do not mirror this database loading shape.
final case class PersistedMerchantState(
    stores: List[Store],
    merchantProfiles: List[MerchantProfile],
    merchantApplications: List[MerchantApplication],
)
