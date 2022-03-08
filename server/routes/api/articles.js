const express = require('express');
const router = express.Router();
const { checkLoggedIn } = require('../../middleware/auth');
const { grantAccess } = require('../../middleware/roles');

// model
const { Article } = require('../../models/article_model');

// add articel
// get post etc with article
// get article no auth
// fetch article load more
// fetch article with pagination

router.route('/admin/articles');

module.exports = router;
