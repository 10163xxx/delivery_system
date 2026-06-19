package system.objects

import system.objects.given
import services.auth.objects.*
import services.admin.objects.*

import org.typelevel.ci.CIString

object ServerDefaults:
  val ServiceName: ServiceName = serviceName("backend-sample")
  val HostEnv: EnvVarName = envVarName("APP_HOST")
  val PortEnv: EnvVarName = envVarName("APP_PORT")
  val Host: HostName = hostName("0.0.0.0")
  val Port: PortNumber = new PortNumber(8081)

object HttpHeaders:
  val SessionToken: CIString = CIString("x-session-token")

object AuthDefaults:
  val UsernameMaxLength: EntityCount = new EntityCount(24)
  val PasswordMaxLength: EntityCount = new EntityCount(64)
  val PasswordMinLength: EntityCount = new EntityCount(6)
  val UsernamePattern: DisplayText = text("[A-Za-z0-9_]+")
  val UserIdPrefix: DisplayText = text("usr")
  val GeneratedIdSuffixLength: EntityCount = new EntityCount(8)

object AuthPersistenceDefaults:
  val AccountsTableName: TableName = tableName("auth_accounts")
  val SessionsTableName: TableName = tableName("auth_sessions")
  val AccountIdColumnName: ColumnName = columnName("id")
  val UsernameColumnName: ColumnName = columnName("username")
  val PasswordHashColumnName: ColumnName = columnName("password_hash")
  val RoleColumnName: ColumnName = columnName("role")
  val DisplayNameColumnName: ColumnName = columnName("display_name")
  val LinkedProfileIdColumnName: ColumnName = columnName("linked_profile_id")
  val CreatedAtColumnName: ColumnName = columnName("created_at")
  val SessionTokenColumnName: ColumnName = columnName("token")
  val SessionAccountIdColumnName: ColumnName = columnName("account_id")
  val RoleColumnLength: EntityCount = new EntityCount(32)
  val PasswordHashColumnLength: EntityCount = new EntityCount(64)
  val DisplayNameColumnLength: EntityCount = new EntityCount(120)
  val EntityIdColumnLength: EntityCount = new EntityCount(64)

object DeliveryPersistenceDefaults:
  val SnapshotTableName: TableName = tableName("delivery_app_state")
  val SnapshotStateJsonColumnName: ColumnName = columnName("state_json")
  val CustomersTableName: TableName = tableName("delivery_customers")
  val StoresTableName: TableName = tableName("delivery_stores")
  val MerchantProfilesTableName: TableName = tableName("delivery_merchant_profiles")
  val RidersTableName: TableName = tableName("delivery_riders")
  val AdminsTableName: TableName = tableName("delivery_admins")
  val MerchantApplicationsTableName: TableName = tableName("delivery_merchant_applications")
  val ReviewAppealsTableName: TableName = tableName("delivery_review_appeals")
  val EligibilityReviewsTableName: TableName = tableName("delivery_eligibility_reviews")
  val OrdersTableName: TableName = tableName("delivery_orders")
  val TicketsTableName: TableName = tableName("delivery_tickets")
  val MetricsTableName: TableName = tableName("delivery_system_metrics")
  val StateKeyColumnName: ColumnName = columnName("state_key")
  val EntityIdColumnName: ColumnName = columnName("entity_id")
  val PositionColumnName: ColumnName = columnName("position")
  val PayloadColumnName: ColumnName = columnName("payload")
  val UpdatedAtColumnName: ColumnName = columnName("updated_at")
  val PrimaryStateKey: StateKey = stateKey("primary")
  val StateKeyColumnLength: EntityCount = new EntityCount(32)
  val EntityIdColumnLength: EntityCount = new EntityCount(64)

object AdminDefaults:
  val PrimaryAdminId: AdminId = new AdminId("admin-1")
  val PrimaryAdminUserId: AuthUserId = new AuthUserId("usr-admin-1")
  val PrimaryAdminDisplayName: PersonName = personName("总控台管理员")

object UploadDefaults:
  val MaxUploadBytes: ByteCount = new ByteCount(5 * 1024 * 1024)
  val ImagesTableName: TableName = tableName("merchant_store_images")
  val FilenameColumnName: ColumnName = columnName("filename")
  val MediaTypeColumnName: ColumnName = columnName("media_type")
  val ContentColumnName: ColumnName = columnName("content")
  val CreatedAtColumnName: ColumnName = columnName("created_at")
  val FilenameColumnLength: EntityCount = new EntityCount(96)
  val MediaTypeColumnLength: EntityCount = new EntityCount(64)
  val PublicUrlPrefix: UrlText = urlText("/uploads/store-images/")
  val FilenameExtensionSeparator: DisplayText = text(".")
  val MultipartFileField: DisplayText = text("file")
  val EmptyUploadMessage: ErrorMessage = errorMessage("请选择要上传的图片")
  val OversizedUploadMessage: ErrorMessage = errorMessage("图片大小不能超过 5MB")
  val UnsupportedImageMessage: ErrorMessage = errorMessage("仅支持 JPG、PNG、GIF、WebP 图片")
  val JpegMediaType: MediaTypeText = mediaTypeText("image/jpeg")
  val JpgMediaType: MediaTypeText = mediaTypeText("image/jpg")
  val PngMediaType: MediaTypeText = mediaTypeText("image/png")
  val GifMediaType: MediaTypeText = mediaTypeText("image/gif")
  val WebpMediaType: MediaTypeText = mediaTypeText("image/webp")
  val JpgExtension: FileExtension = fileExtension("jpg")
  val JpegExtension: FileExtension = fileExtension("jpeg")
  val PngExtension: FileExtension = fileExtension("png")
  val GifExtension: FileExtension = fileExtension("gif")
  val WebpExtension: FileExtension = fileExtension("webp")
  val FallbackExtension: FileExtension = fileExtension("img")

  enum AllowedImageExtension(val value: FileExtension):
    case Jpg extends AllowedImageExtension(JpgExtension)
    case Jpeg extends AllowedImageExtension(JpegExtension)
    case Png extends AllowedImageExtension(PngExtension)
    case Gif extends AllowedImageExtension(GifExtension)
    case Webp extends AllowedImageExtension(WebpExtension)

  enum FilenameSeparator(val value: DisplayText):
    case ForwardSlash extends FilenameSeparator(text("/"))
    case Backslash extends FilenameSeparator(text("\\"))

  val AllowedExtensions: List[FileExtension] =
    AllowedImageExtension.values.map(_.value).toList
  val FilenameSeparators: List[DisplayText] =
    FilenameSeparator.values.map(_.value).toList

  def generatedFileName(idText: FileNameText, extension: FileExtension): FileNameText =
    fileNameText(List(idText.raw, extension.raw).mkString(FilenameExtensionSeparator.raw))

  def publicUrlFor(filename: FileNameText): ImageUrl =
    imageUrl(List(PublicUrlPrefix.raw, filename.raw).mkString)

object DatabaseRuntimeDefaults:
  val DefaultDatabaseName: DatabaseName = databaseName("backend_sample")
  val NameEnv: EnvVarName = envVarName("DB_NAME")
  val HostEnv: EnvVarName = envVarName("DB_HOST")
  val PortEnv: EnvVarName = envVarName("DB_PORT")
  val UserEnv: EnvVarName = envVarName("DB_USER")
  val PasswordEnv: EnvVarName = envVarName("DB_PASSWORD")
  val MaxPoolSizeEnv: EnvVarName = envVarName("DB_MAX_POOL_SIZE")
  val ConnectionTimeoutEnv: EnvVarName = envVarName("DB_CONNECTION_TIMEOUT_MS")
  val DefaultHost: HostName = hostName("127.0.0.1")
  val DefaultPort: PortNumber = new PortNumber(5432)
  val DefaultUser: Username = username("db")
  val DefaultPassword: Password = password("root")
  val DefaultMaxPoolSize: PoolSize = new PoolSize(10)
  val DefaultConnectionTimeoutMs: TimeoutMilliseconds = new TimeoutMilliseconds(3000L)
  val DriverClassName: DisplayText = text("org.postgresql.Driver")
  val PoolName: DisplayText = text("backend-sample-pool")
  val NotInitializedMessage: ErrorMessage = errorMessage("DatabaseSession is not initialized")
