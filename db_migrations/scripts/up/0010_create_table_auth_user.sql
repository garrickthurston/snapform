CREATE TABLE [auth].[app_user](
	[user_id] [uniqueidentifier] NOT NULL,
	[email] [varchar](500) NOT NULL,
	[passhash] [varchar](1000) NOT NULL,
	[recovertoken] [varchar](500) NULL,
CONSTRAINT [pk_auth_user_user_id] PRIMARY KEY NONCLUSTERED 
(
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
