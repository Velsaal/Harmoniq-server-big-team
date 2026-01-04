import createError from "http-errors";
import User from "../models/User.js";
import Article from "../models/Article.js";
import { saveFileLocally } from "../utils/saveFileLocally.js";

/**
 * GET /api/users/:userId
 */
export const getUserInfo = async (req, res, next) => {
  try {
    const { userId } = req.params;

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
        bio: user.bio,
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

/**
 * GET /api/users/:userId/saved-articles
 */
export const getSavedArticles = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate({
      path: "savedArticles",
      select: "title author createdAt updatedAt",
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

/**
 * POST /api/users/:userId/saved-articles/:articleId
 */
export const addArticleToSaved = async (req, res, next) => {
  try {
    const { userId, articleId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }

    if (user.savedArticles.includes(articleId)) {
      throw createError(400, "Article already saved");
    }

    user.savedArticles.push(articleId);

    const article = await Article.findById(articleId);
    if (article) {
      article.rate += 1;
      await article.save();
    }

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

/**
 * DELETE /api/users/:userId/saved-articles/:articleId
 */
export const removeArticleFromSaved = async (req, res, next) => {
  try {
    const { userId, articleId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }

    const initialLength = user.savedArticles.length;
    user.savedArticles = user.savedArticles.filter(
      (id) => id.toString() !== articleId
    );

    if (user.savedArticles.length === initialLength) {
      throw createError(404, "Article not in saved list");
    }

    const article = await Article.findById(articleId);
    if (article && article.rate > 0) {
      article.rate -= 1;
      await article.save();
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

/**
 * PATCH /api/users/:userId
 * Updates user info (bio only)
 */
export const updateUserInfo = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // optional auth check (if auth middleware attaches req.user)
    const requestingUserId = req.user?._id?.toString();
    if (requestingUserId && requestingUserId !== userId) {
      throw createError(403, "Forbidden: cannot update another user's profile");
    }

    const { bio } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { bio },
      { new: true, runValidators: true, select: "-password" }
    );

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

// Alias for bio-specific route to match router import
export const updateUserBio = updateUserInfo;

/**
 * POST /api/users/:userId/avatar
 * Upload user avatar (multer puts file into req.file)
 */
export const uploadUserAvatar = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // optional auth check (if auth middleware attaches req.user)
    const requestingUserId = req.user?._id?.toString();
    if (requestingUserId && requestingUserId !== userId) {
      throw createError(403, "Forbidden: cannot update another user's avatar");
    }

    if (!req.file) {
      throw createError(400, "Avatar file is required");
    }

    // save file + return url
    const avatarUrl = await saveFileLocally(req.file);

    const user = await User.findByIdAndUpdate(
      userId,
      { avatarUrl },
      { new: true, select: "-password" }
    );

    if (!user) {
      throw createError(404, "User not found");
    }

    res.status(200).json({
      status: "success",
      message: "Avatar updated",
      data: { avatarUrl },
    });
  } catch (error) {
    next(error);
  }
};
/**
 * GET /api/auth/current
 * Return current authorized user
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user) {
      throw createError(401, "Unauthorized");
    }

    res.json({
      status: "success",
      data: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatarUrl: req.user.avatarUrl,
        bio: req.user.bio,
        articlesAmount: req.user.articlesAmount,
        savedArticles: req.user.savedArticles,
      },
    });
  } catch (error) {
    next(error);
  }
};

