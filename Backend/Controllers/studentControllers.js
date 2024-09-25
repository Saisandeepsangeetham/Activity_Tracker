import pool from "../Models/database.js";
import { compare, hash } from "bcrypt";
import { COOKIE_NAME } from "../Utils/constants.js";
import { createToken } from "../Utils/token.js";

//for testing purposes only.
export const getAllstudents = async (req, res, next) => {
  try {
    const sql = "select * from student";
    pool.query(sql, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      else return res.status(200).json({ message: "success", data: result });
    });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};

export const studentSignup = async (req, res, next) => {
  try {
    const { name, email, enrollmentNumber, password, confirmPassword } =
      req.body;
    if (password !== confirmPassword)
      return res.status(422).json({ message: "Passwords do not match" });

    const sql =
      "select * from student where name = ? and email = ? and enrollment_number = ?";
    pool.query(sql, [name, email, enrollmentNumber], async (err, result) => {
      if (err)
        return res
          .status(422)
          .json({ message: err.message, data: "Unauthorized Access" });
      if (result.length === 0)
        return res.status(404).json({ message: "Student does not exist" });

      const hashedPassword = await hash(password, 10);

      //checking purposess...
      console.log(hashedPassword);
      const updateSql =
        "update student set password = ? where name = ? and email = ? and enrollment_number = ?";
      pool.query(
        updateSql,
        [hashedPassword, name, email, enrollmentNumber],
        (err, updateresult) => {
          if (err)
            return res
              .status(500)
              .json({ message: err.message, data: "Internal Server Error" });
          else {
            //clear the previous cookie
            res.clearCookie(COOKIE_NAME, {
              path: "/",
              domain: "localhost",
              httponly: true,
              signed: true,
            });

            const expiresDate = new Date();
            expiresDate.setDate(expiresDate.getDate() + 7);

            const token = createToken(
              result.enrollment_number,
              result.email,
              "7d"
            );
            res.cookie(COOKIE_NAME, token, {
              path: "/",
              domain: "localhost",
              expiresDate,
              httponly: true,
              signed: true,
            });
            return res
              .status(200)
              .json({ message: "success", data: updateresult });
          }
        }
      );
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, data: "Internal Server" });
  }
};

export const studentLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const checkuserSql = "select * from student where email = ?";

    pool.query(checkuserSql, [email], async (err, result) => {
      if (err)
        return res.status(404).json({ message: err, data: "Not found " });
      else {
        if(result.length === 0) return res.status(404).json({ message:"Not found"});

        if (!result.password) return res.status(422).json({ message: "No password found for user" });
        
        const isPassword = await compare(password, result.password);
        if (!isPassword) {
          return res.status(422).json({ message: "Invalid password" });
        }

        //clear the previous cookie
        res.clearCookie(COOKIE_NAME, {
          path: "/",
          domain: "localhost",
          httpOnly: true,
          signed: true,
        });

        const expiresDate = new Date();
        expiresDate.setDate(expiresDate.getDate() + 7);

        const token = createToken(result.enrollment_number, result.email, "7d");
        res.cookie(COOKIE_NAME, token, {
          path: "/",
          domain: "localhost",
          expires:expiresDate,
          httpOnly: true,
          signed: true,
        });

        return res.status(200).json({ message: "login successful" });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getstudentProfileID = async (req, res, next) => {
  try {
    const std_id = req.params.id;
    const sql = "select * from student where student_id = ?";

    pool.query(sql, [std_id], (err, result) => {
      if (err) return res.status(404).json({ error: err.message });
      else return res.status(200).json({ message: "OK", data: result[0] });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
