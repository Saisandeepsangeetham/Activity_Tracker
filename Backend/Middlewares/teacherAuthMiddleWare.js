import jwt from 'jsonwebtoken';

import pool from '../Models/database.js';
export const authenticateTeacher = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        const role_id = decoded.role_id;
        const sql = "select * from role where role_id = ?";
        pool.query(sql, [role_id], (err, result) => {
            if(err)
                return res.status(400).json({error: err});
            if(result.length === 0)
                return res.status(404).json({error: "invalid role! Access denied."});
            req.user = decoded;
            next();
        });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};
