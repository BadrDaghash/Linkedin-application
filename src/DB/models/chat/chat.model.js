import { required } from "joi";
import { Types } from "mongoose";

const messageSchema = new Schema(
  {
    message: { type: String, required: true },
    senderId: { type: Types.ObjectId, ref: "User", required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false } // prevent Mongoose from automaticaly adding { _id  } for every message object
);

const chatSchema = new Schema(
  {
    senderId: { type: Types.ObjectId, ref: "User", required: true }, 
    receiverId: { type: Types.ObjectId, ref: "User", required: true }, 
    messages: [messageSchema], 
  },
  { timestamps: true }
);

const Chat = model("Chat", chatSchema);

export default Chat;