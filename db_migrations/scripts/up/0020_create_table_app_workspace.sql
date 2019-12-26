CREATE TABLE [app].[workspace](
	[workspace_id] [uniqueidentifier] NOT NULL,
    [user_id] [uniqueidentifier] NOT NULL,
	[workspace_name] [nvarchar](1200) NOT NULL
CONSTRAINT [pk_app_workspace_workspace_id] PRIMARY KEY NONCLUSTERED 
(
	[workspace_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [app].[workspace] WITH NOCHECK ADD  CONSTRAINT [fk_app_workspace_auth_app_user_user_id] FOREIGN KEY([user_id])
REFERENCES [auth].[app_user] ([user_id])
GO
