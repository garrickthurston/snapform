module.exports = {
    updatePassword: `
        UPDATE [dbo].[user]
        SET passhash = @passhash
        WHERE email = 'garrickthurston@gmail.com'
    `
};