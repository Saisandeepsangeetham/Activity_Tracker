import express from 'express';
import pool from "../Models/database.js";
import { getAllstudents, getstudentProfileID, studentLogin, studentSignup } from '../Controllers/studentControllers.js';

const studentRouter = express.Router();

studentRouter.get('/:std_id',(req,res,next)=>{
    try {
        console.log("hello world");
        //const std_id = 1;
        //need to check with the output.
        const {std_id} = req.params;
        const sql = "select * from student where student_id = ?";
    
        // Debug: Log the ID being used
        console.log(`Fetching student with ID: ${std_id}`);
    
        pool.query(sql, [std_id], (err, result) => {
          if (err) return res.status(404).json({ error: err.message });
          else return res.status(200).json({ message: "OK", data: result[0] });
        });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
});
// studentRouter.get('/',getAllstudents);
studentRouter.put('/signup',studentSignup);
studentRouter.post('/login',studentLogin);


export default studentRouter;