const { Schema, model } = require('mongoose');
const Book = require('./book');

const authorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

authorSchema.pre('deleteOne', { document: true }, function (next) {
  Book.find({ author: this.id }, (err, books) => {
    if (err) {
      next(err);
    } else if (books.length > 0) {
      next(new Error('This author has books still'));
    } else {
      next();
    }
  });
});

module.exports = model('author', authorSchema);
