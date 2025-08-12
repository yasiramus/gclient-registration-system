import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import { dbConnection } from "./db";
import authRoute from "./routes/auth.route";
import adminRoute from "./routes/admin.route";
import trackRoute from "./routes/tracks.route";
import learnerRoute from "./routes/learner.route";
import coursesRoute from "./routes/courses.route";
import reportRouter from "./routes/report.routes";
import invoiceRoute from "./routes/invoice.route";
import paymentRouter from "./routes/payment.route";
import { upload } from "./middleware/upload.middleware";
import { errorHandler } from "./middleware/errorHandler";
import { globalRateLimiter } from "./middleware/rate.limiter";
import { cookie_session } from "./middleware/cookie_session.middleware";
import studentRouter from "./routes/student/student.route";

const app = express();
const mainRouter = express.Router(); //main router

//Connect to the database
dbConnection();

/*basic middleware */
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(helmet());

app.use(cookie_session);
app.use(globalRateLimiter);
app.use(upload.single("image"));

app.use("/gclient/api", mainRouter); //main router entry

//all routes mount under gclient/v1/api
mainRouter.use("/admin/auth", authRoute);
mainRouter.use("/admin/tracks", trackRoute);
mainRouter.use("/admin/courses", coursesRoute);
mainRouter.use("/admin/learners", learnerRoute);
mainRouter.use("/admin/invoices", invoiceRoute);
mainRouter.use(
  "/admin/initiate",
  // express.raw({ type: "application/json" }), // required by Pay stack
  paymentRouter
);
mainRouter.use("/admin/reports", reportRouter);
mainRouter.use("/admin/profile", adminRoute);

//student|learner
mainRouter.use("/student", studentRouter);

// global error handler middleware
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Welcome to the GClient Registration System API");
});

app.use((req, res) => {
  return res.status(404).json({
    message: "Not found",
    requestedUrl: `http://localhost:4000${req.url} does not exist`,
  });
});

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("type_of_error: ", err.stack);
    res.status(err.status || 500).json({
      status: "failed",
      message: err.message || "Internal Server route Error",
      requestedUrl: `http://${process.env.HOST ?? "localhost:4000"}${req.url}`,
    });
    next();
  }
);

export default app;
