import Article from "../models/Article.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";
import { SORT_ORDER } from "../constants/index.js";

export const getArticles = async ({
  page,
  perPage,
  sortBy = 'rate',
  sortOrder = SORT_ORDER.DESC,
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const articlesQuery = Article.find();
  
  if(filter.ownerId){articlesQuery.where('ownerId').equals(filter.ownerId);}

  const [articles, articlesCount] = await Promise.all([
    articlesQuery.clone().skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).exec(),
    articlesQuery.clone().countDocuments(),
  ]);


  const paginationData = calculatePaginationData(articlesCount, perPage, page);

  return {
    data: articles,
    ...paginationData,
  };
};

export const getArticleById = async (articleId) => {
  const article = await Article.findById(articleId);
  return article;
};

export const createArticle = async (payload) => {
  const article = await Article.create(payload);
  return article;
};

export const deleteArticle = async (articleId, ownerId ) => {
  const article = await Article.findOneAndDelete({ _id: articleId, ownerId });
  return article;
};

export const updateArticle = async (articleId, ownerId, payload, options = {}) => {
  const rawResult = await Article.findOneAndUpdate(
    { _id: articleId, ownerId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    }
  );
  console.log(rawResult);
  if (!rawResult || !rawResult.value) return null;

  return {
    article: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
