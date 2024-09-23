import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import {v4 as uuidv4} from 'uuid';

import pool from "../Models/database.js";
const findUserByEmail = (email, callback) => {
    const sql = "select * from users where email = ?";
    pool.query(sql,[email], callback);
}

export const getAllUsers = (req, res, next) => {
    const sql = "select * from users";
    pool.query(sql, (err, result) => {
        return err ? next(err) : res.status(200).json(result);
    });
};

export const createUser = (req, res, next) => {
    const {username, password, email, role_id} = req.body;
    findUserByEmail(email, async (err, result) => {
        if(err) 
            next(err) 
        if(result.length > 0)
            next({status: 400, message: "user already exist!"});
        const hashPassword = await bcrypt.hash(password, 10);
        const sql = "insert into users (user_id, username, password, email, role_id) values (?,?,?,?,?)";
        const user_id = uuidv4();
        pool.query(sql, [user_id, username, hashPassword, email, role_id], (err2, result2) => {
            return err2 ? next(err2) : res.status(201).json({message: "user created!",result2});
        });
    });
};

export const loginUser = (req, res, next) => {
    const {email, password} = req.body;
    findUserByEmail(email, async (err, result) => {
        if(err) 
            next(err) 
        if(result.length === 0)
            next({status: 400, message: "user not found"});
        const user = result[0];
        const passwordResult = await bcrypt.compare(password, user.password);
        if(!passwordResult)
            return next({status: 400, message: "Invalid password!"});
        const token = JWT.sign({email: user.email}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({message: "logged in!!", token});
    });
};

export const jwtVerify = (req, res) => {
    res.status(200).json({message: "logged in with JWT!", user: req.user});
};

export const deleteUser = (req, res, next) => {
    
}