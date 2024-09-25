import pool from '../Models/database.js';

export const getCategories = (req,res,next) =>{
    const sql = 'select * from categories';
    pool.query(sql,(err,result)=>{
        return err ? next(err) : res.status(200).json(result);
    });
}

//check about the category id..
export const addCategory = (req,res,next) => {
    const {name} = req.body;
    const sql = `insert into categories (name) values ?`;

    pool.query(sql,[name],(err,res)=>{
        if(err) return next(err);
        return res.status(200).json(result);
    });
}

export const getCategoryInformation = (req,res,next) =>{
    const {id} = req.params;
    const sql = `select * from categories where category_id = ?`;

    pool.query(sql,[id],(err,result)=>{
        if(err) return next(err);
        if(result.length === 0) return res.status(404).json({error:"No categories found"});
        return res.status(200).json({message:result[0]});
    });
}

export const updateCategory = (req,res,next)=>{
    const { id } = req.params;
    const { category_name } = req.body;

    if (!category_name) {
        return res.status(400).json({ error: "Category name is required" });
    }
    const checkSql = `SELECT * FROM Categories WHERE category_id = ?`;

    pool.query(checkSql, [id], (err, result) => {
        if (err) return next(err);
        if (result.length === 0) return next({status:404,message:"No Record Found"});
        const updateSql = `UPDATE Categories SET category_name = ? WHERE category_id = ?`;
        pool.query(updateSql, [category_name, id], (err, updateResult) => {
            if (err) return next(err);
            return res.status(200).json({ message: "Category updated successfully" });
        });
    });
}

export const deleteCategory = (res,req,next)=>{
    const { id } = req.params;

    const checkSql = `SELECT * FROM Categories WHERE category_id = ?`;
    pool.query(checkSql, [id], (err, result) => {
        if (err) return next(err);
        if (result.length === 0) return res.status(404).json({ error: "No category found" });
        const deleteSql = `DELETE FROM Categories WHERE category_id = ?`;

        pool.query(deleteSql, [id], (err, deleteResult) => {
            if (err) return next(err);
            return res.status(200).json({ message: "Category deleted successfully" });
        });
    });   
}