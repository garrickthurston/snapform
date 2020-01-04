CREATE TABLE [app].[project](
	[project_id] [uniqueidentifier] NOT NULL,
	[workspace_id] [uniqueidentifier] NOT NULL,
    [project_name] [nvarchar](1200) NOT NULL,
	[config] [nvarchar](MAX) NOT NULL,
	[items] [nvarchar](MAX) NOT NULL
CONSTRAINT [pk_app_project_project_id] PRIMARY KEY NONCLUSTERED 
(
	[project_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [app].[project] WITH NOCHECK ADD  CONSTRAINT [fk_app_project_app_workspace_workspace_id] FOREIGN KEY([workspace_id])
REFERENCES [app].[workspace] ([workspace_id])
GO
