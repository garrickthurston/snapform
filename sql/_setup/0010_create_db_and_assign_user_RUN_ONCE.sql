USE [master]
GO

IF DB_ID('SF') IS NOT NULL
BEGIN
	ALTER DATABASE [SF] SET SINGLE_USER WITH ROLLBACK IMMEDIATE
	DROP DATABASE [SF]
END
GO

CREATE DATABASE [SF]
GO

USE [SF]
GO

CREATE USER [application] FOR LOGIN [application]
GO

ALTER LOGIN [application] WITH DEFAULT_DATABASE = [SF]
GO

EXEC sp_AddRoleMember 'db_datareader', 'application'
GO
EXEC sp_AddRoleMember 'db_datawriter', 'application'
GO
EXEC sp_AddRoleMember 'db_ddladmin', 'application'
GO
GRANT EXECUTE TO [application]
GO

USE [SF]
GO

INSERT INTO [SF].[dbo].[user] (user_id, email, passhash, recovertoken)
VALUES (NEWID(), 'garrickthurston@gmail.com', '$2a$10$23hueU3fDLVbWc/M9zm6Guxy6ZTv0i4ilLNGU1yUUAozJfUHGkjWK', NULL)