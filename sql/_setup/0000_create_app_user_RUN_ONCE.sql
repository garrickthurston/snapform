USE [master]
GO

EXEC xp_instance_regwrite N'HKEY_LOCAL_MACHINE',  N'Software\Microsoft\MSSQLServer\MSSQLServer', N'LoginMode', REG_DWORD, 2
GO

CREATE LOGIN [application] WITH PASSWORD=N'u9Fj8tUZCANcG8vE', DEFAULT_LANGUAGE = US_ENGLISH
GO
