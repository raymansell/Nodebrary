const { Schema, model } = require('mongoose');

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    publishDate: {
      type: Date,
      required: true,
    },
    pageCount: {
      type: Number,
      min: 1,
      required: true,
    },
    coverImage: {
      type: Buffer,
      required: true,
    },
    coverImageType: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Author',
    },
  },
  { timestamps: true }
);

bookSchema.virtual('dataURL').get(function () {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${this.coverImageType};base64,${this.coverImage.toString(
      'base64'
    )}`;
  }
  return null;
});

module.exports = model('Book', bookSchema);
