// Article service

import { ArticlesCollection } from "../models/Article.js";

export const getArticles = async () => {
    const articles = await ArticlesCollection.find();
    return articles;
}

export const getArticleById = async (articleId) => {
    const article = await ArticlesCollection.findById(articleId);
    return article;
}

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