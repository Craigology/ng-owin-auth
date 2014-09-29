write-Host 'Commencing EF migration...'

cd "Octopus.Action[StepName].Output.Package.InstallationDirectoryPath\bin"

& "c:\CustomTools\ef6.1\migrate.exe" HelloWorld.dll /startUpDirectory:. /startUpConfigurationFile..\Web.config /connectionString:"$PrimaryDatabaseConnectionString" /connectionProviderName:System.Data.SqlClient /verbose
