import express from "express";
import dotenv from "dotenv";
import indexRouter from "./routes/index.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api", indexRouter);

export default app;
