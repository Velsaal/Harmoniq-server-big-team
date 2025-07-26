import { getArticles, getArticleById } from "../services/articleService.js";
import createHttpError from 'http-errors';


export const getArticlesController = async (req, res) => {
    const articles = await getArticles();
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
    res.status(404).json({
	    message: 'Article not found'
    });
    return;
  }

 
  res.json({
    status: 200,
    message: `Successfully found article with id ${articleId}!`,
    data: article,
  });
};