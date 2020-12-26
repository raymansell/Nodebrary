const router = require('express').Router();
const Book = require('../models/book');
const Author = require('../models/author');

// All books route (page)
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

// New book route (page)
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
    const newBook = await book.save();
    res.redirect(`/books/${newBook.id}`);
  } catch (error) {
    renderNewPage(res, book, true);
  }
});

// Show book route (page)
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('author');
    res.render('books/show', { book });
  } catch (error) {
    res.redirect('/');
  }
});

// Edit author route (page)
router.get('/:id/edit', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    renderEditPage(res, book);
  } catch (error) {
    res.redirect('/');
  }
});

// Update author route
router.put('/:id', async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    book.title = req.body.title;
    book.description = req.body.description;
    book.publishDate = new Date(req.body.publishDate);
    book.pageCount = parseInt(req.body.pageCount, 10);
    book.author = req.body.author;
    if (req.body.cover != null && req.body.cover !== '') {
      saveCover(book, req.body.cover);
    }
    await book.save();
    res.redirect(`/books/${book.id}`);
  } catch (error) {
    if (book != null) {
      renderEditPage(res, book, true);
    } else {
      res.redirect('/');
    }
  }
});

// Remove book route
router.delete('/:id', async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    book.deleteOne();
    res.redirect('/books');
  } catch (error) {
    if (book != null) {
      res.render('books/show', { book, errorMessage: 'Could not remove book' });
    } else {
      res.redirect('/');
    }
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
  renderFormPage(res, book, 'new', hasError);
}
async function renderEditPage(res, book, hasError = false) {
  renderFormPage(res, book, 'edit', hasError);
}

async function renderFormPage(res, book, form, hasError = false) {
  try {
    const authors = await Author.find();
    const params = {
      authors,
      book,
    };
    if (hasError) {
      if (form === 'new') {
        params.errorMessage = 'Error Creating Book';
      } else {
        params.errorMessage = 'Error Updating Book';
      }
    }
    res.render(`books/${form}`, params);
  } catch (error) {
    res.redirect('/books');
  }
}

module.exports = router;
