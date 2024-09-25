import pool from '../Models/database.js';

export const getActivities = (req,res,next) => {
    const sql = "Select * from activities";
    pool.query(sql,(err,results)=>{
        return err ? next(err) : res.status(200).json(results);
    });
}

export const newActivity = (req, res, next) => {
    const {id,name,description,category_id} = req.body;
    if(!name || !id||!description||!category_id){
        return res.status(400).json({error:"Provide all the details"});
    }
    const sql = "Insert into activities (activity_id,name,description,category_id) values(?,?,?,?)";
    pool.query(sql,[id,name,description,category_id],(err,results)=>{
        if(err) return next(err);
        else return res.status(200).json({message:"Activity added",activity_id:results.insertId});
    });
}

export const getActivityInfomation = (req, res, next) => {
    const {id} = req.params;
    const sql = "select * from activities where activity_id = ?";
    pool.query(sql,[id],(err,results)=>{
        if(err)  return next(err);
        if(results.length === 0) return next({status:404,message:"No activities found"});
        return res.status(200).json(results[0]);
    });
}

export const updateActivity = (req, res, next) => {
    const {id} = req.params;
    const{name,description,category_id} = req.body;
    if(!name||!description||!category_id){
        return res.status(400).json({error:"Provide all the details"});
    }
    const sql = "update activities set name = ?, description =?,category_id =? where activity_id = ?";
    pool.query(sql,[name,description,category_id,id],(err,results)=>{
        if(err) return next(err); 
        if(results.affectedRows === 0)  return next({status:404,message:"No records found"});
        return res.status(200).json({message:"Activity Updated"});
    });
}

export const deleteActivity = (req,res,next)=>{
    const {id} = req.params;
    const sql = 'delete from activities where activity_id = ?';
    pool.query(sql,[id],(err,results)=>{
        if(err) return next(err);
        if(results.affectedRows === 0)  return next({status:404,message:'No records found'});
        return res.status(200).json({message:"Activity Deleted"});
    });
}

export const addParticipantActivity = (req,res,next)=>{
    const { activityId , userId} = req.params;
    const {participantName } = req.body;

    if (!participantName) return res.status(400).json({ error: 'User ID and participant name are required' });

    const sql = 'INSERT INTO participants (activity_id, user_id, participant_name) VALUES (?, ?, ?)';
    pool.query(sql, [activityId, userId, participantName], (err, results) => {
        if (err)  return res.status(500).json({ error: err.message });
        return res.status(201).json({ message: 'Participant added', participantId: results.insertId });
    });
}

export const deleteParticipantActivity = (req,res,next)=>{
    const { activityId, userId } = req.params;

    const sql = 'DELETE FROM participants WHERE activity_id = ? AND user_id = ?';
    pool.query(sql, [activityId, userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) 
            return res.status(404).json({ error: 'Participant not found' });
        return res.send(200).json({ message: 'Participant removed' });
    });
}

