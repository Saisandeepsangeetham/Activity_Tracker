import express from 'express';
import pool from '../Models/database.js';

const categories = express.Router();

categories.get('/',(req,res)=>{
    const sql = `select * from categories`;
    pool.query(sql,(err,res)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        return res.status(200).json(result);
    });
})

categories.post('/',(req,res)=>{
    const {name} = req.body;
    const sql = `insert into categories (name) values ?`;

    pool.query(sql,[name],(err,res)=>{
        if(err){return res.status(500).json({error:err.message});}
        return res.status(200).json(result);
    });
});

categories.get('/:id',(req,res)=>{
    const {id} = req.params;
    const sql = `select * from categories where category_id = ?`;

    pool.query(sql,[id],(err,result)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        if(result.length === 0){
            return res.status(404).json({error:"No categories found"});
        }
        return res.status(200).json({message:result[0]});
    });
});

categories.put('/:id', (req, res) => {
    const { id } = req.params;
    const { category_name } = req.body;

    if (!category_name) {
        return res.status(400).json({ error: "Category name is required" });
    }
    const checkSql = `SELECT * FROM Categories WHERE category_id = ?`;

    pool.query(checkSql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "No category found" });
        }
        const updateSql = `UPDATE Categories SET category_name = ? WHERE category_id = ?`;
        pool.query(updateSql, [category_name, id], (err, updateResult) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            return res.status(200).json({ message: "Category updated successfully" });
        });
    });
});

categories.delete('/:id', (req, res) => {
    const { id } = req.params;

    const checkSql = `SELECT * FROM Categories WHERE category_id = ?`;
    pool.query(checkSql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "No category found" });
        }
        const deleteSql = `DELETE FROM Categories WHERE category_id = ?`;

        pool.query(deleteSql, [id], (err, deleteResult) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            return res.status(200).json({ message: "Category deleted successfully" });
        });
    });
});
