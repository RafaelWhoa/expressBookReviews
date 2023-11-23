const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let isbn = req.params["isbn"]
    let book = books[isbn]
    if (book) {
        return res.status(300).json(book);
    }
    else {
        return res.status(404).json({message: "Book not found"});
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let author = req.params["author"]
    let booksByAuthor = {}
    for (let i in books) {
        if (books[i]["author"] === author) {
            booksByAuthor[i] = books[i]
        }
    }
    return res.status(300).json(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    let title = req.params["title"]
    let booksByTitle = {}
    for (let i in books) {
        if (books[i]["title"] === title) {
            booksByTitle[i] = books[i]
        }
    }
    return res.status(300).json(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
