import pool from '../Models/database.js';

const authenticate = (teacherRole) => {
    return (req, res, next) => {

        const { role_id } = req.user;

        const sql = "SELECT * FROM role WHERE role_id = ?";

        pool.query(sql, [role_id], (err, result) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            if (result.length === 0 || result[0].role_name.toLowerCase() !== teacherRole.toLowerCase()) {
                return res.status(403).json({ error: "Invalid role! Access denied." });
            }
            req.user = req.user;
            next();
        });
    };
};

export const authenticateTeacher = authenticate("Faculty Coordinator");
export const authenticateHod = authenticate("HOD");