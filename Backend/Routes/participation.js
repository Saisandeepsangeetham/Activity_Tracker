import express from 'express';
import pool from '../Models/database';

const participants = express.Router();


participants.get('/',(req,res)=>{
    const sql = 'select * from participants';
    pool.query(sql,(err,result)=>{
        if(err) return res.status(500).json({error:err.message});
        else{
            res.status(200).json(result);
        }
        })
});

participants.post('/',(req,res)=>{
    const {user,activity,hours_logged,date,remarks} = req.body;
    if (!user || !activity || !hours_logged || !date) {
        return res.status(400).json({ error: "Provide all required details (user, activity, hours_logged, date)." });
    }
   const sql = `Insert into participants (user_id,activity_id,hours_logged,date,remarks) values (?,?,?,?,?)`;
   pool.query(sql,[user,activity,hours_logged,date,remarks],(err,result)=>{
    if(err){
        console.log("Error inserting into Participation:",err);
        return res.status(500).json({error:"An error occurred while inserting"});
    }
    return res.status(201).json({message:"Participation logged successfully!",participation_id:result.insertId});
   });
});


participants.get('/:id',(req,res)=>{
    const {id} = req.params;
    const sql = "select * from participants where participation_id = ?";

    pool.query(sql,[id],(err,result)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        if(result.length === 0){
            return res.status(404).json({error:"Details not found"});
        }
        res.status(200).json(result[0]);
    })
});

participants.put('/:id',(req,res)=>{
    const {id} = req.params;
    const {user,activity,hours_logged,date,remarks} = req.body;
    if(!user || !activity || !hours_logged||!date||!remarks){
        return res.status(400).json({error:"Provide all the details"});
    }
    const sql = `UPDATE Participation SET user_id = ?, activity_id = ?, hours_logged = ?, date = ?, remarks = ? WHERE participation_id = ?`;
    const params = [user,activity,hours_logged,date,remarks,id];

    pool.query(sql,params,(err,result)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        if(result.length === 0){
            return res.status(404).json({error:"Data not found"});
        }
        res.status(200).json({message:"Updated"});
    });
});


activity_router.delete('/:id',(req,res)=>{
    const {id} = req.params;
    const sql = "delete from participation where participation_id = ?";

    pool.query(sql,[id],(err,results)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        if(results.affectedRows === 0){
            return res.status(404).json({error:"Data not found"});
        }
        res.status(200).json({message:"Data Deleted"});
    });
});
