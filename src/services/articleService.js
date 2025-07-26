// Article service

import { ArticlesCollection } from "../models/Article.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";


export const getArticles = async ({ page, perPage }) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const articlesQuery = ArticlesCollection.find();
    const articlesCount = await ArticlesCollection.find().merge(articlesQuery).countDocuments();

    const articles = await articlesQuery.skip(skip).limit(limit).exec();
    const paginationData = calculatePaginationData(articlesCount, perPage, page);

    return {
        data: articles,
        ...paginationData,
    };
};

export const getArticleById = async (articleId) => {
    const article = await ArticlesCollection.findById(articleId);
    return article;
};

export const createArticle = async (payload) => {
    const article = await ArticlesCollection.create(payload);
    return article;
};

export const deleteArticle = async (articleId) => {
    const article = await ArticlesCollection.findOneAndDelete({ _id: articleId });
    return article;
}

export const updateArticle = async (articleId, payload, options = {}) => {
    const rawResult = await ArticlesCollection.findOneAndUpdate(
        { _id: articleId },
        payload,
        {
        new: true,
        includeResultMetadata: true,
        ...options,
        });
    console.log(rawResult);
    if (!rawResult || !rawResult.value) return null;
    
    return {
        article: rawResult.value, 
         isNew: Boolean(rawResult?.lastErrorObject?.upserted),
    };
};