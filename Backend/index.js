import express from "express";
import bodyParser from "body-parser";
import dotenv from 'dotenv';

import roles from './Routes/roles.js';
import activities from "./Routes/activities.js";
import { connectToDatabase } from "./Models/database.js";

dotenv.config();
const port = process.env.PORT || 9999;
const app = express();

app.use(bodyParser.json());

app.use("/roles", roles);
app.use("/activities",activities);

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
