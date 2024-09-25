import express from "express";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import morgan from 'morgan';

import { connectToDatabase } from "./Models/database.js";
import { errorHandler } from "./Middlewares/errorMiddleWare.js";

dotenv.config();

const port = process.env.PORT || 9999;
const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));

app.use("/activities",activities);
app.use("/events", eventRouter);
app.use("/categories", categoryRouter);
app.use("/roles", rolesRouter);

app.use(errorHandler);

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
