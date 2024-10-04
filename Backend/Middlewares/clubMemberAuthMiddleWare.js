import { authenticateTeacher } from "./teacherAuthMiddleWare.js";
import pool from '../Models/database.js';

const authenticateClubRole = (allowedRoles) => {
    return (req, res, next) => {
        const { student_id: studentId } = req.user;
        const { clubId } = req.body;

        if (!clubId) {
            return res.status(400).json({ message: 'Club ID is required.' });
        }

        const sql = "SELECT r.role_name FROM club_members cm JOIN role r ON cm.role_id = r.role_id WHERE cm.student_id = ? AND cm.club_id = ?";

        pool.query(sql, [studentId, clubId], (err, result) => {
            if (err) return res.status(500).json({ error: err });
            if (result.length === 0) return res.status(403).json({ message: 'Access denied. Not a club member.' });
            
            const roleName = result[0].role_name.toLowerCase();
            if (!allowedRoles.includes(roleName)) {
                return res.status(403).json({ message: 'Access denied. Invalid role.' });
            }
            next();
        });
    };
};

export const authenticatePresidentVP = authenticateClubRole(['president', 'vice president']);

export const authenticateUserForAddMember = (req, res, next) => {
    const { role_id, student_id } = req.user || {};

    if (role_id) {
        return authenticateTeacher(req, res, next);
    } else if (student_id) {
        return authenticatePresidentVP(req, res, next);
    } else {
        return res.status(403).json({ message: 'Access denied. Invalid user role!!!.' });
    }
};
