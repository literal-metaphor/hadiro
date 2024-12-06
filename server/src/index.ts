// Core dependencies and type declarations
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import reqHandler from "./utils/reqHandler.js";

// Configure app to work with .env
dotenv.config();

// Setup Express app with CORS and basic request processing with urlencoded form data and JSON, and append protective headers with Helmet.js
const app = express();
app.use(cors({
  origin: "http://localhost", // Only allow this specific domain
  methods: "GET, POST, PUT, DELETE", // Allow only these methods
  allowedHeaders: "Content-Type, Authorization", // Allow only these headers
  credentials: true, // Allow cookies/auth headers
  maxAge: 86400, // Cache the preflight response for 24 hours (optional)
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// User endpoints
const v1UserRouter = express.Router();
app.use("/api/v1/users", v1UserRouter);
v1UserRouter.post("/auth/login", async (req, res) => {
  await reqHandler(req, res, "auth/login");
});
v1UserRouter.post("/auth/otp", async (req, res) => {
  await reqHandler(req, res, "auth/otp");
});

// Attendance endpoints
const v1AttendanceRouter = express.Router();
app.use("/api/v1/attendance", v1AttendanceRouter);
v1AttendanceRouter.get("/quick-stats", async (req, res) => {
  await reqHandler(req, res, "attendance/quickStats");
})

// Start server on available port specified in .env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});