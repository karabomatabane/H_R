const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const studentRoute = require("./routes/student");
const staffRoute = require("./routes/staff");
const residenceRoute = require("./routes/residence");
const applicationRoute = require("./routes/application");
const authRoute = require("./routes/auth");
const socket = require("socket.io");
const cors = require('cors');

app.use(cors({
    origin: '*'
}));

dotenv.config();

mongoose.connect(
    process.env.MONGO_URL
)
.then(() => console.log("DBConnection Sucessful!"))
.catch((err) => {
    console.log(err);
});

app.use(express.json());
app.use("/api/student", studentRoute);
app.use("/api/staff", staffRoute);
app.use("/api/residence", residenceRoute);
app.use("/api/application", applicationRoute);
app.use("/api/auth", authRoute);


const server = app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on http://localhost:3000");
});

const io = socket(server);
io.on("connection", (socket) => {
    console.log("Socket connection successful!");

    socket.on("disconnect", () =>{
        console.log("Socket connection ended!");
    }) 

    socket.on("send-notification", (data) => {
        socket.broadcast.emit("new-notification", data);
    });
});