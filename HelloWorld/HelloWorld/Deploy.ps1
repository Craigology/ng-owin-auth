$packageDir = $OctopusParameters["Octopus.Action['Deploy DB'].Output.Package.InstallationDirectoryPath"]

write-Host 'Changing directory to: $packageDir\bin'
cd '$packageDir\bin'

write-Host 'Commencing EF migration...'
& "c:\CustomTools\ef6.1\migrate.exe" HelloWorld.dll /startUpDirectory:. /startUpConfigurationFile..\Web.config /connectionString:"$PrimaryDatabaseConnectionString" /connectionProviderName:System.Data.SqlClient /verbose
