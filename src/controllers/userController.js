import createError from "http-errors";
import User from "../models/User.js";


export const getUserInfo = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw createError(404, "User not found");
    }
    res.json({
      status: "success",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        articlesAmount: user.articlesAmount,
        savedArticles: user.savedArticles,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const getSavedArticles = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate({
      path: "savedArticles",
      select: "title author createdAt updatedAt"
    });
    if (!user) {
      throw createError(404, "User not found");
    }
    res.json({
      status: "success",
      data: user.savedArticles,
    });
  } catch (error) {
    next(error);
  }
};


export const addArticleToSaved = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { articleId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }
    if (user.savedArticles.includes(articleId)) {
      throw createError(400, "Article already saved");
    }
    user.savedArticles.push(articleId);
    await user.save();
    res.json({
      status: "success",
      message: "Article added to saved",
      data: user.savedArticles,
    });
  } catch (error) {
    next(error);
  }
};


export const removeArticleFromSaved = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { articleId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }
    const initialLength = user.savedArticles.length;
    user.savedArticles = user.savedArticles.filter(
      id => id.toString() !== articleId
    );
    if (user.savedArticles.length === initialLength) {
      throw createError(404, "Article not in saved list");
    }
    await user.save();
    res.json({
      status: "success",
      message: "Article removed from saved",
      data: user.savedArticles,
    });
  } catch (error) {
    next(error);
  }
};


export const updateUserInfo = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const updateData = req.body;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
      select: "-password",
    });

    if (!user) {
      throw createError(404, "User not found");
    }

    res.json({
      status: "success",
      message: "User info updated",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};


export const uploadUserAvatar = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { avatarUrl } = req.body;

    if (!avatarUrl) {
      throw createError(400, "No avatar provided");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { avatarUrl },
      { new: true, select: "-password" }
    );

    if (!user) {
      throw createError(404, "User not found");
    }

    res.json({
      status: "success",
      message: "Avatar updated",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

