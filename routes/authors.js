const router = require('express').Router();
const Author = require('../models/author');

// All authors route
router.get('/', async (req, res) => {
  const searchOptions = {};
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i');
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render('authors/index', { authors, searchOptions: req.query });
  } catch (err) {
    res.redirect('/');
  }
});

// New author route
router.get('/new', (req, res) => {
  res.render('authors/new', { author: new Author() });
});

// Create author route
router.post('/', async (req, res) => {
  const author = new Author(req.body);
  try {
    await author.save();
    res.redirect('/authors');
  } catch (err) {
    console.log(err);
    res.render('authors/new', {
      author,
      errorMessage: 'Error creating author',
    });
  }
});

module.exports = router;
