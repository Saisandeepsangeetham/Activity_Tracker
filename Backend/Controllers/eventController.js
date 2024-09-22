import {v4 as uuidv4} from 'uuid';

import pool from '../Models/database.js';

export const getEvents = (req, res, next) => {
    const sql = "select * from events";
    pool.query(sql,(err,result)=>{
        return err ? next(err): res.status(200).json(result);
        });
};

export const getParticularEvent = (req, res, next) => {
    const {id} = req.params;
    const sql = "select * from events where event_id = ?";
    pool.query(sql, [id], (err, result) => {
        return err ? next(err) : ((result.length==0)?res.status(404).json({error: "event not found!"}):res.status(200).json(result));
    });
};

export const createEvent = (req, res, next)=> {
    const {id, name, desc, loc, start, end} = req.body;
    if(!id || !name || !desc || !loc || !start || !end)
        return next({status : 400, message : "all fields are mandatory!!"});
    const sql = "insert into events (event_id, event_name, description, location, start_time, end_time) values (?,?,?,?,?,?)";
    pool.query(sql, [id, name, desc, loc, start, end], (err, result) => {
        return err ? next(err): res.status(200).json(result);
    });
};

export const updateEvent = (req, res, next) => {
    const {id} = req.params;
    const updatedEvent = req.body;
    const fields = [];
    const values = [];
    Object.keys(updatedEvent).forEach(key => {
        fields.push(`${key} = ?`);
        values.push(updatedEvent[key]);
    });
    const sql = `update events set ${fields.join(', ')} where event_id = ?`;
    values.push(id);
    pool.query(sql, values, (err, result) => {
        return err ? next(err) : ((result.affectedRows === 0) ? next({status : 404, message : "event not found!"}) : res.status(200).json(result));
    });
};

export const deleteEvent = (req, res, next) => {
    const {id} = req.params;
    const sql = "delete from events where event_id = ?";
    pool.query(sql, [id], (err, result) => {
        return err ? next(err) : ((result.affectedRows === 0) ? next({status : 404, message : "event not found!"}) : res.status(200).json({message: "event deleted!", result}));
    });
};

export const getEventRegistrations = (req, res, next) => {
    const {id} = req.params;
    const sql = "select er.registration_id, er.registration_date, er.status, u.user_id, u.username, u.email from eventRegistrations er join users u on er.user_id = u.user_id where er.event_id = ?";
    pool.query(sql, [id], (err, result) => {
        return err ? next(err) : ((result.length === 0) ? next({status : 404, message : "not found!"}) : res.status(200).json(result));
    });
};

export const registerEvent = (req, res, next) => {
    const {id} = req.params;
    const {userId, status} = req.body;
    if(!userId || !status)
        return next({status : 400, message : "all fields are mandatory!!"});
    const sql = "insert into eventRegistrations (registration_id, user_id, event_id, registration_date, status) values (?,?,?,CURDATE(), ?)";
    registration_id = uuidv4(); // this can be altered later!!

    pool.query(sql, [registration_id, userId, id, status], (err, result) => {
        return err ? next(err) : res.status(200).json(result);
    });
};

export const cancelRegistration = (req, res, next) => {
    const {id} = req.params;
    const {userId} = req.body;
    if(!userId)
        return next({status : 400, message : "userId is required!!"});
    const sql = "delete from eventRegistrations where event_id = ? and user_id = ?";
    pool.query(sql, [id, userId], (err, result) => {
        return err ? next(err) : ((result.affectedRows === 0) ? next({status : 404, message : "event not found!"}) : res.status(200).json({message: "registration cancelled!", result}));
    });
};