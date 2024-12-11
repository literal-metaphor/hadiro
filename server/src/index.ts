// Core dependencies and type declarations
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import reqHandler from "./utils/reqHandler.js";
import { RouteDictionary } from "./utils/types/RouteDictionary.js";

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

// Define endpoints
const routes: RouteDictionary[] = [
  // User
  {
    resource: "user",
    method: "post",
    path: "auth/login",
  },
  {
    resource: "user",
    method: "post",
    path: "auth/otp",
  },

  // Student
  {
    resource: "student",
    method: "post",
    path: "create",
    level: 3,
  },
  {
    resource: "student",
    method: "get",
    path: "paginate",
    level: 1,
  },
  {
    resource: "student",
    method: "get",
    path: "show",
    level: 1,
  },
  {
    resource: "student",
    method: "put",
    path: "update",
    level: 3,
  },
  {
    resource: "student",
    method: "delete",
    path: "destroy",
    level: 3,
  },

  // Attendance
  {
    resource: "attendance",
    method: "post",
    path: "create",
    level: 2,
  },
  {
    resource: "attendance",
    method: "get",
    path: "paginate",
    level: 1,
  },
  {
    resource: "attendance",
    method: "get",
    path: "insight",
    level: 1,
  },
  {
    resource: "attendance",
    method: "get",
    path: "show",
    level: 1,
  },
  {
    resource: "attendance",
    method: "put",
    path: "update",
    level: 2,
  },
  {
    resource: "attendance",
    method: "delete",
    path: "destroy",
    level: 2,
  },

  // Inattendance
  {
    resource: "inattendance",
    method: "post",
    path: "create",
    level: 2,
  },
  {
    resource: "inattendance",
    method: "get",
    path: "paginate",
    level: 1,
  },
  {
    resource: "inattendance",
    method: "get",
    path: "show",
    level: 1,
  },
  {
    resource: "inattendance",
    method: "put",
    path: "update",
    level: 2,
  },
  {
    resource: "inattendance",
    method: "delete",
    path: "destroy",
    level: 2,
  },

  // Guest
  {
    resource: "guest",
    method: "post",
    path: "create",
    level: 2,
  },
  {
    resource: "guest",
    method: "get",
    path: "show",
    level: 1,
  },
  {
    resource: "guest",
    method: "put",
    path: "update",
    level: 2,
  },
  {
    resource: "guest",
    method: "delete",
    path: "destroy",
    level: 2,
  },

  // Violation
  {
    resource: "violation",
    method: "post",
    path: "create",
    level: 2,
  },
  {
    resource: "violation",
    method: "get",
    path: "show",
    level: 1,
  },
  {
    resource: "violation",
    method: "put",
    path: "update",
    level: 2,
  },
  {
    resource: "violation",
    method: "delete",
    path: "destroy",
    level: 2,
  },

  // Face
  {
    resource: "face",
    method: "post",
    path: "findClosestMatches",
  },
];

routes.forEach((route) => {
  app[route.method](`/api/v1/${route.resource}/${route.path}` , async (req, res) => {
    await reqHandler(req, res, `${route.resource}/${route.path}`, !!route.level, route.level);
  });
});

// Start server on available port specified in .env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});