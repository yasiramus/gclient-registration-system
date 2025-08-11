"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const admin_route_1 = __importDefault(require("./routes/admin.route"));
const tracks_route_1 = __importDefault(require("./routes/tracks.route"));
const learner_route_1 = __importDefault(require("./routes/learner.route"));
const courses_route_1 = __importDefault(require("./routes/courses.route"));
const report_routes_1 = __importDefault(require("./routes/report.routes"));
const invoice_route_1 = __importDefault(require("./routes/invoice.route"));
const payment_route_1 = __importDefault(require("./routes/payment.route"));
const upload_middleware_1 = require("./middleware/upload.middleware");
const errorHandler_1 = require("./middleware/errorHandler");
const rate_limiter_1 = require("./middleware/rate.limiter");
const cookie_session_middleware_1 = require("./middleware/cookie_session.middleware");
const student_route_1 = __importDefault(require("./routes/student/student.route"));
const app = (0, express_1.default)();
const mainRouter = express_1.default.Router(); //main router
//Connect to the database
(0, db_1.dbConnection)();
/*basic middleware */
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use((0, helmet_1.default)());
app.use(cookie_session_middleware_1.cookie_session);
app.use(rate_limiter_1.globalRateLimiter);
app.use(upload_middleware_1.upload.single("image"));
app.use("/gclient/api", mainRouter); //main router entry
//all routes mount under gclient/v1/api
mainRouter.use("/admin/auth", auth_route_1.default);
mainRouter.use("/admin/tracks", tracks_route_1.default);
mainRouter.use("/admin/courses", courses_route_1.default);
mainRouter.use("/admin/learners", learner_route_1.default);
mainRouter.use("/admin/invoices", invoice_route_1.default);
mainRouter.use("/admin/initiate", 
// express.raw({ type: "application/json" }), // required by Pay stack
payment_route_1.default);
mainRouter.use("/admin/reports", report_routes_1.default);
mainRouter.use("/admin/profile", admin_route_1.default);
//student|learner
mainRouter.use("/student", student_route_1.default);
// global error handler middleware
app.use(errorHandler_1.errorHandler);
app.get("/", (req, res) => {
    res.send("Welcome to the GClient Registration System API");
});
app.use((req, res) => {
    return res.status(404).json({
        message: "Not found",
        requestedUrl: `http://localhost:4000${req.url} does not exist`,
    });
});
app.use((err, req, res, next) => {
    var _a;
    console.error("type_of_error: ", err.stack);
    res.status(err.status || 500).json({
        status: "failed",
        message: err.message || "Internal Server route Error",
        requestedUrl: `http://${(_a = process.env.HOST) !== null && _a !== void 0 ? _a : "localhost:4000"}${req.url}`,
    });
    next();
});
exports.default = app;
