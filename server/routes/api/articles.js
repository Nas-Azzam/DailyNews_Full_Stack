const express = require('express');
let router = express.Router();
const { checkLoggedIn } = require('../../middleware/auth');
const { grantAccess } = require('../../middleware/roles');
const { sortArgsHelper } = require('../../config/helpers');

// model
const { Article } = require('../../models/article_model');

// add single article - DONE
// admin get,patch,delete single article (draft or public)
// get articles no auth
// fetch articles load more
// fetch articles, with pagination

router
  .route('/admin/add_articles')
  .post(
    checkLoggedIn,
    grantAccess('createAny', 'article'),
    async (req, res) => {
      try {
        //// run some other code to validate
        const article = new Article({
          ...req.body,
          score: parseInt(req.body.score),
        });
        const result = await article.save();
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json({ message: 'Error adding article', error: error });
      }
    }
  );

router
  .route('/admin/:id')
  .get(checkLoggedIn, grantAccess('readAny', 'article'), async (req, res) => {
    try {
      const article = await Article.findById(req.params.id);
      if (!article || article.lenght === 0) {
        return res.status(404).json({ message: 'Article not found' });
      }
      res.status(200).json(article);
    } catch (error) {
      res.status(400).json({ message: 'Error getting article', error: error });
    }
  })
  .patch(
    checkLoggedIn,
    grantAccess('updateAny', 'article'),
    async (req, res) => {
      try {
        const _id = req.params.id;
        const article = await Article.findOneAndUpdate(
          { _id },
          {
            $set: req.body,
          },
          { new: true }
        );
        if (!article || article.lenght === 0) {
          return res.status(404).json({ message: 'Article not found' });
        }
        res.status(200).json(article);
      } catch (error) {
        res
          .status(400)
          .json({ message: 'Error updating article', error: error });
      }
    }
  )
  .delete(
    checkLoggedIn,
    grantAccess('deleteAny', 'article'),
    async (req, res) => {
      try {
        const _id = req.params.id;
        const article = await Article.findOneAndDelete({ _id });
        if (!article || article.lenght === 0) {
          return res.status(404).json({ message: 'Article not found' });
        }
        res.status(200).json({ _id: article._id, message: 'Article deleted' });
      } catch (error) {
        res
          .status(400)
          .json({ message: 'Error deleting article', error: error });
      }
    }
  );

router.route('/getbyid/:id').get(async (req, res) => {
  try {
    const _id = req.params.id;
    const article = await Article.find({ _id: _id, status: 'public' });
    if (!article || article.lenght === 0) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.status(200).json(article);
  } catch (error) {
    res.status(400).json({ message: 'Error getting article', error: error });
  }
});
router.route('/loadmore').post(async (req, res) => {
  try {
    let sortArgs = sortArgsHelper(req.body);

    const articles = await Article.find({ status: 'public' })
      .sort([[sortArgs.sortBy, sortArgs.order]])
      .skip(sortArgs.skip)
      .limit(sortArgs.limit);

    res.status(200).json(articles);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Error fetching articles', error });
  }
});

// pagination
router
  .route('/admin/paginate')
  .post(checkLoggedIn, grantAccess('readAny', 'articles'), async (req, res) => {
    try {
      // let AagQurey = Article.aggregate([
      //   {
      //     $match: { status: 'public' },
      //   },
      //   {
      //     $match: {title: {$regex: req.body.search, $options: 'i'}},
      //   }
      // ]);

      const limit = req.body.limit ? req.body.limit : 5;
      const AagQurey = Article.aggregate();
      const options = {
        page: req.body.page ? req.body.page : 1,
        limit: limit,
        sort: { _id: 'desc' },
      };
      const articles = await Article.aggregatePaginate(AagQurey, options);
      res.status(200).json(articles);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching articles', error });
    }
  });

module.exports = router;
