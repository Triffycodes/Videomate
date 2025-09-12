# 📺 VideoTube Backend

This is the backend API for **VideoTube**, a full-featured video-sharing platform similar to YouTube. It is built with **Node.js**, **Express.js**, and **MongoDB**, and supports features like video uploads (via **Multer + Cloudinary**), user authentication, comments, playlists, likes, subscriptions, and analytics.

---

- Model Link: [VideoMate](https://postimg.cc/Z0hwwkJN).

---

## 🚀 Features

- ✅ JWT-based User Authentication with Cookies
- 🎥 Video Upload & Streaming (Multer + Cloudinary)
- 📺 Channel Management and Subscriptions
- 📂 Playlist Creation, Update & Deletion
- 💬 Nested Comments System
- 👍 Likes on Videos, Comments & Tweets
- 📊 Channel Dashboard & Analytics
- 🔍 Search, Filter, and Pagination
- 🧪 Healthcheck API

---

## 🧰 Tech Stack

- **Backend**: Node.js, Express.js (v5)
- **Database**: MongoDB with Mongoose
- **Uploads**: Multer for handling form-data, Cloudinary for video storage
- **Auth**: JWT + Cookies (`cookie-parser`)
- **Tools**: dotenv, cors, bcrypt, mongoose-aggregate-paginate-v2, etc.

---


🔐 Environment Variables
- Create a .env file in the root directory and add:


- PORT=8000
- MONGODB_URI=your_mongodb_connection_string

- CLIENT_URL=*
- REFRESH_TOKEN_SECRET = your_refresh_token_secret
- ACCESS_TOKEN_SECRET = your_access_token_secret
- REFRESH_TOKEN_EXPIRY = 7d (just an example)
- ACCESS_TOKEN_EXPIRY = 1h (just an example)

- CLOUDINARY_CLOUD_NAME=your_cloud_name
- CLOUDINARY_API_KEY=your_cloudinary_api_key
- CLOUDINARY_API_SECRET=your_cloudinary_api_secret