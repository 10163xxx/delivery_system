package system.objects

import system.objects.given
import services.auth.objects.*

def text(value: String): DisplayText = wrapText[DisplayText](value)
def description(value: String): DescriptionText = wrapText[DescriptionText](value)
def personName(value: String): PersonName = wrapText[PersonName](value)
def errorMessage(value: String): ErrorMessage = wrapText[ErrorMessage](value)
def envVarName(value: String): EnvVarName = wrapText[EnvVarName](value)
def hostName(value: String): HostName = wrapText[HostName](value)
def username(value: String): Username = wrapText[Username](value)
def password(value: String): Password = wrapText[Password](value)
def databaseName(value: String): DatabaseName = wrapText[DatabaseName](value)
def urlText(value: String): UrlText = wrapText[UrlText](value)
def mediaTypeText(value: String): MediaTypeText = wrapText[MediaTypeText](value)
def fileExtension(value: String): FileExtension = wrapText[FileExtension](value)
def fileNameText(value: String): FileNameText = wrapText[FileNameText](value)
def imageUrl(value: String): ImageUrl = wrapText[ImageUrl](value)
def externalUrl(value: String): ExternalUrl = wrapText[ExternalUrl](value)
def serviceName(value: String): ServiceName = wrapText[ServiceName](value)
def serviceStatus(value: String): ServiceStatus = wrapText[ServiceStatus](value)
def tableName(value: String): TableName = wrapText[TableName](value)
def columnName(value: String): ColumnName = wrapText[ColumnName](value)
def stateKey(value: String): StateKey = wrapText[StateKey](value)
