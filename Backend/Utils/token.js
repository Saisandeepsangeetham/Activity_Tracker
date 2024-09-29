import jwt from 'jsonwebtoken';

export const createToken = (payload,expiresIn)=>{
    const token = jwt.sign(payload, process.env.JWT_SECRET,{
        expiresIn:"7d"
    });
    return token;
}