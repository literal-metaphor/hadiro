// Core dependencies and type declarations
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cron from "node-cron";

import reqHandler from "./utils/reqHandler.js";
import { RouteDictionary } from "./utils/types/RouteDictionary.js";
import dlJournal from "./functions/student/dlJournal.js";
import { attendancePrisma, studentPrisma } from "../prisma/clients.js";
import { randomUUID } from "crypto";
import { AttendanceStatusEnum } from "./utils/enums/AttendanceStatus.js";

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
    method: "post",
    path: "uploadEvidence",
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
    path: "stats",
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

app.get(`/api/v1/student/dlJournal`, dlJournal as any); // This works, but I have no idea where the type error came from

// Start server on available port specified in .env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Cron job explanation in case dumb me forgot:
// "0 8 * * *" means every day every 8 AM
// It should get all students who haven't submitted attendance today and mark them as TK
cron.schedule(`0 8 * * *`, async () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const unattending = await studentPrisma.findMany({
    where: {
      attendance: {
        none: {
          created_at: {
            gte: startOfDay,
            lt: endOfDay,
          }
        }
      }
    }
  });

  for (const u of unattending) {
    await attendancePrisma.create({
      data: {
        id: randomUUID(),
        status: AttendanceStatusEnum.TK,
        student: {
          connect: {
            id: u.id
          }
        }
      }
    });
  }
});