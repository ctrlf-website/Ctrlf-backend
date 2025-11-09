import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import indexRouter from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(express.json());

// 🧠 Configurar CORS
const allowedOrigins = [
  "http://localhost:5173", // tu frontend local (Vite)
  "http://localhost:3001", // o el puerto que use React
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


app.use("/api", indexRouter);
app.use(errorHandler);
export default app;
