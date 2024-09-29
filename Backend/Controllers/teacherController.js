import { hash, compare } from 'bcrypt';

import { COOKIE_NAME } from "../Utils/constants.js";
import { createToken } from "../Utils/token.js";
import pool from "../Models/database.js";

export const teacherSignUp = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password, dept, role_id, club_id } = req.body;
    console.log(name);
    const hashedPassword = await hash(password, 10);
    console.log(hashedPassword)
    const sql = "INSERT INTO Teacher (name, email, dept, password, club_id, role_id) VALUES (?, ?, ?, ?, ?, ?)";
    pool.query(sql, [name, email, dept, hashedPassword, club_id, role_id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error creating teacher account", error: err });
      }
      return res.status(201).json({ message: 'Login successful' });
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};


export const teacherLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // SQL query to check if the teacher exists
    const checkTeacherSql = "SELECT * FROM Teacher WHERE email = ?";
    
    pool.query(checkTeacherSql, [email], async (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: 'Teacher not found' });
      }

      const teacher = result[0];

      const isPasswordValid = await compare(password, teacher.password);
      if (!isPasswordValid) {
        return res.status(422).json({ message: 'Invalid password' });
      }

      res.clearCookie(COOKIE_NAME, {
        path: "/",
        domain: "localhost",
        httpOnly: true,
        signed: true,
      });

      const expiresDate = new Date();
      expiresDate.setDate(expiresDate.getDate() + 7);

      const payload = {teacher_id: teacher.teacher_id, role_id: teacher.role_id}
      const token = createToken(payload, "7d");
        res.cookie(COOKIE_NAME, token, {
          path: "/",
          domain: "localhost",
          expires:expiresDate,
          httpOnly: true,
          signed: true,
        });

      res.cookie(COOKIE_NAME, token, {
        path: "/",
        domain: "localhost",
        expires: expiresDate,
        httpOnly: true,
        signed: true,
      });

      return res.status(200).json({ message: 'Login successful,  ' + token });
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createStudent = async (req, res) => {
    const {name, email, enrollment_no, password, phone, dept, year} = req.body;
    const hashedPassword = await hash(password, 10);
    const sql = "INSERT INTO Student (name, email, enrollment_number, password, phone_number, dept, year) values (?,?,?,?,?,?,?)";

    pool.query(sql, [name, email, enrollment_no, hashedPassword, phone, dept, year], (err, result) => {
        if(err)
            return res.status(400).json({error: err});
        return res.status(201).json({message: "student added!  "+ result});
    })

}
