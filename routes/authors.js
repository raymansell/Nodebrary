const router = require('express').Router();
const Author = require('../models/author');
const Book = require('../models/book');

// All authors route (page)
router.get('/', async (req, res) => {
  const searchOptions = {};
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i');
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render('authors/index', { authors, searchOptions: req.query });
  } catch (error) {
    res.redirect('/');
  }
});

// New author route (page)
router.get('/new', (req, res) => {
  res.render('authors/new', { author: new Author() });
});

// Create author route
router.post('/', async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });
  try {
    const newAuthor = await author.save();
    res.redirect(`/authors/${newAuthor.id}`);
  } catch (error) {
    res.render('authors/new', {
      author,
      errorMessage: 'Error creating author',
    });
  }
});

// Show author route (page)
router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    const booksByAuthor = await Book.find({ author: author.id }).limit(6);
    res.render('authors/show', { author, booksByAuthor });
  } catch (error) {
    res.redirect('/');
  }
});

// Edit author route (page)
router.get('/:id/edit', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render('authors/edit', { author });
  } catch (error) {
    res.redirect('/authors');
  }
});

// Update author route
router.put('/:id', async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch (error) {
    if (author == null) {
      res.redirect('/');
    } else {
      res.render('authors/edit', {
        author,
        errorMessage: 'Error updating Author',
      });
    }
  }
});

// Remove author route
router.delete('/:id', async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    await author.deleteOne();
    res.redirect('/authors');
  } catch (error) {
    if (author == null) {
      res.redirect('/');
    } else {
      res.redirect(`/authors/${author.id}`);
    }
  }
});

module.exports = router;
