write-Host 'Changing directory to: Octopus.Action[Deploy DB].Output.Package.InstallationDirectoryPath\bin'
cd "Octopus.Action[Deploy DB].Output.Package.InstallationDirectoryPath\bin"

write-Host 'Commencing EF migration...'
& "c:\CustomTools\ef6.1\migrate.exe" HelloWorld.dll /startUpDirectory:. /startUpConfigurationFile..\Web.config /connectionString:"$PrimaryDatabaseConnectionString" /connectionProviderName:System.Data.SqlClient /verbose
