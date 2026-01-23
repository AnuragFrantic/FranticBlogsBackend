// const express = require("express");
// const dotenv = require("dotenv");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const path = require("path"); // ✅ REQUIRED

// const fs = require("fs");
// const https = require("https");
// const http = require("http");


// // ✅ Import common routes
// const categoryroutes = require("./routes/categoryroutes"); // routes/index.js
// const postroutes = require("./routes/postRoutes");
// const tagRoutes = require("./routes/tagRoutes");
// const authRoutes = require("./routes/authRoutes");




// const app = express();
// dotenv.config();

// const port = process.env.PORT || 5000;

// // ✅ Middlewares (ALWAYS before routes)
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ✅ Serve uploads folder
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // ✅ Test route
// app.get("/", (req, res) => {
//     res.send("✅ API is working");
// });

// // ✅ Common API routes
// app.use("/api/category", categoryroutes);
// app.use("/api/post", postroutes);
// app.use("/api/tag", tagRoutes);
// app.use("/api/auth", authRoutes);



// // ✅ MongoDB connect
// const connect = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URL);
//         console.log("✅ MongoDB database connected");
//     } catch (err) {
//         console.error("❌ MongoDB database connection failed:", err.message);
//         process.exit(1);
//     }
// };

// // ✅ Start server
// // app.listen(port, async () => {
// //     await connect();
// //     console.log("🚀 Server is up on port " + port);
// // });



// const options = {
//     cert: fs.readFileSync('/etc/letsencrypt/live/frantic.in/fullchain.pem', 'utf-8'),
//     key: fs.readFileSync('/etc/letsencrypt/live/frantic.in/privkey.pem', 'utf-8'),
// };

// https.createServer(options, app)
//     .listen(port, function (req, res) {
//         connect()
//         console.log("Server started at port https " + port);
//     });



const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const https = require("https");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// ✅ Allowed origins (Frontend URLs)
const allowedOrigins = [
    "http://localhost:3000",
    "https://frantic-blog.vercel.app",
    "https://www.frantic.in/",
    // Add your custom domain when you connect it:
    // "https://blogs.frantic.in",
];

// ✅ Middlewares
app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
const categoryroutes = require("./routes/categoryroutes");
const postroutes = require("./routes/postRoutes");
const tagRoutes = require("./routes/tagRoutes");
const authRoutes = require("./routes/authRoutes");

// ✅ Test route
app.get("/", (req, res) => {
    res.send("✅ API is working");
});

// ✅ API routes
app.use("/api/category", categoryroutes);
app.use("/api/post", postroutes);
app.use("/api/tag", tagRoutes);
app.use("/api/auth", authRoutes);

// ✅ MongoDB connect
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    }
};

// ✅ Start HTTPS server
const startServer = async () => {
    await connectDB();

    const options = {
        cert: fs.readFileSync(
            "/etc/letsencrypt/live/frantic.in/fullchain.pem",
            "utf-8"
        ),
        key: fs.readFileSync(
            "/etc/letsencrypt/live/frantic.in/privkey.pem",
            "utf-8"
        ),
    };

    https.createServer(options, app).listen(port, () => {
        console.log(`🚀 HTTPS Server running on https://frantic.in:${port}`);
    });
};

startServer();
