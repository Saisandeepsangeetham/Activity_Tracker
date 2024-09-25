import app from './app.js';
import { connectToDatabase } from "./Models/database.js";

const port = process.env.PORT || 9999;

connectToDatabase((err) => {
  if (err) {
    console.log("Failed to connect to the database");
    process.exit(1);
  } else {
    app.listen(port, (err) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log(`server is running on the port ${port}`);
      }
    });
  }
});
