import User from "../models/User.js";

// --- Отримати інформацію про користувача ---
export const getUserInfo = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
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
    res.status(500).json({ status: "error", message: error.message });
  }
};

// --- Отримати список збережених статей ---
export const getSavedArticles = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate({
      path: "savedArticles",
      select: "title author createdAt updatedAt"
    });
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }
    res.json({
      status: "success",
      data: user.savedArticles,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// --- Додати статтю до збережених ---
export const addArticleToSaved = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { articleId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }
    if (user.savedArticles.includes(articleId)) {
      return res.status(400).json({ status: "error", message: "Article already saved" });
    }
    user.savedArticles.push(articleId);
    await user.save();
    res.json({
      status: "success",
      message: "Article added to saved",
      data: user.savedArticles,
    });
  } catch (error) {
    console.error("Error in addArticleToSaved:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// --- Видалити статтю зі збережених ---
export const removeArticleFromSaved = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { articleId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }
    const initialLength = user.savedArticles.length;
    user.savedArticles = user.savedArticles.filter(
      id => id.toString() !== articleId
    );
    if (user.savedArticles.length === initialLength) {
      return res.status(404).json({ status: "error", message: "Article not in saved list" });
    }
    await user.save();
    res.json({
      status: "success",
      message: "Article removed from saved",
      data: user.savedArticles,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// --- Оновити інформацію про користувача за userId ---
export const updateUserInfo = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updateData = req.body;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
      select: "-password",
    });

    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    res.json({
      status: "success",
      message: "User info updated",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// --- Додати/оновити аватар користувача за userId ---
export const uploadUserAvatar = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { avatarUrl } = req.body;

    if (!avatarUrl) {
      return res.status(400).json({ status: "error", message: "No avatar provided" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { avatarUrl },
      { new: true, select: "-password" }
    );

    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    res.json({
      status: "success",
      message: "Avatar updated",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
