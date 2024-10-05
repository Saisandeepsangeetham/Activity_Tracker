import pool from "../Models/database.js";

export const registerEvent = (req,res,next)=>{
    try {
        const event_id = req.params.id;
        if(isNaN(event_id)){
            return res.status(404).json({message:"Invalid event id"});
        }
        const {std_id} = req.body;
    
        const sql = "Insert into event_registration (student_id,event_id) values (?,?)";
        pool.query(sql,[event_id,std_id],(err,result)=>{
            if(err){
                return res.status(500).json({message:"Internal server error"});
            }
            return res.status(201).json({message:"Registration successfull"});
        });
    } catch (error) {
        return res.status(500).json({message:"Internal server error"});
    }
}

export const registeredStudents = (req,res,next)=>{
    try {
        const event_id = req.params.id;
        const event_sql = "select * from event_registration where event_id = ?";
        pool.query(event_sql,[event_id],(err,result)=>{
            if(err)
                return res.status(500).json({message:"Internal server error"});
            return res.status(200).json({message:"Registered Students",data:result});
        });
    } catch (error) {
        return res.status(500).json({message:"Internal server error"});
    }
}

export const eventRegistrations = (req,res,next)=>{
    try {
        const std_id = req.params.id;
        const event_sql = "select * from event_registration where student_id = ?";
        pool.query(event_sql,[std_id],(err,result)=>{
            if(err)
                return res.status(500).json({message:"Internal server error"});
            return res.status(200).json({message:"Registered Students",data:result});
        });
    } catch (error) {
        return res.status(500).json({message:"Internal server error"});
    }
}

export const deleteEventRegistration = (req,res,next)=>{
    try {
        const std_id = req.params.id;

        const event_sql = "delete from event_registration where student_id = ?";
        pool.query(event_sql,[std_id],(err,result)=>{
            if(err)
                return res.status(500).json({message:"Internal server error"});
            res.status(201).json({message:"Registration successfully deleted"});
        });
    } catch (error) {
        
    }
}
