const Router = require("express").Router();
const PublicationModel = require("../../database/publication");

/*
Route               /publications
Description         get all publications
Access              public
Parameters          none
method              GET
*/
Router.get("/", (req, res) => {
    return res.json({ publications: database.publications });
});

/*
Route               /publications/
Description         get specific publications
Access              public
Parameters          id
method              GET
*/
Router.get("/:Id", (req, res) => {
    const getSpecificPublication = database.publications.filter((publication) => publication.id == req.params.Id);

    if (getSpecificPublication.length === 0) {
        return res.json({ error: `No author found for the id ${req.params.Id}` });
    }
    return res.json({ books: getSpecificPublication });
});

/*
Route               /publication/new
Description         add new publication
Access              public
Parameters          node
method              POST
*/
Router.post("/new", (req, res) => {
    const { newPublication } = req.body;
    PublicationModel.create(newPublication);
    return res.json({ message: "publication was added!" });
});

/*
Route               /publication/update/book
Description         update/add new book to a publication
Access              public
Parameters          isbn
method              PUT
*/
Router.put("/update/book/:isbn", (req, res) => {
    // update the publication database
    database.publications.forEach((publication) => {
        if (publication.id === req.body.pubId) {
            return publication.books.addToSet(req.params.isbn);
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
Route           /publication/delete
Description     delete a publication
Access          PUBLIC
Parameters      Id
Method          DELETE
*/
Router.delete("/delete/:Id", (req, res) => {
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
Router.delete("/delete/book/:isbn/:pubId", (req, res) => {
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

module.exports = Router;