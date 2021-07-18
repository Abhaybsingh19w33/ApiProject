require("dotenv").config();
// framework
const express = require("express");
// database
const database = require("./database/index");
const shapeAI = express();
const mongoose = require('mongoose');

// models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

shapeAI.use(express.json());

// establishing the mdb connection
mongoose.connect(
    process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }
).then(() => console.log("connection established"));

/*
Route               /
Description         get all books
Access              public
Parameters          node
method              GET
*/
shapeAI.get("/", async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json({ books: getAllBooks });
});

/*
Route               /is/
Description         get specific books based on isbn
Access              public
Parameters          isbn
method              GET
*/
shapeAI.get("/is/:isbn", async (req, res) => {
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
shapeAI.get("/c/:category", async (req, res) => {
    // const getSpecificBooks = database.books.filter((book) => book.category.includes(req.params.category));
    const getSpecificBooks = await BookModel.findOne({ category: req.params.category });

    if (!getSpecificBooks) {
        return res.json({ error: `No book found for the category name of ${req.params.category}` })
    }
    return res.json({ books: getSpecificBooks });
});

/*
Route               /author
Description         get all authors
Access              public
Parameters          none
method              GET
*/
shapeAI.get("/author", async (req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json({ authors: getAllAuthors });
});

/*
Route               /author/
Description         get a specific author
Access              public
Parameters          ISBN
method              GET
*/

shapeAI.get("/author/:Id", (req, res) => {
    const getSpecificAuthor = database.authors.filter((author) => author.id == req.params.Id);

    if (getSpecificAuthor.length === 0) {
        return res.json({ error: `No author found for the id ${req.params.Id}` });
    }
    return res.json({ books: getSpecificAuthor });
});
/*
Route               /author/book
Description         get a list of authors based on a book's isbn
Access              public
Parameters          ISBN
method              GET
*/
shapeAI.get("/author/book/:isbn", (req, res) => {
    const getSpecificAuthors = database.authors.filter((author) => author.books.includes(req.params.isbn));

    if (getSpecificAuthors.length === 0) {
        return res.json({ error: `No author found for the book ${req.params.isbn}` })
    }

    return res.json({ authors: getSpecificAuthors });
});

/*
Route               /publications
Description         get all publications
Access              public
Parameters          none
method              GET
*/
shapeAI.get("/publications", (req, res) => {
    return res.json({ publications: database.publications });
});

/*
Route               /publications/
Description         get specific publications
Access              public
Parameters          id
method              GET
*/
shapeAI.get("/publication/:Id", (req, res) => {
    const getSpecificPublication = database.publications.filter((publication) => publication.id == req.params.Id);

    if (getSpecificPublication.length === 0) {
        return res.json({ error: `No author found for the id ${req.params.Id}` });
    }
    return res.json({ books: getSpecificPublication });
});


// POST
/*
Route               /book/new
Description         add new books
Access              public
Parameters          node
method             POST
*/
shapeAI.post("/book/new", async (req, res) => {
    const { newBook } = req.body;
    // database.book s.push(newBook);
    BookModel.create(newBook);
    // console.log()
    return res.json({ message: "book was added!" });
});

/*
Route               /author/new
Description         add new author
Access              public
Parameters          node
method              POST
*/
shapeAI.post("/author/new", (req, res) => {
    const { newAuthor } = req.body;
    // database.authors.push(newAuthor);
    AuthorModel.create(newAuthor);
    return res.json({ message: "author was added!" });
});

/*
Route               /publication/new
Description         add new publication
Access              public
Parameters          node
method              POST
*/
shapeAI.post("/publication/new", (req, res) => {
    const { newPublication } = req.body;
    PublicationModel.create(newPublication);
    return res.json({ message: "publication was added!" });
});

/*
Route               /book/update/
Description         update title of a book
Access              public
Parameters          isbn
method              PUT
*/
shapeAI.put("/book/update/:isbn", (req, res) => {
    // foreach directly modifies the array
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.title = req.body.bookTitle;
            return;
        }
    });
    // map => new array => replace
    return res.json({ books: database.books });
});

/*
Route               /book/update/author/:isbn
Description         update/add new author
Access              public
Parameters          isbn
method              PUT
*/
shapeAI.put("/book/author/update/:isbn", (req, res) => {
    // update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn)
            return book.authors.push(req.body.newAuthor);
    });

    // update the author database
    database.authors.forEach((author) => {
        if (author.id === req.body.newAuthor)
            return author.books.push(req.params.isbn);
    });

    return res.json({
        books: database.books,
        authors: database.authors,
        message: "New author was added",
    });
});

/*
Route               /publication/update/book
Description         update/add new book to a publication
Access              public
Parameters          isbn
method              PUT
*/
shapeAI.put("/publication/update/book/:isbn", (req, res) => {
    // update the publication database
    database.publications.forEach((publication) => {
        if (publication.id === req.body.pubId) {
            return publication.books.push(req.params.isbn);
        }
    });

    // update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.publication = req.body.pubId;
            return;
        }
    });

    return res.json({
        books: database.books,
        authors: database.authors,
        message: "Successfully added publication"
    });
});

/*
Route           /book/delete
Description     delete a book
Access          PUBLIC
Parameters      isbn
Method          DELETE
*/
shapeAI.delete("/book/delete/:isbn", (req, res) => {
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    );

    database.books = updatedBookDatabase;
    return res.json({ books: database.books });
});

/*
Route           /book/delete/author
Description     delete a author from a book
Access          PUBLIC
Parameters      isbn, author id
Method          DELETE
*/
shapeAI.delete("/book/delete/author/:isbn/:authorId", (req, res) => {
    // update the book database
    // parse the string to int for comparision every time
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            const newAuthorList = book.authors.filter(
                (author) => author !== parseInt(req.params.authorId)
            );
            book.authors = newAuthorList;
            return;
        }
    });

    // update the author database
    database.authors.forEach((author) => {
        if (author.id === parseInt(req.params.authorId)) {
            const newBooksList = author.books.filter(
                (book) => book !== req.params.isbn
            );

            author.books = newBooksList;
            return;
        }
    });

    return res.json({
        message: "author was deleted!!!!!!😪",
        book: database.books,
        author: database.authors,
    });
});

/*
Route           /author/delete
Description     delete a author
Access          PUBLIC
Parameters      authorId
Method          DELETE
*/
shapeAI.delete("/author/delete/:authorId", (req, res) => {
    const updatedAuthorDatabase = database.authors.filter(
        (author) => author.id !== parseInt(req.params.authorId)
    );

    database.authors = updatedAuthorDatabase;
    return res.json({ authors: database.authors });
});

/*
Route           /publication/delete
Description     delete a publication
Access          PUBLIC
Parameters      Id
Method          DELETE
*/
shapeAI.delete("/publication/delete/:Id", (req, res) => {
    const updatedPublicationDatabase = database.publications.filter(
        (publication) => publication.id !== parseInt(req.params.Id)
    );

    database.publications = updatedPublicationDatabase;
    return res.json({ publications: database.publications });
});

/*
Route           /publication/delete/book
Description     delete a book from publication 
Access          PUBLIC
Parameters      isbn, publication id
Method          DELETE
*/
shapeAI.delete("/publication/delete/book/:isbn/:pubId", (req, res) => {
    // update publication database
    database.publications.forEach((publication) => {
        if (publication.id === parseInt(req.params.pubId)) {
            const newBooksList = publication.books.filter(
                (book) => book !== req.params.isbn
            );

            publication.books = newBooksList;
            return;
        }
    });

    // update book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.publication = 0; // no publication available
            return;
        }
    });

    return res.json({
        books: database.books,
        publications: database.publications,
    });
});


// starting the server
shapeAI.listen(3000, () => console.log("server is running!"));

//  mongoose helps you with validation, relationship with other data
// mongoose model -> document model of mongoDb 
// collection -> individual databases
// architecture 
// schema -> convert them to mongoose Model -> use them
