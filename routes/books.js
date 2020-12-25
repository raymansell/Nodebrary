const router = require('express').Router();
const Book = require('../models/book');
const Author = require('../models/author');

// All books route
router.get('/', async (req, res) => {
  let query = Book.find();
  if (req.query.title != null && req.query.title !== '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'));
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore !== '') {
    query = query.lte('publishDate', req.query.publishedBefore);
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter !== '') {
    query = query.gte('publishDate', req.query.publishedAfter);
  }
  try {
    const books = await query;
    res.render('books/index', { books, searchOptions: req.query });
  } catch (error) {
    res.redirect('/');
  }
});

// New book route
router.get('/new', (req, res) => {
  renderNewPage(res, new Book());
});

// Create book route
router.post('/', async (req, res) => {
  const book = new Book({
    title: req.body.title,
    description: req.body.description,
    publishDate: new Date(req.body.publishDate),
    pageCount: parseInt(req.body.pageCount, 10),
    // Mongoose parses the incoming req.body.author (string) to ObjectId
    author: req.body.author,
  });
  saveCover(book, req.body.cover);

  try {
    await book.save();
    res.redirect('/books');
  } catch (error) {
    renderNewPage(res, book, true);
  }
});

function saveCover(book, coverEncoded) {
  if (coverEncoded == null || coverEncoded === '') return;
  const mimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const cover = JSON.parse(coverEncoded);
  if (cover != null && mimeTypes.includes(cover.type)) {
    book.coverImageType = cover.type;
    book.coverImage = Buffer.from(cover.data, 'base64');
  }
}

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find();
    const params = {
      authors,
      book,
    };
    if (hasError) params.errorMessage = 'Error Creating Book';
    res.render('books/new', params);
  } catch (error) {
    res.redirect('/books');
  }
}

module.exports = router;