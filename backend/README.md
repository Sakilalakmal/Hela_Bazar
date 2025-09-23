# Hela Bazar Backend

**Hela Bazar** is a digital marketplace platform that connects **local vendors** and **consumers**. This repository contains the backend API built with **Node.js**, **Express**, and **MongoDB**. The backend handles **vendor registration**, profile management, and product listings. It integrates with **Cloudinary** for image uploads and uses **JWT** for secure authentication.

## Features:
- **Vendor Registration**: Consumers can apply to become vendors by submitting business information, certifications, and images.
- **Profile Management**: Vendors can update their business details, contact information, and product listings.
- **Cloudinary Integration**: Allows vendors to upload and manage their shop images and product images.
- **Role Management**: Uses role-based access to differentiate between consumers and vendors. Automatically assigns the "vendor" role upon successful application.
- **Secure Authentication**: JWT-based authentication for vendor login and access control.
- **Admin Control**: Admins can approve or reject vendor applications, manage users, and update vendor status.
- **CRUD Operations**: Vendors can add, update, and delete product listings.

## Tech Stack:
- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **Cloudinary**
- **JWT (JSON Web Tokens)**
- **Multer**

## Setup Instructions

### Prerequisites:
1. **Node.js** (v14 or above)
2. **MongoDB** (either local or MongoDB Atlas)
3. **Cloudinary Account** (for image uploads)

### 1. Clone the repository:
```bash
git clone https://github.com/Sakilalakmal/Hela_Bazar.git
cd Hela_Bazar
