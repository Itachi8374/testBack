const router = require("express").Router();
const Message = require("../models/message");

//add
router.post("/", async (req, res) => {
  const newMessage = new Message(req.body);
  try {
    const savedMessage = await newMessage.save();
    res.status(200).send(savedMessage);
  } catch (err) {
    res.status(500).send(err);
  }
});

//get
router.get("/:meetId", async (req, res) => {
  try {
    const messages = await Message.find({
      meetingId: req.params.meetId,
    });
    res.status(200).send(messages);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
