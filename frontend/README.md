# Echofy Frontend

Welcome to the *Echofy Frontend*. This document provides an overview of the project's structure and features for the frontend.

## How to run?
```
$ npm install && npm start
```

## Directory Structure and Functionality

Below is an outline of the project's directory structure along with a description of the contents and functionality of each directory and file.

- `package.json` - This is a core file in any Node.js project and contains metadata about the project and its dependencies.
- `package-lock.json` - This file locks the version of packages that need to be installed.
- `/public` - This folder stores UI designs.
- `/src` - This folder stores all the source code for the frontend.
    - `/components` - This folder stores the source code for small frontend components.

## Features

The application is built with the following features:

- Registration page
    - **Register** - End users are able to register their own accounts with personal information.

- Login page 
    - **Login** - Users are able to log in with their password and username.

- Home Page
    - **Post Echo** - Users can post an Echo, which can include images and text content.
    - **Search** - Users can search for a specific user by entering their username.
    - **Echoes display** - For logged-in users, they can view all Echoes from the users they follow. Public echoes are displayed for users who are not logged in.
    - **Like/unlike Echoes** (across pages) - Users can like or unlike the displayed Echoes.
    - **Comment Echoes** (across pages) - Users can post comments on the displayed Echoes.
    - **Repost Echoes** - Users can repost a particular Echo.
    - **View Echoes** - Users can view the details of displayed Echoes.
    - **Trend** - The trendy Echoes are displayed on the right-hand side.

- Profile page
    - **Change password** - Users can change their password.
    - **Change personal information** - Users can change their information, including email and username.
    - **Follow** - Users can accept and send follow requests.
    - (Admin feature) **Delete user** - Admins can delete a user account.

- Admin page
    - (Admin feature) **View users** - Admins can view all the existing users.

- Echo page
    - Shares features from main page, excluding feature **Search**.