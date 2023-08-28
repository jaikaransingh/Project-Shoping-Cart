# Project - Shopping Cart

## Overview

The "Shopping Cart" project is a web application that simulates an online shopping experience. It provides various APIs for managing user authentication, product listings, adding/removing products to/from the cart, and checkout processes.

## Models

### User Model

```json
{
  "name": "John Doe",
  "email": "johndoe@mailinator.com",
  "password": "abcd1234567",
  "createdAt": "2021-09-17T04:25:07.803Z",
  "updatedAt": "2021-09-17T04:25:07.803Z"
}

### Product Model

```json

{
  "name": "Product Name",
  "description": "Product description",
  "price": 19.99,
  "stock": 100,
  "createdAt": "2021-09-17T04:25:07.803Z",
  "updatedAt": "2021-09-17T04:25:07.803Z"
}

### Cart Item Model

```json

{
  "productId": "ObjectId",
  "quantity": 2,
  "createdAt": "2021-09-17T04:25:07.803Z",
  "updatedAt": "2021-09-17T04:25:07.803Z"
}

### User APIs
## POST /register

    Create a user.
    Return HTTP status 201 on a successful user creation, along with the user document.
    Return HTTP status 400 for an invalid request.

### POST /login

    Allow a user to login with their email and password.
    On a successful login attempt, return a JWT token containing the userId, exp, and iat.
    If the credentials are incorrect, return an error message with a valid HTTP status code.

### Product APIs
## POST /products

    Create a product document.
    Return HTTP status 201 on successful product creation, along with the product document.
    Return HTTP status 400 for an invalid request.

## GET /products

    Returns all products available.
    Return HTTP status 200 if any documents are found.
    Return HTTP status 404 if no documents are found.

## GET /products/:productId

    Returns details of a product.
    Return HTTP status 200 if the document is found.
    Return HTTP status 404 if the document is not found.

### Cart APIs
## POST /cart/add/:productId

    Add a product to the cart.
    Check if the productId exists and has enough stock.
    Update the user's cart or create a new cart item.
    Return the updated cart on successful operation.

## POST /cart/remove/:productId

    Remove a product from the cart.
    Check if the productId exists in the user's cart.
    Remove the cart item from the user's cart.
    Return the updated cart on successful operation.

## GET /cart

    Returns the user's cart with product details.
    Return HTTP status 200 if the cart has items.
    Return HTTP status 404 if the cart is empty.

## POST /cart/checkout

    Process the user's cart items for checkout.
    Check if cart items are valid and have sufficient stock.
    Deduct the stock, create an order, and clear the cart.
    Return HTTP status 200 on successful checkout.

###Setup Instructions

    Clone the project repository.
    Install the required dependencies using npm install.
    Configure environment variables by creating a .env file (see the "Environment Variables" section above).
    Start the server using npm start.

### Dependencies

    dotenv: Used for loading environment variables from a .env file.

### Authentication

    User routes are protected by authentication.

### Testing

    Use Postman to test the APIs.
    Create a new collection in Postman for testing.
