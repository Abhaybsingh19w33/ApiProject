// framework
const express = require("express");
// database
const database = require("./database/index");
const shapeAI = express();

shapeAI.use(express.json());

/*
Route               /
Description         get all books
Access              public
Parameters          node
method              GET
*/
shapeAI.get("/", (req, res) => {
    return res.json({ books: database.books });
});

/*
Route               /is/
Description         get specific books based on isbn
Access              public
Parameters          isbn
method              GET
*/
shapeAI.get("/is/:isbn", (req, res) => {
    const getSpecificBook = database.books.filter((book) => book.ISBN === req.params.isbn);

    if (getSpecificBook.length === 0) {
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
shapeAI.get("/c/:category", (req, res) => {
    const getSpecificBooks = database.books.filter((book) => book.category.includes(req.params.category));

    if (getSpecificBooks.length === 0) {
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
shapeAI.get("/author", (req, res) => {
    return res.json({ authors: database.authors });
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
shapeAI.post("/book/new", (req, res) => {
    const { newBook } = req.body;
    database.books.push(newBook);
    return res.json({ books: database.books, message: "book was added!" });
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
    database.authors.push(newAuthor);
    return res.json({ books: database.authors, message: "author was added!" });
});

// starting the server
shapeAI.listen(3000, () => console.log("server is running!"));