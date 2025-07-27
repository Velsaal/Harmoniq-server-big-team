// articleController

import { getArticles, getArticleById, createArticle, deleteArticle, updateArticle } from "../services/articleService.js";
import createHttpError from 'http-errors';
import { parsePaginationParams } from "../utils/parsePaginationParams.js";



export const getArticlesController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const articles = await getArticles({
        page,
        perPage
    });
    
     res.json({
    status: 200,
    message: 'Successfully found articles!',
    data: articles,
  });
};


export const getArticleByIdController = async (req, res) => {
  const { articleId } = req.params;
  const article = await getArticleById(articleId);
  

  if (!article) {
   throw createHttpError(404, 'Article not found');
  }

 
  res.json({
    status: 200,
    message: `Successfully found article with id ${articleId}!`,
    data: article,
  });
};



export const createArticleController = async (req, res) => {
    console.log('req.user:', req.user); 
    
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized: user not found' });
    }
    
    const article = await createArticle({
        ...req.body,
       userId: req.user._id,
    });
     res.status(201).json({
    status: 201,
    message: `Successfully created an article!`,
    data: article,
  });
};


export const deleteArticleController = async (req, res) => {
    const { articleId } = req.params;
    const userId = req.user._id;
    const article = await deleteArticle(articleId, userId);

    if (!article) {
      throw createHttpError(404, 'Article not found');
    }

    res.status(204).send();
}

export const updateArticleController = async (req, res, next) => {
    const { articleId } = req.params;
    const userId = req.user._id;
    const result = await updateArticle(articleId, userId, req.body);

    if (!result) {
         throw createHttpError(404, 'Article not found');
    }

     res.json({
    status: 200,
    message: `Successfully update an article!`,
    data: result.article,
  });
};