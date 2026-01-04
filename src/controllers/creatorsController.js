export const getAllCreators = async (req, res, next) => {
  try {
    const creators = await User.find({}, 'name avatarUrl email');
    const creatorsWithArticlesAmount = await Promise.all(
      creators.map(async (creator) => {
        const articlesAmount = await Article.countDocuments({ ownerId: creator._id });
        return {
          _id: creator._id,
          name: creator.name,
          avatarUrl: creator.avatarUrl,
          email: creator.email,
          articlesAmount,
        };
      })
    );
    res.json(creatorsWithArticlesAmount);
  } catch (error) {
    next(error);
  }
};
