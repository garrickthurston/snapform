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

-- auth
CREATE SCHEMA [auth]
GO

-- auth.user
CREATE TABLE [auth].[user](
	[user_id] [uniqueidentifier] NOT NULL,
	[email] [varchar](500) NOT NULL,
	[passhash] [varchar](500) NOT NULL,
	[recovertoken] [varchar](500) NULL,
CONSTRAINT [pk_auth_user_user_id] PRIMARY KEY NONCLUSTERED 
(
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

-- workspace
CREATE SCHEMA [workspace]
GO

-- workspace.project
CREATE TABLE [workspace].[project](
	[project_id] [uniqueidentifier] NOT NULL,
	[config] [nvarchar](MAX) NOT NULL,
	[items] [nvarchar](MAX) NOT NULL
CONSTRAINT [pk_workspace_project_project_id] PRIMARY KEY NONCLUSTERED 
(
	[project_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

-- workspace.workspace
CREATE TABLE [workspace].[workspace](
	[workspace_id] [uniqueidentifier] NOT NULL,
	[project_id] [uniqueidentifier] NOT NULL
CONSTRAINT [pk_workspace_workspace_workspace_id] PRIMARY KEY NONCLUSTERED 
(
	[workspace_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [workspace].[workspace] WITH NOCHECK ADD  CONSTRAINT [fk_workspace_workspace_workspace_project_project_id] FOREIGN KEY([project_id])
REFERENCES [workspace].[project] ([project_id])
GO

-- workspace.user_workspace
CREATE TABLE [workspace].[user_workspace](
	[user_id] [uniqueidentifier] NOT NULL,
	[workspace_id] [uniqueidentifier] NOT NULL
)
GO

ALTER TABLE [workspace].[user_workspace] WITH NOCHECK ADD  CONSTRAINT [fk_workspace_user_workspace_auth_user_user_id] FOREIGN KEY([user_id])
REFERENCES [auth].[user] ([user_id])
GO

ALTER TABLE [workspace].[user_workspace] WITH NOCHECK ADD  CONSTRAINT [fk_workspace_user_workspace_workspace_workspace_workspace_id] FOREIGN KEY([workspace_id])
REFERENCES [workspace].[workspace] ([workspace_id])
GO