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
app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ extended: true, limit: '4mb' }));
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

// Student endpoints
// Note: haven't tested this yet, can someone see if this works?
const v1StudentRouter = express.Router();
app.use("/api/v1/student", v1StudentRouter);
v1StudentRouter.post("/create", async (req, res) => {
  await reqHandler(req, res, "student/create", true);
});
v1StudentRouter.post("/paginate", async (req, res) => {
  await reqHandler(req, res, "student/paginate", true);
});
v1StudentRouter.post("/show", async (req, res) => {
  await reqHandler(req, res, "student/show", true);
});
v1StudentRouter.post("/update", async (req, res) => {
  await reqHandler(req, res, "student/update", true);
});
v1StudentRouter.post("/destroy", async (req, res) => {
  await reqHandler(req, res, "student/destroy", true);
});

// TODO: add CRUD endpoints for otiher resources
// Attendance endpoints
const v1AttendanceRouter = express.Router();
app.use("/api/v1/attendance", v1AttendanceRouter);
v1AttendanceRouter.get("/stats", async (req, res) => {
  await reqHandler(req, res, "attendance/stats", true);
});


// Face endpoints
const v1FaceRouter = express.Router();
app.use("/api/v1/face", v1FaceRouter);
v1FaceRouter.post("/find-closest-matches", async (req, res) => {
  await reqHandler(req, res, "face/findClosestMatches");
})


// Start server on available port specified in .env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});