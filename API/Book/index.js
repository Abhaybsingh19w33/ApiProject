// router
// initializing exprese router
const Router = require("express").Router();
const BookModel = require("../../database/book");
const AuthorModel = require("../../database/author");

// pefix : /book
/*
Route               /
Description         get all books
Access              public
Parameters          node
method              GET
*/
Router.get("/", async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

/*
Route               /is/
Description         get specific books based on isbn
Access              public
Parameters          isbn
method              GET
*/
Router.get("/is/:isbn", async (req, res) => {
    const getSpecificBook = await BookModel.findOne({ ISBN: req.params.isbn });
    // if no data found it returns null
    if (!getSpecificBook) {
        return res.json({ error: `No book found for the ISBN of ${req.params.isbn}` })
    }
    return res.json({ books: getSpecificBook });
});
/*
Route               c/
Description         get specific books based on category
Access              public
Parameters          category
method              GET
*/
Router.get("/c/:category", async (req, res) => {
    const getSpecificBooks = await BookModel.findOne({ category: req.params.category });
    if (!getSpecificBooks) {
        return res.json({ error: `No book found for the category name of ${req.params.category}` })
    }
    return res.json({ books: getSpecificBooks });
});

/*
Route               manyc/
Description         get a list of books based on category
Access              public
Parameters          category
method              GET
*/
Router.get("/manyc/:category", async (req, res) => {
    const getSpecificBooks = await BookModel.find({ category: req.params.category });
    if (!getSpecificBooks) {
        return res.json({ error: `No book found for the category name of ${req.params.category}` })
    }
    return res.json({ books: getSpecificBooks });
});

/*
Route               manya/
Description         get a list of books based on author
Access              public
Parameters          category
method              GET
*/
Router.get("/manya/:author", async (req, res) => {
    const getSpecificAuthors = await BookModel.find({ authors: req.params.author });
    if (!getSpecificAuthors) {
        return res.json({ error: `No book found for the author name of ${req.params.author}` })
    }
    return res.json({ books: getSpecificAuthors });
});

// POST
/*
Route               /book/new
Description         add new books
Access              public
Parameters          node
method             POST
*/
Router.post("/new", async (req, res) => {
    try {
        const { newBook } = req.body;
        await BookModel.create(newBook);
        return res.json({ message: "book was added!" });
    } catch (error) {
        // throw new Error(error);
        return res.json({ error: error.message });
    }
});
/*
Route               /book/update/
Description         update title of a book
Access              public
Parameters          isbn
method              PUT
*/
Router.put("/update/:isbn", async (req, res) => {
    const updatedBook = await BookModel.findOneAndUpdate(
        // this the key which will be checked if the data exist
        { ISBN: req.params.isbn },
        // the data to be updated
        { title: req.body.bookTitle },
        // id newer or older data is to be returned
        // if not mentioned then the old data is returned
        { new: true }
    );
    return res.json({ books: updatedBook });
});

/*
Route               /book/update/author/:isbn
Description         update/add new author
Access              public
Parameters          isbn
method              PUT
*/
Router.put("/update/author/:isbn", async (req, res) => {
    // update the book database
    const updatedBook = await BookModel.findOneAndUpdate(
        { ISBN: req.params.isbn },
        {
            $addToSet: {
                authors: req.body.newAuthor,
            },
        },
        { new: true }
    );

    // update the author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        { id: req.body.newAuthor },
        {
            $addToSet: {
                books: req.params.isbn
            },
        },
        { new: true }
    );
    return res.json({
        books: updatedBook,
        authors: updatedAuthor,
        message: "New author was added",
    });
});

/*
Route               /book/update/language/:isbn
Description         update language
Access              public
Parameters          isbn
method              PUT
*/
Router.put("/update/language/:isbn", async (req, res) => {
    // update the book database
    const updatedBook = await BookModel.findOneAndUpdate(
        { ISBN: req.params.isbn },
        {
            $set: {
                language: req.body.language,
            },
        },
        { new: true }
    );

    return res.json({
        books: updatedBook,
        message: "Book language updated",
    });
});

/*
Route               /book/update/pubDate/:isbn
Description         update pubDate
Access              public
Parameters          isbn
method              PUT
*/
Router.put("/update/pubDate/:isbn", async (req, res) => {
    // update the book database
    const updatedBook = await BookModel.findOneAndUpdate(
        { ISBN: req.params.isbn },
        {
            $set: {
                pubDate: req.body.pubDate,
            },
        },
        { new: true }
    );

    return res.json({
        books: updatedBook,
        message: "Book publish Date updated",
    });
});

/*
Route               /book/update/numOfPage/:isbn
Description         update numOfPage
Access              public
Parameters          isbn
method              PUT
*/
Router.put("/update/numOfPage/:isbn", async (req, res) => {
    // update the book database
    const updatedBook = await BookModel.findOneAndUpdate(
        { ISBN: req.params.isbn },
        {
            $set: {
                numOfPage: req.body.numOfPage,
            },
        },
        { new: true }
    );

    return res.json({
        books: updatedBook,
        message: "Book number of pages updated",
    });
});

/*
Route           /book/delete
Description     delete a book
Access          PUBLIC
Parameters      isbn
Method          DELETE
*/
Router.delete("/delete/:isbn", async (req, res) => {
    const updatedBookDatabase = await BookModel.findOneAndDelete(
        {
            ISBN: req.params.isbn
        }
    );

    return res.json({ books: updatedBookDatabase });
});

/*
Route           /book/delete/author
Description     delete a author from a book
Access          PUBLIC
Parameters      isbn, author id
Method          DELETE
*/
Router.delete("/delete/author/:isbn/:authorId", async (req, res) => {
    // update the book database
    const updatedBook = await BookModel.findOneAndUpdate(
        { ISBN: req.params.isbn },
        {
            $pull: {
                authors: parseInt(req.params.authorId)
            },
        },
        {
            new: true
        }
    );

    // update the author database
    const updatedAuthor = await BookModel.findOneAndUpdate(
        { id: parseInt(req.params.authorId) },
        {
            $pull: {
                books: req.params.isbn
            }
        },
        {
            new: true
        }
    );
    return res.json({
        message: "author was deleted!!!!!!😪",
        book: updatedBook,
        author: updatedAuthor
    });
});

module.exports = Router;