import jwt from 'jsonwebtoken';

// eslint-disable-next-line import/prefer-default-export
export const decodeToken = (token) => jwt.decode(token);
