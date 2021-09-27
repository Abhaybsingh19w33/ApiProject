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
Route               /author/update/
Description         update name
Access              public
Parameters          id
method              PUT
*/
Router.put("/update/:id", async (req, res) => {
    // update the Author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        { id: req.params.id },
        {
            $set: {
                name: req.body.name,
            },
        },
        { new: true }
    );
    return res.json({
        author: updatedAuthor,
        message: "Author name updated",
    });
});

/*
Route               /author/delete/
Description         delete author
Access              public
Parameters          authorId
method              DELETE
*/
Router.delete("/delete/:authorId", async (req, res) => {
    // update the Author database
    const updatedAuthorDatabase = await AuthorModel.findOneAndDelete(
        { id: req.params.authorId }
    );
    return res.json({
        authors: updatedAuthorDatabase,
        message: "Author deleted"
    });
});

module.exports = Router;