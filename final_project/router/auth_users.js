const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
    let validUsers = users.filter((user) => {
        return (user.username === username && user.password === password)
    })
    return validUsers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    let username = req.body.username
    let password = req.body.password

    if (!username || !password) {
        return res.status(300).json({message: "Username or password missing"});
    } else {
        if (authenticatedUser(username, password)) {
            let accessToken = jwt.sign({username, password}, 'access', {expiresIn: 60 * 60})
            req.session.authorization = {accessToken, username}
            return res.status(200).send("User successfully logged in");
        } else {
            return res.status(300).json({message: "Invalid username or password"});
        }
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params["isbn"]
    const bodyRating = req.body.rating
    const bodyReview = req.body.review
    const book = books[isbn]
    const reviewByUser = Object.values(books[isbn].reviews).filter((review) => review.username === req.user.username)[0]
    if (reviewByUser !== undefined) {
        reviewByUser.username = req.user.username
        bodyRating !== undefined ? reviewByUser.rating = bodyRating : null
        bodyReview !== undefined ? reviewByUser.review = bodyReview : null
        let reviews = Object.values(books[isbn].reviews).filter((review) => review.username !== req.user.username)
        reviews.push(reviewByUser)
        books[isbn].reviews = reviews
        res.status(300).json({message: "User review updated.", review: reviewByUser})
    } else {
        let reviews = Object.values(book.reviews)
        const newReview = {"username": req.user.username, "rating": bodyRating, "review": bodyReview}
        reviews.push(newReview)
        book.reviews = reviews
        res.status(200).json({message: "Review added successfully", review: newReview})
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params["isbn"]
    const book = books[isbn]
    const reviewByUser = Object.values(book.reviews).filter((review) => review.username === req.user.username)[0]
    if (reviewByUser !== undefined) {
        book.reviews = Object.values(book.reviews).filter((review) => review.username !== req.user.username)
        res.status(200).json({message: "Review deleted successfully", deletedReview: reviewByUser})
    }
    else {
        res.status(404).json({message: "Book review not found for the user"})
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
