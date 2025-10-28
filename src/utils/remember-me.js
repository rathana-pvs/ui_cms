import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';


function isJwtSigned(token){
    return /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token);
}


export function generateToken(password) {
    if(!isJwtSigned(password)) {
        return jwt.sign(
            password,
            SECRET_KEY
        );
    }
    return password;
}

export function verifyToken(token) {
    try {
        if(isJwtSigned(token)) {
            return jwt.verify(token, SECRET_KEY);
        }
        return token
    } catch (err) {
        return null;
    }
}
