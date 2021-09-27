const mongoose = require("mongoose");
// creating a book schema
const AuthorSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 11
    },
    books: [String]
});

// creating a book model
const AuthorModel = mongoose.model("authors", AuthorSchema);

module.exports = AuthorModel;