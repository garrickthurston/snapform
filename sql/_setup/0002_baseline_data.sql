USE SF
GO

INSERT INTO [auth].[user] (user_id, email, passhash, recovertoken)
VALUES (NEWID(), 'garrickthurston@gmail.com', '$2a$10$23hueU3fDLVbWc/M9zm6Guxy6ZTv0i4ilLNGU1yUUAozJfUHGkjWK', NULL)