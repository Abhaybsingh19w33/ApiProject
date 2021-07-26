const Router = require("express").Router();
const AuthorModel = require("../../database/author");

/*
Route               /author
Description         get all authors
Access              public
Parameters          none
method              GET
*/
Router.get("/", async (req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json({ authors: getAllAuthors });
});

/*
Route               /author/
Description         get a specific author by using his id
Access              public
Parameters          ISBN
method              GET
*/

Router.get("/:Id", (req, res) => {
    const getSpecificAuthor = database.authors.filter((author) => author.id == req.params.Id);

    if (getSpecificAuthor.length === 0) {
        return res.json({ error: `No author found for the id ${req.params.Id}` });
    }
    return res.json({ books: getSpecificAuthor });
});
/*
Route               /author
Description         get a list of authors based on a book's isbn
Access              public
Parameters          ISBN
method              GET
*/
Router.get("/:isbn", async (req, res) => {
    try {
        const getSpecificAuthors = database.authors.filter((author) => author.books.includes(req.params.isbn));

        if (getSpecificAuthors.length === 0) {
            return res.json({ error: `No author found for the book ${req.params.isbn}` })
        }

        return res.json({ authors: getSpecificAuthors });
    } catch (error) {
        return res.json({ error: error.message })
    }
});

/*
Route               /author/new
Description         add new author
Access              public
Parameters          node
method              POST
*/
Router.post("/new", (req, res) => {
    const { newAuthor } = req.body;
    AuthorModel.create(newAuthor);
    return res.json({ message: "author was added!" });
});

/*
Route           /author/delete
Description     delete a author
Access          PUBLIC
Parameters      authorId
Method          DELETE
*/
shapeAI.delete("/delete/:authorId", (req, res) => {
    const updatedAuthorDatabase = database.authors.filter(
        (author) => author.id !== parseInt(req.params.authorId)
    );

    database.authors = updatedAuthorDatabase;
    return res.json({ authors: database.authors });
});

module.exports = Router;