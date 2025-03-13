# Echofy backend

Welcome to the *Echofy backend*. This document provides an overview of the project's structure and features for backend. 

## How to run?
```
$ npm install && npm run dev
```

## Directory Structure and Functionality

Below is an outline of the project's directory structure along with a description of the contents and functionality of each directory and file.

- `package.json` - A core file in any Node.js project and contains metadata about the project and its dependencies
- `package-lock.json` - File to lock the version of packages have to be installed
- `dbconnect.js` - File for building connection to database
- `index.js` - All request would be listened and redirect to specifc routes
- `.env` - File store all the data for Database connection and a sign key for token generation and matching

**In the light of security issues, we cannot expose `.env` file to the GitHub Repository** 

## Features

The APIs handle the following features:
1. **Register** - Getting request with personal information and insert an entity to tables of database  
2. **Login** - Getting request of username and password, match user data in database  
3. **Post Echo** - Receive post content, insert an entity to tables of database  
4. **Search** - Getting request with target username, match user data in database  
5. **Fetch following Echoes** - Check all followings of current user, fetch their Echoes from database. 
6. **Fetch public Echoes** - Fetch all public Echoes from database. 
7. **Like/unlike Echoes** - Receving request with user Id, like the Echoes if no matching entites in database,vice versa
8. **Comment Echoes** - Receving request with user Id and content, insert an comment entity to comment table of database
9. **Repost Echoes** - Post Echo with reposting Echo id in request
10. **Trend** - Upon request, Fetch the top3 Echoes with maximum liked
11. **Change passowrd** - Receve the new password with request, update the password of user in database
12. **Edit profile** - Receve the new new information with request, update them in database
13. **follow user** - Check if the the targeted user is followed in database, if no, insert the entity to follow table in database, vice versa  
14. (Admin feature) **delete user** - Receving request with user Id, verify if the user type is admin, if yes, delete all user related entites in database
15. (Admin feature) **list user** - Upon request, fetch all the existing users from dtabase  
---