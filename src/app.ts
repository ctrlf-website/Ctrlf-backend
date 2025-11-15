import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import indexRouter from "./routes/index";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();

// ✅ CORS antes que cualquier otro middleware
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3001",
  "https://ctrlf-website.github.io",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);

// ✅ Permitir preflight manualmente (a veces Express no responde solo)
app.options(/.*/, cors());

// Ahora sí, parsear JSON
app.use(express.json());

// Tus rutas y middlewares
app.use("/api", indexRouter);
app.use(errorHandler);

export default app;
