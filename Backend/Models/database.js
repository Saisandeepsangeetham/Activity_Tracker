import { createPool } from "mysql";
import dotenv from 'dotenv';

dotenv.config();
const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    connectionLimit:10
});

function connectToDatabase(callback){
    pool.getConnection((err,connection)=>{
        if(err){
            console.log('Connection failed: ',err.message);
            callback(err,null);
        }
        else{
            console.log('My sql connected');
            connection.release();
            callback(null,pool);
        }
    });
}

export {connectToDatabase,pool};

export default pool;