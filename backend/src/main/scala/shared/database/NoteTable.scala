package shared.database

import domain.shared.given

import cats.effect.IO
import domain.shared.{DemoNote, DisplayText, NoteBody, NoteId, NoteStatus, NoteTableDefaults, NoteText, NoteTitle, ParameterIndex, SaveDemoNoteRequest, SqlStatement, noteStatusDatabaseValues, noteStatusFromDatabaseUnsafe, noteStatusToDatabase, randomNoteId}
import org.typelevel.log4cats.slf4j.Slf4jLogger

import java.sql.{Connection, PreparedStatement, ResultSet, Timestamp}

private val noteTableLogger = Slf4jLogger.getLogger[IO]
private val noteStatusCheckValues = noteStatusDatabaseValues.map(value => s"'$value'").mkString(", ")

  // 主要用途:
  //   初始化 demo_notes 表，作为模板项目里的 PostgreSQL 表结构样例。
  // 常见场景:
  //   1. 启动项目后手动执行建表
  //   2. 参考这个对象新增自己的业务表
  //   3. 统一把某张表的 SQL 和操作放在一个文件里维护
val initTableSql: SqlStatement =
  new SqlStatement(s"""
      |create table if not exists demo_notes (
      |  id uuid primary key,
      |  title varchar(${NoteTableDefaults.TitleColumnLength}) not null,
      |  body text not null,
      |  status varchar(${NoteTableDefaults.StatusColumnLength}) not null check (status in ($noteStatusCheckValues)),
      |  created_at timestamptz not null
      |);
      |
      |comment on table demo_notes is 'JDBC + PostgreSQL 样例表，演示类型系统到数据库的基础读写';
      |comment on column demo_notes.id is '业务主键，对应 Scala 里的 NoteId(UUID)';
      |comment on column demo_notes.title is '标题，对应 Scala 里的 NoteTitle';
      |comment on column demo_notes.body is '正文，对应 Scala 里的 NoteBody';
      |comment on column demo_notes.status is '状态枚举，对应 Scala 里的 NoteStatus';
      |comment on column demo_notes.created_at is '创建时间，对应 Scala 里的 Instant';
      |""".stripMargin)

  // 常见插入命令:
  //   用于把 Scala 强类型对象写入数据库，并直接返回完整行数据。
val insertSql: SqlStatement =
  new SqlStatement("""
      |insert into demo_notes (id, title, body, status, created_at)
      |values (?, ?, ?, ?, ?)
      |returning id, title, body, status, created_at
      |""".stripMargin)

  // 常见查询命令:
  //   按主键读取一条 note 数据，演示数据库到类型系统的反序列化。
val findByIdSql: SqlStatement =
  new SqlStatement("""
      |select id, title, body, status, created_at
      |from demo_notes
      |where id = ?
      |""".stripMargin)

  // 常见列表命令:
  //   按创建时间倒序列出全部 note，便于做最基本的后台列表接口。
val listAllSql: SqlStatement =
  new SqlStatement("""
      |select id, title, body, status, created_at
      |from demo_notes
      |order by created_at desc
      |""".stripMargin)

def initializeNoteTable(connection: Connection): IO[Unit] =
  IO.blocking {
    val statement = connection.createStatement()
    try statement.execute(initTableSql.raw)
    finally statement.close()
  }

def insertNote(connection: Connection, request: SaveDemoNoteRequest): IO[DemoNote] =
  for
    note <- IO.blocking {
      val noteId = randomNoteId()
      val createdAt = java.time.Instant.now()
      val statement = connection.prepareStatement(insertSql.raw)

      try
        setNoteId(statement, NoteTableDefaults.InsertIdParameterIndex, noteId)
        setNoteTitle(statement, NoteTableDefaults.InsertTitleParameterIndex, request.title)
        setNoteBody(statement, NoteTableDefaults.InsertBodyParameterIndex, request.body)
        setNoteStatus(statement, NoteTableDefaults.InsertStatusParameterIndex, request.status)
        setInstant(statement, NoteTableDefaults.InsertCreatedAtParameterIndex, createdAt)

        val resultSet = statement.executeQuery()
        try
          if resultSet.next() then readDemoNote(resultSet)
          else throw new IllegalStateException("Insert succeeded but returned no row")
        finally resultSet.close()
      finally statement.close()
    }
    _ <- noteTableLogger.info(s"Inserted demo note into PostgreSQL, noteId=${note.id.value}")
  yield note

def findNoteById(connection: Connection, noteId: NoteId): IO[Option[DemoNote]] =
  IO.blocking {
    val statement = connection.prepareStatement(findByIdSql.raw)

    try
      setNoteId(statement, NoteTableDefaults.InsertIdParameterIndex, noteId)

      val resultSet = statement.executeQuery()
      try
        if resultSet.next() then Some(readDemoNote(resultSet))
        else None
      finally resultSet.close()
    finally statement.close()
  }

private def setNoteId(statement: PreparedStatement, index: ParameterIndex, noteId: NoteId): Unit =
  statement.setObject(index, noteId.value)

private def setNoteTitle(statement: PreparedStatement, index: ParameterIndex, title: NoteTitle): Unit =
  statement.setString(index, title.value.raw)

private def setNoteBody(statement: PreparedStatement, index: ParameterIndex, body: NoteBody): Unit =
  statement.setString(index, body.value.raw)

private def setNoteStatus(statement: PreparedStatement, index: ParameterIndex, status: NoteStatus): Unit =
  statement.setString(index, noteStatusToDatabase(status).raw)

private def setInstant(statement: PreparedStatement, index: ParameterIndex, instant: java.time.Instant): Unit =
  statement.setTimestamp(index, Timestamp.from(instant))

private def readDemoNote(resultSet: ResultSet): DemoNote =
  DemoNote(
    id = NoteId(resultSet.getObject("id", classOf[java.util.UUID])),
    title = NoteTitle(new DisplayText(resultSet.getString("title"))),
    body = NoteBody(new NoteText(resultSet.getString("body"))),
    status = noteStatusFromDatabaseUnsafe(new DisplayText(resultSet.getString("status"))),
    createdAt = resultSet.getTimestamp("created_at").toInstant
  )
