package domain.admin

// Backend-only persistence aggregate for admin tables. This shape is used when
// loading database state and is not mirrored by frontend protocol objects.
final case class PersistedAdminState(
    admins: List[AdminProfile],
    tickets: List[AdminTicket],
)
