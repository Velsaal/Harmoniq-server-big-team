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