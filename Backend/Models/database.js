import { createPool } from "mysql";

const pool = createPool({
    host: "localhost",
    user: "root",
    password:"Saiteja123!@#",
    database: "tracker",
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