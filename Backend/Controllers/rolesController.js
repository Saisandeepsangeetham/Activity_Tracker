import pool from '../Models/database.js';

export const getRoles = (req,res,next)=>{
    const sql_roles = 'select * from roles';
    pool.query(sql_roles,(err,result)=>{
        return err ? next(err) : res.status(200).json(result);
    });
}

export const getRoleInformation = (req,res,next)=>{
    const id = req.params;
    const sql_info = 'select * from roles where role_id = ?';

    pool.query(sql_info,[id],(err,result)=>{
        return err ? next(err) : res.status(200).json(result[0]);
    });
}

export const newRole = (req,res,next)=>{
    const {name} = req.body;
    if(!name)
        return next({status : 400, message : "all fields are mandatory!!"});
    const sql_role = 'Insert into roles values(?,?)';
    pool.query(sql_role,[name],(err,results)=>{
        return err ? next(err):res.status(201).json({message:'Role added',roleid:result.insertId});
    });
}

export const deleteRole = (req,res,next)=>{
    const {id} = req.params;
    const sql = 'delete from roles where role_id = ?';
    pool.query(sql,[id],(err,result)=>{
        return err?next(err):((result.length === 0)? next({status: 404,message:"Role not found"}):res.status(200).json({message:'Role deleted',result}));
    });
}