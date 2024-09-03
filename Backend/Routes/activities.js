import express from 'express';
import pool from '../Models/database';

const activity_router = express.Router();


//show all the activities..
activity_router.get('/',(req,res)=>{
    const sql = "Select * from activities";
    pool.query(sql,(err,results)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }else{
            res.status(200).json(results)
        }
    });
});

//create a new activity..
activity_router.post('/',(req,res)=>{
    const {id,name,description,category_id} = req.body;
    if(!name || !id||!description||!category_id){
        return res.status(400).json({error:"Provide all the details"});
    }
    const sql = "Insert into activities (activity_id,name,description,category_id) values(?,?,?,?)";
    pool.query(sql,[id,name,description,category_id],(err,results)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        else{
            res.status(200).json({message:"Activity added",activity_id:results.insertId});
        }
    })
});

//view a particular activity...
activity_router.get('/:id',(req,res)=>{
    const {id} = req.params;
    const sql = "select * from activities where activity_id = ?";
    pool.query(sql,[id],(err,results)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        if(results.length === 0){
            return res.status(404).json({error:"Not found"});
        }
        res.status(200).json(results[0]);
    });
});

//update a particular activity..
activity_router.put('/:id',(req,res)=>{
    const {id} = req.params;
    const{name,description,category_id} = req.body;
    if(!name||!description||!category_id){
        return res.status(400).json({error:"Provide all the details"});
    }
    const sql = "update activities set name = ?, description =?,category_id =? where activity_id = ?";
    pool.query(sql,[name,description,category_id,id],(err,results)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        if(results.affectedRows === 0){
            return res.status(404).json({error:"Activity Not found"});
        }
        res.status(200).json({message:"Activity Updated"});
    });
});

// Delete an activity..
activity_router.delete('/:id',(req,res)=>{
    const {id} = req.params;
    const sql = "delete from activities where activity_id = ?";

    pool.query(sql,[id],(err,results)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        if(results.affectedRows === 0){
            return res.status(404).json({error:"Activity not found"});
        }
        res.status(200).json({message:"Activity Deleted"});
    });
});

// add a participant to an activity
app.post('/:activityId/participants', (req, res) => {
    const { activityId } = req.params;
    const { userId, participantName } = req.body;

    if (!userId || !participantName) {
        return res.status(400).json({ error: 'User ID and participant name are required' });
    }

    const sql = 'INSERT INTO participants (activity_id, user_id, participant_name) VALUES (?, ?, ?)';
    pool.query(sql, [activityId, userId, participantName], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Participant added', participantId: results.insertId });
    });
});

//Remove a participant from an activity.
app.delete('/:activityId/participants/:userId', (req, res) => {
    const { activityId, userId } = req.params;

    const sql = 'DELETE FROM participants WHERE activity_id = ? AND user_id = ?';
    pool.query(sql, [activityId, userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Participant not found' });
        }
        res.json({ message: 'Participant removed' });
    });
});

export default activity_router;