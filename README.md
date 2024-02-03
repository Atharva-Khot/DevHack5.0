Project Name: ItsAMess

## Overview

This project consists of three Node.js servers: web.js, meal_update.js, and coupan.js. The main server (web.js) serves as the main website, handling user registration and login. The other two servers, meal_update.js and coupan.js, are auxiliary servers. Additionally, blockchain technology is utilized to store transaction history.

## Prerequisites

Make sure you have the following installed:

- Node.js
- MongoDB
- Nodemon (for development)

## Setup

1. Install dependencies:

    bash
    npm install
    

2. Start the main server (web.js), and the other servers (meal_update.js and coupan.js) using Nodemon:

    bash
    nodemon web.js
    nodemon meal_update.js
    nodemon coupan.js
    

3. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to access the main website.

## User Registration and Login

- To register, click on the "Register" option on the main website and fill in the required information. User data (user_id and encrypted password) will be stored in MongoDB.

- To log in, use the "Login" option. The code checks if the user is in the database. If not, it redirects to the home screen.

## Features

If the user successfully logs in:

1. *Digital Wallet:* Navigate to the Digital Wallet page, where a dynamic wallet interface is available.

2. *Redeem Coupons:* Access the Redeem Coupons feature from the sidebar.

3. *Menu:* Explore the menu from the sidebar.

## Blockchain Integration

- This project incorporates blockchain technology to store transaction history. All transactions made within the application are securely recorded on the blockchain.

## Important Note

- Ensure MongoDB is running and accessible before starting the servers.
