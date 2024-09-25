import jwt from 'jsonwebtoken';

export const createToken = (enrollment_num,email,expiresIn)=>{
    const payload = {enrollment_num,email};
    const token = jwt.sign(payload,procces.env.JWT_SECRET,{
        expiresIn:"7d"
    });
    return token;
}