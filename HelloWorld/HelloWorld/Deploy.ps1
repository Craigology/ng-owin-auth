$binDir = $OctopusParameters["Octopus.Action[Deploy DB].Output.Package.InstallationDirectoryPath"] + '\bin'

write-Host 'Changing directory to: $binDir'
cd "$binDir"

write-Host 'Commencing EF migration...'
& "c:\CustomTools\ef6.1\migrate.exe" HelloWorld.dll /startUpDirectory:. /startUpConfigurationFile..\Web.config /connectionString:"$PrimaryDatabaseConnectionString" /connectionProviderName:System.Data.SqlClient /verbose
