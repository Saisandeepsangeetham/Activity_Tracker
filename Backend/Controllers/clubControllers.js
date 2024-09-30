import pool from "../Models/database.js";

export const getclubProfileID = (req,res,next)=>{
    try {
        const club_id = parseInt(req.params.id,10);
        if(isNaN(club_id))
            return res.status(404).json({message:"Invalid club Id"});
    
        const club_sql = `select club.club_name,club.description,teacher.name as teacher_name,student.name as student_name,
            student.year,student.dept,student.email,role.role_name from club join teacher on club.teacher_id = teacher.teacher_id
            left join club_members on club.club_id = club_members.club_id
            left join student on club_members.student_id = student.student_id
            left join role on club_members.role_id = role.role_id where club.club_id = ?`;
    
        pool.query(club_sql,[club_id],(err,result)=>{
            if(err) return res.status(500).json({message:err.message});
            if(result.length === 0) return res.status(404).json({message:"No club found with the id"});
            
            const clubInfo = {
                club_name : result[0].club_name,
                club_description: result[0].club_description,
                teacher_name: result[0].teacher_name,
                members: result.map(row =>({
                    student_name: row.student_name,
                    year: row.year,
                    dept:row.dept,
                    email:row.email,
                    role:row.role_name
                }))
            };
            return res.status(200).json({messages:"Ok",data:clubInfo});
        });
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const getallClubs = (req,res,next) => {
    try {
        const club_sql = "select * from club";
        pool.query(club_sql,(err,result)=>{
            if(err) return res.status(402).json({message:err.message});
            else{
                res.status(200).json({message:"Ok",data:result});
            }
        })
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const updateclubInfo = (req,res,next) =>{
    try {
        const club_id = parseInt(req.params.id,10);
        if(isNaN(club_id)) return res.status(404).json({message:"Invalid clud id"});

        const {name,description,teacher_name,teacher_email} = req.body;
        if(!name || !description || !teacher_name || !teacher_email) return res.status(402).json({message:"All details needed"});
        const club_sql = "select * from club where club_id = ?";
        pool.query(club_sql,[club_id],(err,result)=>{
            if(err) return res.status(500).json({message:err.message});
            if(result.length === 0) return res.status(404).json({message:"No club found"});

            const teacher_sql = "select * from teacher where name = ? and email = ?";
            pool.query(teacher_sql,[teacher_name,teacher_email],(teach_err,teach_result)=>{
                if(teach_err) return res.status(500).json({message:teach_err.message});
                if(teach_result.length === 0) return res.status(404).json({message:"No teacher found"});

                const teacherID = teach_result[0].teacher_id;
                const update_sql = "update teacher set name = ?,description = ?,teacher_id = ? where club_id = ?";
                pool.query(update_sql,[name,description,teacherID,club_id],(update_err,update_result)=>{
                    if(update_err) return res.status(500).json({message:update_err.message});
                    return res.status(200).json({message:"Club edited"});
                });
            });
        })

    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const deleteclub = (req,res,next) =>{
    try {
        const clubID = parseInt(req.params.id,10);
        if(isNaN(clubID)) return res.status(404).json({message:"Invalid club ID"});

        const delete_sql = "delete from club where club_id = ?";
        pool.query(delete_sql,[clubID],(err,result)=>{
            if(err) return res.status(500).json({message:err.message});
            if(result.affectedRows === 0)  return res.status(404).json({message:"Not found"});

            return res.status(200).json({message:"Deleted successfully"});
        })
    } catch (error) {
        return res.status(500).json({message:error.message});        
    }
}

export const addClub = (req, res, next) => {
    try {
        const { club_name, description, teacher_name, teacher_email } = req.body;
        if (!club_name || !description || !teacher_name || !teacher_email) 
            return res.status(400).json({ message: "All details (club name, description, teacher name, teacher email) are required." });
        const getTeacherSql = `
            SELECT teacher_id FROM teacher WHERE name = ? AND email = ?
        `;
        pool.query(getTeacherSql, [teacher_name, teacher_email], (err, teacherResult) => {
            if (err) return res.status(500).json({ message: err.message });
            if (teacherResult.length === 0) return res.status(404).json({ message: "Teacher not found." });

            const teacher_id = teacherResult[0].teacher_id;
            const addClubSql = `
                INSERT INTO club (club_name, description, teacher_id)
                VALUES (?, ?, ?)
            `;
            pool.query(addClubSql, [club_name, description, teacher_id], (insertErr, result) => {
                if (insertErr) return res.status(500).json({ message: insertErr.message });
                return res.status(201).json({ message: "Club added successfully", clubID: result.insertId });
            });
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getallclubEvents = (req, res, next) => {
    try {
        const club_id = parseInt(req.params.id, 10);
        if (isNaN(club_id)) 
            return res.status(400).json({ message: "Invalid club ID" });

        const getEventsSql = `
            select e.event_id, e.event_name, e.description, e.event_date, e.created_at, 
                   c.club_name, ec.category_name, cm.student_id
            from events e
            join Club c on e.club_id = c.club_id
            left join event_categories ec on e.event_category_id = ec.event_category_id
            left join Club_Members cm on e.created_by = cm.member_id
            where e.club_id = ?;
        `;

        pool.query(getEventsSql, [club_id], (err, results) => {
            if (err) return res.status(500).json({ message: err.message });
            if (results.length === 0) return res.status(404).json({ message: "No events found for this club" });

            return res.status(200).json({
                club_id: club_id,
                events: results
            });
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
