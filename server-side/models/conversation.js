const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    meetingId: {
      type: String,
    },
    meetingName: {
      type: String,
    },
    participants: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
