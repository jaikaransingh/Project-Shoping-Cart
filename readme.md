## Project - Books Management

## overview 

The project "Books Management" is a web application that focuses on managing books and user reviews. It provides various APIs for user registration, login, book creation, retrieval, updating, and deletion, as well as adding, updating, and deleting reviews for books.
 
### Models
- User Model

{ 
  title: {string, mandatory, enum[Mr, Mrs, Miss]},
  name: {string, mandatory},
  phone: {string, mandatory, unique},
  email: {string, mandatory, valid email, unique}, 
  password: {string, mandatory, minLen 8, maxLen 15},
  address: {
    street: {string},
    city: {string},
    pincode: {string}
  },
  createdAt: {timestamp},
  updatedAt: {timestamp}
}

- Books Model

{ 
  title: {string, mandatory, unique},
  excerpt: {string, mandatory}, 
  userId: {ObjectId, mandatory, refs to user model},
  ISBN: {string, mandatory, unique},
  category: {string, mandatory},
  subcategory: {string, mandatory},
  reviews: {number, default: 0, comment: Holds number of reviews of this book},
  deletedAt: {Date, when the document is deleted}, 
  isDeleted: {boolean, default: false},
  releasedAt: {Date, mandatory, format("YYYY-MM-DD")},
  createdAt: {timestamp},
  updatedAt: {timestamp},
}


- Review Model (Books review)

{
  bookId: {ObjectId, mandatory, refs to book model},
  reviewedBy: {string, mandatory, default 'Guest', value: reviewer's name},
  reviewedAt: {Date, mandatory},
  rating: {number, min 1, max 5, mandatory},
  review: {string, optional}
  isDeleted: {boolean, default: false},
}


## User APIs 
### POST /register
- Create a user - atleast 5 users
- Create a user document from request body.
- Return HTTP status 201 on a succesful user creation. Also return the user document. The response should be a JSON object like [this](#users)
- Return HTTP status 400 if no params or invalid params received in request body. The response should be a JSON object like [this](#error-response-structure)

### POST /login
- Allow an user to login with their email and password.
- On a successful login attempt return a JWT token contatining the userId, exp, iat. The response should be a JSON object like [this](#Successful-Login-Response-structure)
- If the credentials are incorrect return a suitable error message with a valid HTTP status code. The response should be a JSON object like [this](#error-response-structure)

## Books API
### POST /books
- Create a book document from request body. Get userId in request body only.
- Make sure the userId is a valid userId by checking the user exist in the users collection.
- Return HTTP status 201 on a succesful book creation. Also return the book document. The response should be a JSON object like [this](#books) 
- Create atleast 10 books for each user
- Return HTTP status 400 for an invalid request with a response body like [this](#error-response-structure)

### GET /books
- Returns all books in the collection that aren't deleted. Return only book _id, title, excerpt, userId, category, releasedAt, reviews field. Response example [here](#get-books-response)
- Return the HTTP status 200 if any documents are found. The response structure should be like [this](#successful-response-structure) 
- If no documents are found then return an HTTP status 404 with a response like [this](#error-response-structure) 
- Filter books list by applying filters. Query param can have any combination of below filters.
  - By userId
  - By category
  - By subcategory
  example of a query url: books?filtername=filtervalue&f2=fv2
- Return all books sorted by book name in Alphabatical order

### GET /books/:bookId
- Returns a book with complete details including reviews. Reviews array would be in the form of Array. Response example [here](#book-details-response)
- Return the HTTP status 200 if any documents are found. The response structure should be like [this](#successful-response-structure) 
- If the book has no reviews then the response body should include book detail as shown [here](#book-details-response-no-reviews) and an empty array for reviewsData.
- If no documents are found then return an HTTP status 404 with a response like [this](#error-response-structure) 

### PUT /books/:bookId
- Update a book by changing its
  - title
  - excerpt
  - release date
  - ISBN
- Make sure the unique constraints are not violated when making the update
- Check if the bookId exists (must have isDeleted false and is present in collection). If it doesn't, return an HTTP status 404 with a response body like [this](#error-response-structure)
- Return an HTTP status 200 if updated successfully with a body like [this](#successful-response-structure) 
- Also make sure in the response you return the updated book document. 

### DELETE /books/:bookId
- Check if the bookId exists and is not deleted. If it does, mark it deleted and return an HTTP status 200 with a response body with status and message.
- If the book document doesn't exist then return an HTTP status of 404 with a body like [this](#error-response-structure) 

## Review APIs
### POST /books/:bookId/review
- Add a review for the book in reviews collection.
- Check if the bookId exists and is not deleted before adding the review. Send an error response with appropirate status code like [this](#error-response-structure) if the book does not exist
- Get review details like review, rating, reviewer's name in request body.
- Update the related book document by increasing its review count
- Return the updated book document with reviews data on successful operation. The response body should be in the form of JSON object like [this](#Review-Response-Structure)

### PUT /books/:bookId/review/:reviewId
- Update the review - review, rating, reviewer's name.
- Check if the bookId exists and is not deleted before updating the review. Check if the review exist before updating the review. Send an error response with appropirate status code like [this](#error-response-structure) if the book does not exist
- Get review details like review, rating, reviewer's name in request body.
- Return the updated book document with reviews data on successful operation. The response body should be in the form of JSON object like [this](#book-details-response)

### DELETE /books/:bookId/review/:reviewId
- Check if the review exist with the reviewId. Check if the book exist with the bookId. Send an error response with appropirate status code like [this](#error-response-structure) if the book or book review does not exist
- Delete the related reivew.
- Update the books document - decrease review count by one

### Authentication
- Make sure all the book routes are protected.

### Authorisation
- Make sure that only the owner of the books is able to create, edit or delete the book.
- In case of unauthorized access return an appropirate error message.

## Testing 
- To test these apis create a new collection in Postman named Project 4 Books Management 
- Each api should have a new request in this collection
- Each request in the collection should be rightly named. Eg Create user, Create book, Get books etc
- Each member of each team should have their tests in running state

Refer below sample
 ![A Postman collection and request sample](assets/Postman-collection-sample.png)

## Response

### Successful Response structure

{
  status: true,
  message: 'Success',
  data: {

  }
}

### Error Response structure

{
  status: false,
  message: ""
}


## Collections
## users

{
  status: true,
  data: {
          _id: ObjectId("88abc190ef0288abc190ef02"),
          title: "Mr",
          name: "John Doe",
          phone: 9897969594,
          email: "johndoe@mailinator.com", 
          password: "abcd1234567",
          address: {
            street: "110, Ridhi Sidhi Tower",
            city: "Jaipur",
            pincode: "400001"
                   },
          "createdAt": "2021-09-17T04:25:07.803Z",
          "updatedAt": "2021-09-17T04:25:07.803Z",
         }
}

### Successful Login Response structure

{
  status: true,
  data: {
   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JJZCI6IjYyZmUzYmUzMzY2ZmFkNDZjY2Q1MzI3ZiIsImlhdCI6MTY2MDgzMDA4MywiZXhwIjoxNjYwODY2MDgzfQ.mSo-TLyRlGhMNcy4ftEvvIlCHlyEqpaFZc-iBth4lfg"

  }
}

### books

{
  status: true,
  data:{
        "_id": ObjectId("88abc190ef0288abc190ef55"),
        "title": "How to win friends and influence people",
        "excerpt": "book body",
        "userId": ObjectId("88abc190ef0288abc190ef02"),
        "ISBN": "978-0008391331",
        "category": "Book",
        "subcategory": "Non fiction",
        "isDeleted": false,
        "reviews": 0,
        "releasedAt": "2021-09-17"
        "createdAt": "2021-09-17T04:25:07.803Z",
        "updatedAt": "2021-09-17T04:25:07.803Z",
      }
}


### reviews

{
  "_id": ObjectId("88abc190ef0288abc190ef88"),
  bookId: ObjectId("88abc190ef0288abc190ef55"),
  reviewedBy: "Jane Doe",
  reviewedAt: "2021-09-17T04:25:07.803Z",
  rating: 4,
  review: "An exciting nerving thriller. A gripping tale. A must read book."
}


## Response examples
### Get books response

{
  status: true,
  message: 'Books list',
  data: [
    {
      "_id": ObjectId("88abc190ef0288abc190ef55"),
      "title": "How to win friends and influence people",
      "excerpt": "book body",
      "userId": ObjectId("88abc190ef0288abc190ef02")
      "category": "Book",
      "reviews": 0,
      "releasedAt": "2021-09-17T04:25:07.803Z"
    },
    {
      "_id": ObjectId("88abc190ef0288abc190ef56"),
      "title": "How to win friends and influence people",
      "excerpt": "book body",
      "userId": ObjectId("88abc190ef0288abc190ef02")
      "category": "Book",
      "reviews": 0,
      "releasedAt": "2021-09-17T04:25:07.803Z"
    }
  ]
}


### Book details response

{
  status: true,
  message: 'Books list',
  data: {
    "_id": ObjectId("88abc190ef0288abc190ef55"),
    "title": "How to win friends and influence people",
    "excerpt": "book body",
    "userId": ObjectId("88abc190ef0288abc190ef02")
    "category": "Book",
    "subcategory": ["Non fiction", "Self Help"],
    "isDeleted": false,
    "reviews": 4,
    "releasedAt": "2021-09-17T04:25:07.803Z"
    "createdAt": "2021-09-17T04:25:07.803Z",
    "updatedAt": "2021-09-17T04:25:07.803Z",
    "reviewsData": [
      {
        "_id": ObjectId("88abc190ef0288abc190ef88"),
        bookId: ObjectId("88abc190ef0288abc190ef55"),
        reviewedBy: "Jane Doe",
        reviewedAt: "2021-09-17T04:25:07.803Z",
        rating: 4,
        review: "An exciting nerving thriller. A gripping tale. A must read book."
      },
      {
        "_id": ObjectId("88abc190ef0288abc190ef89"),
        bookId: ObjectId("88abc190ef0288abc190ef55"),
        reviewedBy: "Jane Doe",
        reviewedAt: "2021-09-17T04:25:07.803Z",
        rating: 4,
        review: "An exciting nerving thriller. A gripping tale. A must read book."
      },
      {
        "_id": ObjectId("88abc190ef0288abc190ef90"),
        bookId: ObjectId("88abc190ef0288abc190ef55"),
        reviewedBy: "Jane Doe",
        reviewedAt: "2021-09-17T04:25:07.803Z",
        rating: 4,
        review: "An exciting nerving thriller. A gripping tale. A must read book."
      },
      {
        "_id": ObjectId("88abc190ef0288abc190ef91"),
        bookId: ObjectId("88abc190ef0288abc190ef55"),
        reviewedBy: "Jane Doe",
        reviewedAt: "2021-09-17T04:25:07.803Z",
        rating: 4,
        review: "An exciting nerving thriller. A gripping tale. A must read book."
      }, 
    ]
  }
}


### Book details response no reviews

{
  status: true,
  message: 'Books list',
  data: {
    "_id": ObjectId("88abc190ef0288abc190ef55"),
    "title": "How to win friends and influence people",
    "excerpt": "book body",
    "userId": ObjectId("88abc190ef0288abc190ef02")
    "category": "Book",
    "subcategory": "Non fiction", "Self Help"],
    "isDeleted": false,
    "reviews": 0,
    "releasedAt": "2021-09-17"
    "createdAt": "2021-09-17T04:25:07.803Z",
    "updatedAt": "2021-09-17T04:25:07.803Z",
    "reviewsData": []
  }
}

### Delete Response Structure

{
  status: true,
  message: ""
}

### Review Response Structure

{
    "status": true,
    "message": "Review added successfully",
    "data": {
        "reviews": 2,
        "isDeleted": false,
        "_id": "63ede089c7c6ef5f68ca5360",
        "title": "Wings of Fire 8347",
        "excerpt": "Free will",
        "userId": "63ede081c7c6ef5f68ca5356",
        "ISBN": "1001078",
        "category": "Science",
        "subcategory": "Life Science",
        "releasedAt": "1990-12-20T00:00:00.000Z",
        "createdAt": "2023-02-16T07:51:37.348Z",
        "updatedAt": "2023-02-16T07:51:47.075Z",
        "__v": 0,
        "reviewsData": {
            "reviewedBy": "Jack",
            "isDeleted": false,
            "_id": "63ede093c7c6ef5f68ca5367",
            "bookId": "63ede089c7c6ef5f68ca5360",
            "rating": 3,
            "review": "very good",
            "reviewedAt": "2023-02-16T07:51:47.029Z",
            "createdAt": "2023-02-16T07:51:47.031Z",
            "updatedAt": "2023-02-16T07:51:47.031Z",
            "__v": 0
        }
    }
}

## Setup Instructions

To set up the project:

Clone the project repository.
Install the required dependencies using npm install.
Configure the environment variables by creating a .env file (see the "Environment Variables" section above).
Start the server using npm start.

## Dependencies

The following dependencies are used in the project:

dotenv: Used for loading environment variables from a .env file.

Make sure to install these dependencies using npm install before running the project. Environment Variables

The system uses environment variables to configure certain settings. Create a .env file in the project root directory and provide the following variables:

PORT: Port number for the server to listen on.
MONGODB_URL: mongoDb Url
Other environment variables as required by your setup.


## Conclusion:

In conclusion, the "Books Management" project aims to provide a set of APIs for managing users, books, and book reviews. The project involves creating, retrieving, updating, and deleting user and book data. Additionally, user authentication and authorization are required to protect the book routes. By following the provided API specifications and implementing the suggested dependencies, you can successfully build the Books Management project.