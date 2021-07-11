const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const user = require("./routes/user");
const auth = require("./routes/auth");
const conversation = require("./routes/conversation");
const message = require("./routes/message");
const meeting = require("./routes/meeting");

const port = process.env.PORT || 8080;

try {
  mongoose.connect(
    "mongodb+srv://tanay:hZvwwhcL5ADqKVRZ@cluster0.6wa9w.mongodb.net/sabha?retryWrites=true&w=majority",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    }
  );
} catch (err) {
  console.log("error in database connection");
}
app.use(cors());
app.use(express.json());

app.use("/api/user", user);
app.use("/api/auth", auth);
app.use("/api/meeting", meeting);
app.use("/api/conversation", conversation);
app.use("/api/message", message);
app.get("/api/meeting-link", (req, res) => {
  res.send(uuidv4());
});

//***************** Socket.io Code ********************** */ */

let users = [];

io.on("connection", (socket) => {
  socket.on("join-room", (meetingId, userId) => {
    const user = users.find((socketId) => {
      return socketId === socket.id;
    });
    if (!user) {
      socket.join(meetingId);
      users.push(socket.id);
    }

    socket.on("message", (message) => {
      socket.to(meetingId).emit("createMessage", message);
    });

    socket.on("disconnect", () => {
      users = users.filter((socketId) => socketId !== socket.id);
    });
  });
});

server.listen(port, () => console.log(`listening on port ${port}`));
