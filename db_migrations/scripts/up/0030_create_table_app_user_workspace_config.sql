CREATE TABLE [app].[user_workspace_config](
	[user_id] [uniqueidentifier] NOT NULL,
	[active_workspace_id] [uniqueidentifier] NULL
CONSTRAINT [pk_app_user_workspace_config_user_id] PRIMARY KEY NONCLUSTERED 
(
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [app].[user_workspace_config] WITH NOCHECK ADD  CONSTRAINT [fk_app_user_workspace_config_auth_app_user_user_id] FOREIGN KEY([user_id])
REFERENCES [auth].[app_user] ([user_id])
GO

ALTER TABLE [app].[user_workspace_config] WITH NOCHECK ADD  CONSTRAINT [fk_app_user_workspace_config_app_workspace_workspace_id] FOREIGN KEY([active_workspace_id])
REFERENCES [app].[workspace] ([workspace_id])
GO
