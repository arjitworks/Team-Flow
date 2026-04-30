import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middlewares/error.js";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: [env.clientUrl, "http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
  }),
);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);
