
import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import { app } from "./app.js";

dotenv.config({
  path: ".env",
});

const port = process.env.PORT || 4000;

const startServer = () => {
  app.listen(port, () => {
    console.log(`Server is running at port : ${port}`);
  });
};

connectDB()
  .then(() => {
    startServer();
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err?.message || err);
    process.exit(1);
  });
