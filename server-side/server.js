const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const user = require("./routes/user");
const auth = require("./routes/auth");
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
app.get("/api/meeting-link", (req, res) => {
  res.send(uuidv4());
});

server.listen(port, () => console.log(`listening on port ${port}`));
