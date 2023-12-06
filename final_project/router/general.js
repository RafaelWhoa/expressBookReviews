const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req, res) => {
    let username = req.body.username
    let password = req.body.password
    if (users.filter(user => user["username"] === username).length === 0) {
        users.push({"username": username, "password": password})
        return res.status(200).json({message: "User registered successfully"});
    }
    else {
        return res.status(300).json({message: "User already exists"});
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});

// Get the book list available in the shop (async)
const getBooksAsync = async(url) => {
    const response = await axios.get(url);
    let listOfBooks = await response.data;
    Object.values(listOfBooks).forEach((book) => {
        console.log(JSON.stringify(book));
    });
}

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

// Get book details based on ISBN (async)
const getBookByISBNAsync = async (url, isbn) => {
    const response = axios.get(url);
    let book = (await response).data[isbn];
    console.log(JSON.stringify(book));
}

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

// Get book details based on author (async)
const getBookByAuthorAsync = async (url, author) => {
    const response = axios.get(url);
    let booksByAuthor = Object.values((await response).data).filter((book) => book.author === author);
    booksByAuthor.forEach((book) => {
        console.log(JSON.stringify(book));
    });
}

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

// Get all books based on title (async)
const getBookByTitleAsync = async (url, title) => {
    const response = axios.get(url);
    let booksByTitle = Object.values((await response).data).filter((book) => book.title === title);
    booksByTitle.forEach((book) => {
        console.log(JSON.stringify(book));
    });
}

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    let isbn = req.params["isbn"]
    let book = books[isbn]
    let bookReviews = book["reviews"]
    return res.status(300).json(bookReviews);
});

getBooksAsync('http://localhost:8080/').catch((error) => {
    console.log(error.toString());
});
getBookByISBNAsync('http://localhost:8080/', 1).catch((error) => {
    console.log(error.toString());
});
getBookByAuthorAsync('http://localhost:8080/', 'Unknown').catch((error) => {
    console.log(error.toString());
});
getBookByTitleAsync('http://localhost:8080/', 'The Divine Comedy').catch((error) => {
    console.log(error.toString());
});
module.exports.general = public_users;
