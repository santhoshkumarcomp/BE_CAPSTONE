# Auction Site

This project is an auction site where users can auction items. It allows buyers and sellers to register, login, and participate in auctions. The site supports traditional, reverse, and sealed bidding options.

## Features

- User authentication for buyers and sellers
- Create, update, and delete auction posts
- Bid on auction posts
- Email notifications for bid updates and auction results
- Profile management for buyers and sellers

## Installation

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd BE_CAPSTONE
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```env
   MONGODB_URI=<your-mongodb-uri>
   PORT=<your-port>
   JWT_SECRET=<your-jwt-secret>
   EMAIL_ID=<your-email-id>
   EMAIL_PASS=<your-email-password>
   ```

4. Start the server:
   ```sh
   npm start
   ```

## Usage

### Endpoints

#### Authentication

- **Buyer**

  - `POST /auth/buyer/register` - Register a new buyer
  - `POST /auth/buyer/login` - Login as a buyer
  - `GET /auth/buyer/logout` - Logout as a buyer
  - `GET /auth/buyer/me` - Get buyer profile
  - `POST /auth/buyer/forgotPassword` - Forgot password
  - `GET /auth/buyer/updatepassword` - Update password
  - `POST /auth/buyer/resetpassword/:text` - Reset password
  - `PUT /auth/buyer/editprofile` - Edit buyer profile

- **Seller**
  - `POST /auth/seller/register` - Register a new seller
  - `POST /auth/seller/login` - Login as a seller
  - `GET /auth/seller/logout` - Logout as a seller
  - `GET /auth/seller/me` - Get seller profile
  - `POST /auth/seller/forgotPassword` - Forgot password
  - `GET /auth/seller/updatepassword` - Update password
  - `POST /auth/seller/resetpassword/:text` - Reset password
  - `PUT /auth/seller/editprofile` - Edit seller profile

#### Auction Posts

- **Seller**

  - `POST /seller/post/createpost` - Create a new auction post
  - `GET /seller/post/getposts` - Get all auction posts by the seller
  - `GET /seller/post/closedposts` - Get closed auction posts
  - `GET /seller/post/postbyid/:id` - Get auction post by ID
  - `PUT /seller/post/postbyid/:id` - Update auction post by ID
  - `DELETE /seller/post/postbyid/:id` - Delete auction post by ID

- **Buyer**
  - `GET /buyer/post/getposts` - Get all auction posts
  - `GET /buyer/post/postbyid/:id` - Get auction post by ID
  - `PUT /buyer/post/buyerbid/:id` - Place a bid on an auction post
  - `POST /buyer/post/buyerbid/:id` - Place a sealed bid on an auction post
  - `PATCH /buyer/post/buyerbid/:id` - Place a reverse bid on an auction post

## Middleware

- **Logger** - Logs incoming requests
- **Error Route** - Handles 404 errors
- **Authentication** - Verifies JWT tokens for buyers and sellers
- **Upload** - Handles file uploads using multer

## Models

- **Buyer** - Schema for buyer information
- **Seller** - Schema for seller information
- **Post** - Schema for auction posts
- **Price** - Schema for bid prices

## Utils

- **sendMail** - Utility for sending emails using nodemailer
- **config** - Configuration for environment variables

## License

This project is licensed under the ISC License.
