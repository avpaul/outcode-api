var mongoose = require('mongoose');

var subHeadingSchema = new mongoose.Schema({
    content: String,
    order: { type: Number, required: true }
});

var paragraphSchema = new mongoose.Schema({
    content: String,
    order: { type: Number, required: true }
});
var imgSchema = new mongoose.Schema({
    path: { type: String, required: true },
    caption: { type: String, required: true }
});

var bqtSchema = new mongoose.Schema({
    author: { type: String, required: true },
    content: String,
    order: { type: Number, required: true }
});
var articleUpdateSchema = new mongoose.Schema({
    author: { type: String, required: true },
    reviewDate: { type: Date, default: Date.now },
    subHeadings: [subHeadingSchema],
    paragraphs: [paragraphSchema],
    figures: [imgSchema],
    blockquotes: [bqtSchema]
});

var commentShema = new mongoose.Schema({
    author: { type: String, required: true },
    publicationDate: { type: Date, default: Date.now },
    commentText: { type: String, required: true }
});

var articleSchema = new mongoose.Schema({
    title: { type: String, required: true, min: 10 },
    author: { type: String, required: true },
    publicationDate: { type: Date, default: Date.now },
    state: { type: String, required: true },
    category: { type: String, required: true },
    oneClaps: { type: Number, default: 0 },
    twoClaps: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    subHeadings: [subHeadingSchema],
    paragraphs: [paragraphSchema],
    figures: [imgSchema],
    blockquotes: [bqtSchema]
});

mongoose.model('Article', articleSchema);