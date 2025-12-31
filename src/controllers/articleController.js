import {
  getArticles,
  getArticleById,
  createArticle,
  deleteArticle,
  updateArticle
} from "../services/articleService.js";
import createHttpError from 'http-errors';
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";

export const getArticlesController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    const articles = await getArticles({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
    });



    res.json({
      status: 200,
      message: 'Successfully found articles!',
      data: articles,
    });
  } catch (error) {
    next(error);
  }
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

export const createArticleController = async (req, res, next) => {

     if (!req.file) {
    throw createHttpError(400, 'Image is required');
  }

    const img = req.file;
    let imgUrl;

    if (img) {
      imgUrl = await saveFileToCloudinary(img);
  }
  
    const article = await createArticle({
      ...req.body,
      author: req.user.name,
      name: req.user.name,
      ownerId: req.user._id,
      img: imgUrl,
    });

    res.status(201).json({
      status: 201,
      message: `Successfully created an article!`,
      data: article,
    });
};

export const deleteArticleController = async (req, res) => {  
    const { articleId } = req.params;
  const ownerId = req.user._id;
  const article = await deleteArticle(articleId, ownerId);
  

    if (!article) {
      throw createHttpError(404, 'Article not found');
    }

    res.status(204).send();
};

export const updateArticleController = async (req, res) => {
  
    const { articleId } = req.params;
    const ownerId = req.user._id;
    const img = req.file;
    let imgUrl;

    if (img) {
      imgUrl = await saveFileToCloudinary(img);
    }

    const result = await updateArticle(articleId, ownerId, {
      ...req.body,
      img: imgUrl,
    });

    if (!result) {
      throw createHttpError(404, 'Article not found');
    }

    res.json({
      status: 200,
      message: `Successfully update an article!`,
      data: result.article,
    });
  
};
