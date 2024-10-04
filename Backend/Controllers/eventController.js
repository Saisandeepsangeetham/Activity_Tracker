import pool from "../Models/database.js";

export const getAllEvents = (req, res, next) => {
    const sql = "select * from events";
    pool.query(sql, (err, result) => {
        return err ? res.status(403).json({error: err}): res.status(200).json(result);
    })
};

export const getEvent = (req, res, next) => {
    const eventId = req.params.eventId;
    const sql = "select * from events where event_id = ?";
    pool.query(sql, [eventId], (err, result) => {
        return err ? res.status(403).json({error: err}): res.status(200).json(result);
    });
};

export const getEventsByClub = (req, res, next) => {
    const clubId = req.params.clubId;

    const sql = "select * from events where club_id = ?";
    pool.query(sql, [clubId], (err, result) => {
        return err ? res.status(403).json({error: err}): res.status(200).json(result);
    });
};

export const getEventsByCategory = (req, res, next) => {
    const categoryId = req.params.categoryId;

    const sql = "select * from events where event_category_id = ?";
    pool.query(sql, [categoryId], (err, result) => {
        return err ? res.status(403).json({error: err}): res.status(200).json(result);
    });
};

const checkUserPermission = (studentId, clubId, res, callback) => {
    const sql = "SELECT * FROM club_members WHERE student_id = ?";
    pool.query(sql, [studentId], (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        if (result.length === 0 || result[0].club_id !== clubId) {
            return res.status(403).json({ message: "You do not have permission for this club!" });
        }
        callback();
    });
};

export const addEvent = (req, res, next) => {
    const {eventName, description, eventDate, clubId, eventCategory}  = req.body;
    
    if(!eventName || !description || !eventDate || !clubId || !eventCategory)
        return res.status(402).json({message: "all fields required!"});

    checkUserPermission(req.user.student_id, clubId, res, () => {
        const sql = "insert into events (event_name, description, event_date, club_id, created_by, event_category_id) values (?,?,?,?,?,?);";
    
        pool.query(sql, [eventName, description, eventDate, clubId, req.user.student_id, eventCategory], (err, result) => {
            return err ? res.status(403).json({error: err}) : res.status(201).json({message: "event created!!"});
        });
    });
}

export const updateEvent = (req, res, next) => {
    const eventId = req.params.eventId;
    const {eventName, description, eventDate, clubId, eventCategory}  = req.body;
    
    if(!eventName || !description || !eventDate || !clubId || !eventCategory)
        return res.status(402).json({message: "all fields required!"});

    checkUserPermission(req.user.student_id, clubId, res, () => {
        const sql = "update events set event_name = ?, description = ?, event_date = ?, event_category_id = ? where event_id = ?";
    
        pool.query(sql, [eventName, description, eventDate, eventCategory, eventId], (err, result) => {
            return err ? res.status(403).json({error: err}) : res.status(201).json({message: "updated the event!!"});
        });
    });
};

export const deleteEvent = (req, res, next) => {
    const eventId = req.params.eventId;
    const {clubId} = req.body;  //Only for authentication!
    checkUserPermission(req.user.student_id, clubId, res, () => {
        const sql = "delete from events where event_id = ?";
        pool.query(sql, [eventId], (err, result) => {
            return err ? res.status(403).json({error: err}) : res.status(201).json({message: "deleted the event!!"});
        });
    });
};