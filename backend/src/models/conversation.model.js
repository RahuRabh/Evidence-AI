import { Schema, model } from "mongoose";

const conversationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      default: "New research session"
    },
    patientName: {
      type: String,
      trim: true,
      default: "",
    },
    activeDisease: {
      type: String,
      trim: true,
      default: "",
    },
    activeIntent: {
      type: String,
      trim: true,
      default: "",
    },
    activeLocation: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export const Conversation = model("Conversation", conversationSchema);
