import express from "express";
import bodyParser from 'body-parser';
import {pool} from "../Models/database.js";


const router = express.Router();

router.get("/",(req,res)=>{
    const sql = 'Select * from roles';
    pool.query(sql,(err,results)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        res.status(200).json(results);
    });
});

router.get("/:id",(req,res)=>{
    const {id} = req.params;
    const sql = "SELECT * FROM roles where role_id = ?";

    pool.query(sql,[id],(err,results)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        if(results.length === 0){
            return res.status(404).json({error:'User not found'});
        }
        res.status(200).json(results[0]);
    })
});

router.post("/",(req,res)=>{
    const {name} = req.body;

    if(!name){
        return res.status(400).json({error:'Name is required'});
    }
    const sql = 'INSERT INTO ROLES VALUES(?,?)';
    pool.query(sql,[name],(err,results)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        res.status(201).json({message:'Role added',roleid:results.insertId});
    });
});

router.delete("/:id",(req,res)=>{
    const {id} = req.params;
    const sql = "delete from roles where role_id = ?";
    pool.query(sql,[id],(err,results)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        if(results.affectedRows === 0){
            return res.status(404).json({error:'Role is not found'});
        }
        res.json({message:'User deleted'});
    })
})

export default router;


