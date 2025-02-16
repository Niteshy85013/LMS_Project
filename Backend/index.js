import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import contactRoute from "./route/contactRoute.js";
import userRoute from "./route/userRoute.js"; 
import bookRoute from "./route/bookRoute.js"
import categoryRoutes from "./route/categoryRoutes.js";
import borrowRoute from "./route/borrowRoute.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { userInfo } from "os";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
const PORT = process.env.PORT || 5000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/books", bookRoute);
app.use("/api/users",userRoute)
app.use("/api/categories", categoryRoutes);
app.use("/api/contacts", contactRoute)
app.use("/api/borr",borrowRoute)

// Middleware to authenticate requests
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.user = user;
        next();
    });
};

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});



