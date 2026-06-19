package services.admin.objects

// Alignment note: backend-only persistence aggregate for admin tables. Frontend
// protocol objects intentionally do not mirror this database loading shape.
final case class PersistedAdminState(
    admins: List[AdminProfile],
    tickets: List[AdminTicket],
)
