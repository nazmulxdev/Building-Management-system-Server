# BuildMate - Building Management System (Server-Side)

This is the backend server for the "BuildMate" Building Management System. It handles all API requests, business logic, database interactions, and secure authentication for the client-side application.

<div align="center">

[![Live API](https://img.shields.io/badge/Live_API-Online-blueviolet?style=for-the-badge)](https://my-house-server.vercel.app/)
[![Client Repo](https://img.shields.io/badge/Client_Repo-GitHub-333?style=for-the-badge&logo=github)](https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-nazmulxdev)
[![Live Site](https://img.shields.io/badge/Live_Site-my--house.web.app-blue?style=for-the-badge&logo=firebase)](https://my-house-6de15.web.app/)

</div>

---

### **Server Overview**

This server is built with Node.js and Express.js, providing a robust RESTful API to support the "BuildMate" application. It manages all data through MongoDB and includes secure JWT-based authentication, role-based authorization, payment processing with Stripe, and image handling with Cloudinary.

---

### **Key Features**

✅ **Secure RESTful API:** Provides well-structured and secure endpoints for all client-side operations.

✅ **JWT Authentication & Authorization:**
* Generates a JSON Web Token (JWT) upon user login.
* Implements middleware to verify tokens on protected routes.
* Includes role-based authorization middleware to ensure only users with the correct role (e.g., admin) can access specific endpoints.

✅ **Stripe Payment & Coupon Logic:**
* A secure endpoint (`/create-payment-intent`) to handle payment intents via **Stripe**.
* The server validates coupon codes and applies the correct discount percentage to the final rent amount before processing the payment.

✅ **Database Management with MongoDB:**
* Performs all CRUD (Create, Read, Update, Delete) operations for apartments, users, agreements, payments, coupons, and announcements.

✅ **Image Handling with Cloudinary & Multer:**
* Uses `multer` to handle file uploads from the client.
* Integrates with `cloudinary` to securely store user profile images in the cloud.

✅ **Comprehensive API Logic:**
* Manages user role changes (e.g., user to member upon agreement acceptance).
* Provides aggregated data for the admin dashboard statistics.

---

### **Technologies & Dependencies**

This server is built with the following technologies and packages:

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
</p>

* **Core:** `express`, `cors`, `dotenv`, `cookie-parser`
* **Database:** `mongodb`
* **Authentication:** `jsonwebtoken`
* **Payments:** `stripe`
* **File Uploads:** `cloudinary`, `multer`, `multer-storage-cloudinary`

---

### **Getting Started Locally**

Follow these steps to run the server on your local machine:

**1. Clone the repository:**
```bash
git clone [https://github.com/Programming-Hero-Web-Course4/b11a12-server-side-nazmulxdev.git](https://github.com/Programming-Hero-Web-Course4/b11a12-server-side-nazmulxdev.git)
```

**2. Navigate to the project directory:**
```bash
cd b11a12-server-side-nazmulxdev
```

**3. Install NPM packages:**
```bash
npm install
```

**4. Set up environment variables:**
Create a file named `.env` in the root directory and add the following keys:
```.env
# MongoDB Credentials
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password

# JWT Secret
ACCESS_TOKEN_SECRET=your_super_secret_jwt_key

# Stripe Secret Key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**5. Run the server:**
```bash
npm start
```
The server will start, typically on `http://localhost:5000`.

---
