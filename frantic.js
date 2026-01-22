const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // ✅ REQUIRED

const fs = require("fs");
const https = require("https");
const http = require("http");


// ✅ Import common routes
const categoryroutes = require("./routes/categoryroutes"); // routes/index.js
const postroutes = require("./routes/postRoutes");
const tagRoutes = require("./routes/tagRoutes");
const authRoutes = require("./routes/authRoutes");




const app = express();
dotenv.config();

const port = process.env.PORT || 5000;

// ✅ Middlewares (ALWAYS before routes)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Test route
app.get("/", (req, res) => {
    res.send("✅ API is working");
});

// ✅ Common API routes
app.use("/api/category", categoryroutes);
app.use("/api/post", postroutes);
app.use("/api/tag", tagRoutes);
app.use("/api/auth", authRoutes);



// ✅ MongoDB connect
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("✅ MongoDB database connected");
    } catch (err) {
        console.error("❌ MongoDB database connection failed:", err.message);
        process.exit(1);
    }
};

// ✅ Start server
// app.listen(port, async () => {
//     await connect();
//     console.log("🚀 Server is up on port " + port);
// });



const options = {
    cert: fs.readFileSync('/etc/letsencrypt/live/frantic.in/fullchain.pem', 'utf-8'),
    key: fs.readFileSync('/etc/letsencrypt/live/frantic.in/privkey.pem', 'utf-8'),
};

https.createServer(options, app)
    .listen(port, function (req, res) {
        connect()
        console.log("Server started at port https " + port);
    });