// router
// initializing exprese router
const Router = require("express").Router();
const BookModel = require("../../database/book");

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

// POST
/*
Route               /book/new
Description         add new books
Access              public
Parameters          node
method             POST
*/
Router.post("/new", async (req, res) => {
    const { newBook } = req.body;
    BookModel.create(newBook);
    return res.json({ message: "book was added!" });
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
Router.put("/author/update/:isbn", async (req, res) => {
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