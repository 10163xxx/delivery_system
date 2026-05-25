package domain.shared

import domain.shared.given

import org.typelevel.ci.CIString

import java.nio.file.{Path, Paths}

object ServerDefaults:
  val ServiceName: ServiceName = new domain.shared.ServiceName("backend-sample")
  val HostEnv: EnvVarName = new EnvVarName("APP_HOST")
  val PortEnv: EnvVarName = new EnvVarName("APP_PORT")
  val Host: HostName = new HostName("0.0.0.0")
  val Port: PortNumber = 8081

object HttpHeaders:
  val SessionToken: CIString = CIString("x-session-token")

object AuthDefaults:
  val UsernameMaxLength: EntityCount = 24
  val PasswordMaxLength: EntityCount = 64
  val PasswordMinLength: EntityCount = 6
  val UsernamePattern: DisplayText = new DisplayText("[A-Za-z0-9_]+")
  val UserIdPrefix: DisplayText = new DisplayText("usr")
  val GeneratedIdSuffixLength: EntityCount = 8

object AuthPersistenceDefaults:
  val AccountsTableName: DisplayText = new DisplayText("auth_accounts")
  val SessionsTableName: DisplayText = new DisplayText("auth_sessions")
  val AccountIdColumnName: DisplayText = new DisplayText("id")
  val UsernameColumnName: DisplayText = new DisplayText("username")
  val PasswordHashColumnName: DisplayText = new DisplayText("password_hash")
  val RoleColumnName: DisplayText = new DisplayText("role")
  val DisplayNameColumnName: DisplayText = new DisplayText("display_name")
  val LinkedProfileIdColumnName: DisplayText = new DisplayText("linked_profile_id")
  val CreatedAtColumnName: DisplayText = new DisplayText("created_at")
  val SessionTokenColumnName: DisplayText = new DisplayText("token")
  val SessionAccountIdColumnName: DisplayText = new DisplayText("account_id")
  val SeedScriptPath: Path = Paths.get("scripts", "init-demo-auth.sql")
  val RoleColumnLength: EntityCount = 32
  val PasswordHashColumnLength: EntityCount = 64
  val DisplayNameColumnLength: EntityCount = 120
  val EntityIdColumnLength: EntityCount = 64

object DeliveryRuntimeDefaults:
  val StateFileEnv: EnvVarName = new EnvVarName("DELIVERY_STATE_FILE")
  val StateFilePath: Path = Paths.get("data", "delivery-state.json")

object DeliveryPersistenceDefaults:
  val SnapshotTableName: DisplayText = new DisplayText("delivery_app_state")
  val SnapshotStateJsonColumnName: DisplayText = new DisplayText("state_json")
  val CustomersTableName: DisplayText = new DisplayText("delivery_customers")
  val StoresTableName: DisplayText = new DisplayText("delivery_stores")
  val MerchantProfilesTableName: DisplayText = new DisplayText("delivery_merchant_profiles")
  val RidersTableName: DisplayText = new DisplayText("delivery_riders")
  val AdminsTableName: DisplayText = new DisplayText("delivery_admins")
  val MerchantApplicationsTableName: DisplayText = new DisplayText("delivery_merchant_applications")
  val ReviewAppealsTableName: DisplayText = new DisplayText("delivery_review_appeals")
  val EligibilityReviewsTableName: DisplayText = new DisplayText("delivery_eligibility_reviews")
  val OrdersTableName: DisplayText = new DisplayText("delivery_orders")
  val TicketsTableName: DisplayText = new DisplayText("delivery_tickets")
  val MetricsTableName: DisplayText = new DisplayText("delivery_system_metrics")
  val StateKeyColumnName: DisplayText = new DisplayText("state_key")
  val EntityIdColumnName: DisplayText = new DisplayText("entity_id")
  val PositionColumnName: DisplayText = new DisplayText("position")
  val PayloadColumnName: DisplayText = new DisplayText("payload")
  val UpdatedAtColumnName: DisplayText = new DisplayText("updated_at")
  val PrimaryStateKey: DisplayText = new DisplayText("primary")
  val StateKeyColumnLength: EntityCount = 32
  val EntityIdColumnLength: EntityCount = 64

object AdminDefaults:
  val PrimaryAdminId: AdminId = "admin-1"
  val PrimaryAdminUserId: AuthUserId = "usr-admin-1"
  val PrimaryAdminDisplayName: PersonName = new PersonName("总控台管理员")

object UploadDefaults:
  val MaxUploadBytes: ByteCount = 5 * 1024 * 1024
  val UploadRoot: Path = Paths.get("uploads", "store-images")
  val PublicUrlPrefix: UrlText = new UrlText("/uploads/store-images/")
  val FilenameExtensionSeparator: DisplayText = new DisplayText(".")
  val MultipartFileField: DisplayText = new DisplayText("file")
  val EmptyUploadMessage: ErrorMessage = new ErrorMessage("请选择要上传的图片")
  val OversizedUploadMessage: ErrorMessage = new ErrorMessage("图片大小不能超过 5MB")
  val UnsupportedImageMessage: ErrorMessage = new ErrorMessage("仅支持 JPG、PNG、GIF、WebP 图片")
  val JpegMediaType: MediaTypeText = new MediaTypeText("image/jpeg")
  val JpgMediaType: MediaTypeText = new MediaTypeText("image/jpg")
  val PngMediaType: MediaTypeText = new MediaTypeText("image/png")
  val GifMediaType: MediaTypeText = new MediaTypeText("image/gif")
  val WebpMediaType: MediaTypeText = new MediaTypeText("image/webp")
  val JpgExtension: FileExtension = new FileExtension("jpg")
  val JpegExtension: FileExtension = new FileExtension("jpeg")
  val PngExtension: FileExtension = new FileExtension("png")
  val GifExtension: FileExtension = new FileExtension("gif")
  val WebpExtension: FileExtension = new FileExtension("webp")
  val FallbackExtension: FileExtension = new FileExtension("img")
  val AllowedExtensions: Set[FileExtension] =
    Set(JpgExtension, JpegExtension, PngExtension, GifExtension, WebpExtension)
  val FilenameSeparators: Set[DisplayText] = Set(new DisplayText("/"), new DisplayText("\\"))

  def generatedFileName(idText: FileNameText, extension: FileExtension): FileNameText =
    new FileNameText(List(idText.raw, extension.raw).mkString(FilenameExtensionSeparator.raw))

  def publicUrlFor(filename: FileNameText): ExternalUrl =
    new ExternalUrl(List(PublicUrlPrefix.raw, filename.raw).mkString)

object DatabaseRuntimeDefaults:
  val DefaultDatabaseName: DatabaseName = new DatabaseName("backend_sample")
  val NameEnv: EnvVarName = new EnvVarName("DB_NAME")
  val HostEnv: EnvVarName = new EnvVarName("DB_HOST")
  val PortEnv: EnvVarName = new EnvVarName("DB_PORT")
  val UserEnv: EnvVarName = new EnvVarName("DB_USER")
  val PasswordEnv: EnvVarName = new EnvVarName("DB_PASSWORD")
  val MaxPoolSizeEnv: EnvVarName = new EnvVarName("DB_MAX_POOL_SIZE")
  val ConnectionTimeoutEnv: EnvVarName = new EnvVarName("DB_CONNECTION_TIMEOUT_MS")
  val DefaultHost: HostName = new HostName("127.0.0.1")
  val DefaultPort: PortNumber = 5432
  val DefaultUser: Username = new Username("db")
  val DefaultPassword: Password = new Password("root")
  val DefaultMaxPoolSize: PoolSize = 10
  val DefaultConnectionTimeoutMs: TimeoutMilliseconds = 3000L
  val DriverClassName: DisplayText = new DisplayText("org.postgresql.Driver")
  val PoolName: DisplayText = new DisplayText("backend-sample-pool")
  val NotInitializedMessage: ErrorMessage = new ErrorMessage("DatabaseSession is not initialized")
