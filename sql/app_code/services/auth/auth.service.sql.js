//TODO: update this query
module.exports = {
    updatePasswordQuery: `
        UPDATE [auth].[user]
        SET passhash = @passhash
        WHERE email = 'garrickthurston@gmail.com'
    `,
    authenticateQuery: `
        SELECT 
            user_id,
            email,
            passhash
        FROM [auth].[user]
        WHERE email = @email
    `
};