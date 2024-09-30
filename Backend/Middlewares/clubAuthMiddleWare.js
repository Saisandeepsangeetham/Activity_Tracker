import jwt from 'jsonwebtoken';
import pool from '../Models/database.js';

export const authenticateEditOption = (req,res,next) =>{
    const token = req.header('Authorization')?.replace('Bearer ','');

    if(!token)
        return res.status(401).json({message: "Access denied"});

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        //console.log(decoded);
        const student_id = decoded.student_id;
        //checking purposes only...
        console.log(student_id)

        const teacher_id = decoded.teacher_id;
        const club_id = parseInt(req.params.id,10);
        
        if(isNaN(club_id)) return res.status(403).json({message:"Invalid club ID"});

        //check for the the student is president.
        if(student_id){
            const getstudent_role = "select role_id from club_members where student_id = ? and club_id = ?";
            pool.query(getstudent_role,[student_id,club_id],(err,role_result)=>{
                if(err) return res.status(500).json({message:err.message});
                if(role_result.length === 0) return res.status(404).json({message:"Unauthorized"});

                const role_id = role_result[0].role_id;

                const checkRole = "select role_name from role where role_id = ?";
                pool.query(checkRole,[role_id],(role_err,result)=>{
                    if(role_err) return res.status(500).json({message:role_err.message});
                    if(result.length === 0) return res.status(404).json({message:"Unauthorized"});

                    const roleName = result[0].role_name;

                    if(roleName === 'President'){
                        req.user = decoded;
                        next();
                    }
                    else    return res.status(403).json({message:"Access denied"});
                });
            });
        }
        // check the teacher role is faculty coordinator for edit access.
        else if(teacher_id){
            const getTeacherRoleSql = `
                select role_id from teacher where teacher_id = ? and club_id = ?;
            `;
            pool.query(getTeacherRoleSql, [teacher_id, club_id], (err, teacherResult) => {
                if (err) return res.status(400).json({ error: err.message });
                if (teacherResult.length === 0) return res.status(404).json({ error: 'Unauthorized' });

                const role_id = teacherResult[0].role_id;

                const checkRoleSql = `
                    SELECT role_name FROM Role WHERE role_id = ?;
                `;
                pool.query(checkRoleSql, [role_id], (roleErr, roleResult) => {
                    if (roleErr) return res.status(400).json({ error: roleErr.message });
                    if (roleResult.length === 0) return res.status(404).json({ error: 'Role not found.' });

                    const roleName = roleResult[0].role_name;

                    if (roleName === 'Faculty Coordinator') {
                        req.user = decoded;  
                        next();  
                        return res.status(403).json({ message: 'Access denied. You are not a Faculty Coordinator.' });
                    }
                });
            });
        }else {
            return res.status(401).json({ message: 'Invalid token. No valid student or teacher ID.' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
}

export const authenticateAddOption = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) 
        return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const teacher_id = decoded.teacher_id;

        const getRoleSql = `
            select role_id from teacher where teacher_id = ?
        `;
        pool.query(getRoleSql, [teacher_id], (err, teacherResult) => {
            if (err) return res.status(500).json({ error: err.message });
            if (teacherResult.length === 0) return res.status(404).json({ message: 'Teacher not found.' });

            const role_id = teacherResult[0].role_id;
            const checkRoleSql = `
                select role_name FROM Role where role_id = ?;
            `;
            pool.query(checkRoleSql, [role_id], (roleErr, roleResult) => {
                if (roleErr) return res.status(500).json({ error: roleErr.message });
                if (roleResult.length === 0) return res.status(404).json({ message: 'Role not found.' });

                const roleName = roleResult[0].role_name;
                if (roleName === 'Faculty Coordinator') {
                    req.user = decoded;  
                    next();  
                } else {
                    return res.status(403).json({ message: 'Access denied.' });
                }
            });
        });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};
