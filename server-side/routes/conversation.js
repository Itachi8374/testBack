const router = require("express").Router();
const Conversation = require("../models/conversation");

//new conversation
router.post("/", async (req, res) => {
  console.log(req.body);
  const newConversation = new Conversation({
    meetingId: req.body.meetId,
    meetingName: req.body.name,
    participants: [req.body.hostId],
  });
  try {
    const setConversation = await newConversation.save();
    res.status(200).json(setConversation);
  } catch (err) {
    res.status(500).send(err);
  }
});

//get conversation of a user
router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      participants: { $in: [req.params.userId] },
    });
    res.status(200).send(conversation);
  } catch (err) {
    res.status(500).send(err);
  }
});

//add participant
router.put("/:meetId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      meetingId: req.params.meetId,
    });
    if (conversation.participants.find((id) => id === req.body.participantId))
      return res.status(200).send("User already added");
    conversation.participants.push(req.body.participantId);
    const result = await conversation.save();
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
