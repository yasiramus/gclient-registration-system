import express from "express";
import morgan from "morgan"
import cors from "cors";

import { dbConnection } from "./db";
import { authRoute } from "./routes/users";
const app = express();

const Port = 6000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(morgan("dev"));

dbConnection();

app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
    res.send("Welcome to the GClient Registration System API");
});

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

app.listen(Port, () => {
    console.log(`Server is running on Port: ${Port}`);
});