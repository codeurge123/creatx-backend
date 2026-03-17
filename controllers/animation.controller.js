import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Animation } from "../models/animation.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createAnimation = asyncHandler(async (req, res) => {
  const { title, html, css, js, category, isPublic } = req.body;

  if (!title || !html || !css) {
    throw new ApiError(400, "Title, HTML, and CSS are required");
  }

  const animation = await Animation.create({
    title,
    html,
    css,
    js: js || "",
    category: category || "css",
    isPublic: isPublic || false,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, animation, "Animation created successfully"));
});

const getUserAnimations = asyncHandler(async (req, res) => {
  const animations = await Animation.find({ owner: req.user._id }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, animations, "User animations fetched successfully")
    );
});

const getAnimationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const animation = await Animation.findById(id);

  if (!animation) {
    throw new ApiError(404, "Animation not found");
  }

  // Check if user owns the animation or it's public
  if (
    animation.owner.toString() !== req.user._id.toString() &&
    !animation.isPublic
  ) {
    throw new ApiError(403, "Access denied");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, animation, "Animation fetched successfully"));
});

const updateAnimation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, html, css, js, category, isPublic } = req.body;

  const animation = await Animation.findById(id);

  if (!animation) {
    throw new ApiError(404, "Animation not found");
  }

  if (animation.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Access denied");
  }

  const updatedAnimation = await Animation.findByIdAndUpdate(
    id,
    {
      title,
      html,
      css,
      js,
      category,
      isPublic,
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedAnimation, "Animation updated successfully")
    );
});

const deleteAnimation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const animation = await Animation.findById(id);

  if (!animation) {
    throw new ApiError(404, "Animation not found");
  }

  if (animation.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Access denied");
  }

  await Animation.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Animation deleted successfully"));
});

const getPublicAnimations = asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;

  const query = { isPublic: true };
  if (category && category !== "all") {
    query.category = category;
  }

  const animations = await Animation.find(query)
    .populate("owner", "name")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Animation.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        animations,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
      "Public animations fetched successfully"
    )
  );
});

const togglePublic = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const animation = await Animation.findById(id);

  if (!animation) {
    throw new ApiError(404, "Animation not found");
  }

  if (animation.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Access denied");
  }

  animation.isPublic = !animation.isPublic;
  await animation.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        animation,
        `Animation ${animation.isPublic ? "made public" : "made private"}`
      )
    );
});

const toggleLike = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  const animation = await Animation.findById(id);
  if (!animation) {
    throw new ApiError(404, "Animation not found");
  }

  const alreadyLiked = animation.likedBy.includes(userId);

  if (alreadyLiked) {
    animation.likedBy.pull(userId);
    animation.likesCount = Math.max(animation.likesCount - 1, 0);
  } else {
    animation.likedBy.push(userId);
    animation.likesCount += 1;
  }

  await animation.save();

  // also update user record
  const user = await User.findById(userId);
  if (alreadyLiked) {
    user.likedAnimations.pull(animation._id);
  } else {
    user.likedAnimations.push(animation._id);
  }
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(200, { liked: !alreadyLiked, likesCount: animation.likesCount }, "Toggled like")
  );
});

export {
  createAnimation,
  getUserAnimations,
  getAnimationById,
  updateAnimation,
  deleteAnimation,
  getPublicAnimations,
  togglePublic,
  toggleLike,
};