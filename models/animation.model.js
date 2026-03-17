import mongoose from "mongoose";

const animationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    html: {
      type: String,
      required: true,
    },
    css: {
      type: String,
      required: true,
    },
    js: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: ["css", "js", "html"],
      default: "css",
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Animation = mongoose.model("Animation", animationSchema);