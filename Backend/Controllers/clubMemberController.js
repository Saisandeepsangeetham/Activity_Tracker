import pool from "../Models/database.js";

export const getAllClubMembers = (req, res, next) => {
    try {
        const clubId = req.user.teacher_club;
        const sql = "SELECT cm.member_id, cm.student_id, s.name AS student_name, c.club_name, r.role_name, cm.joined_at FROM Club_Members cm JOIN Student s ON cm.student_id = s.student_id JOIN Club c ON cm.club_id = c.club_id JOIN Role r ON cm.role_id = r.role_id where cm.club_id = ?";
        pool.query(sql, [clubId], (err, result) => {
            return err ? res.status(400).json({error: err}) : res.status(200).json(result);
        });
    } catch (error) {
        return res.status(500).json({message: "Internal server error", error});
    }
}

const validateHelper = (tableName, idColumn, nameColumn, idValue, nameValue, callback) => {
    let query;
    let params;

    if (idValue) {
        query = `SELECT * FROM ${tableName} WHERE ${idColumn} = ?`;
        params = [idValue];
    } else if (nameValue) {
        query = `SELECT * FROM ${tableName} WHERE ${nameColumn} = ?`;
        params = [nameValue];
    } else {
        return callback(new Error(`No valid ID or name provided for ${tableName}`));
    }

    pool.query(query, params, (err, result) => {
        if (err) return callback(err);
        if (result.length === 0) return callback(new Error(`${tableName} not found`));
        callback(null, result[0]);
    });
};

export const addClubMember = (req, res) => {
    const { studentName, studentId, clubId, roleId } = req.body;
    const userRoleId = req.user.role_id;
    const presidentRoles = [1,2];
    const restrictedRoles = [5];
    const teacherClubId = req.user.teacher_club;
    if(teacherClubId !== clubId)
        return res.status(403).json({message: "you do not have permission to add member to other clubs!!"});
    if(presidentRoles.includes(userRoleId)){
        const sql2 = "select * from club_members where student_id = ?";
        pool.query(sql2, [req.user.student_id], (err, result)=>{
            if(err) return res.status(400).json({message: err.message});
            else if(result.length !== 0){
                if(result[0].club_id !== clubId)
                    return res.status(403).json({message: "you do not have permission to add member to other clubs!!"});
            }
        });
    }
    if(presidentRoles.includes(userRoleId) && !restrictedRoles.includes(roleId))
        return res.status(403).json({message: "you do not have permission to add this role!"});

    validateHelper('Student', 'student_id', 'name', studentId, studentName, (err, result) => {
        if (err) return res.status(400).json({ message: err.message });

        const sql1 = 'SELECT * FROM club_members WHERE student_id = ? AND club_id = ?';
        pool.query(sql1, [result.student_id, clubId], (err, result) => {
            if (err) return res.status(500).json({ message: 'Error checking club membership', error: err });

            if (result.length > 0) {
                return res.status(400).json({ message: 'Student is already a member of this club' });
            }
            const sql = 'INSERT INTO club_members (student_id, club_id, role_id) VALUES (?, ?, ?)';
            pool.query(sql, [result.student_id, clubId, roleId], (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Error adding club member', error: err });
                }
                res.status(201).json({ message: 'Club member added successfully', data: result });
            });
        });
    });
};

export const deleteClubMember = (req, res) => {
    const { studentId, clubId } = req.body;
    const teacherClubId = req.user.teacher_club;
    if(teacherClubId !== clubId)
        return res.status(403).json({message: "you do not have permission to delete member from the clubs you do not belong to!!"});
    const checkSql = 'SELECT * FROM club_members WHERE student_id = ? AND club_id = ?';
    pool.query(checkSql, [studentId, clubId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error checking club membership', error: err });

        if (result.length === 0) {
            return res.status(404).json({ message: 'Club member not found' });
        }

        const deleteSql = 'DELETE FROM club_members WHERE student_id = ? AND club_id = ?';
        pool.query(deleteSql, [studentId, clubId], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error deleting club member', error: err });
            }

            if (result.affectedRows > 0) {
                return res.status(200).json({ message: 'Club member deleted successfully' });
            } else {
                return res.status(404).json({ message: 'Club member not found or already deleted' });
            }
        });
    });
};
