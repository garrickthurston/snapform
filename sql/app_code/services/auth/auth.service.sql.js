module.exports = {
    updatePasswordQuery: `
        UPDATE [dbo].[users]
        SET passhash = @passhash
        WHERE email = 'garrickthurston@gmail.com'
    `,
    authenticateQuery: `
        SELECT 
            user_id,
            email,
            passhash
        FROM [dbo].[users]
        WHERE email = @email
    `
};