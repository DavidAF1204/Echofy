const pool = require('../dbconnect');

/**
 * @description create table for the backend initialization
 * 
 * @component database
 * @returns null
 * @export {Promise<void>} createTable
 */

const createAccountTableQuery = `
  CREATE TABLE IF NOT EXISTS ACCOUNT (
    ACCOUNT_ID SERIAL PRIMARY KEY,
    USERNAME VARCHAR(50),
    EMAIL VARCHAR(256),
    PASSWORD VARCHAR(256)
  );
`;

const createAdminTableQuery = `
  CREATE TABLE IF NOT EXISTS ADMIN (
    ACCOUNT_ID INT PRIMARY KEY,
    USER_TYPE VARCHAR(20),
    FOREIGN KEY (ACCOUNT_ID) REFERENCES ACCOUNT(ACCOUNT_ID)
  );
`;

const createUserTableQuery = `
  CREATE TABLE IF NOT EXISTS "USER" (
    ACCOUNT_ID INT PRIMARY KEY,
    USER_TYPE VARCHAR(20),
    BIRTHDAY DATE,
    GENDER VARCHAR(10),
    COUNTRY TEXT,
    PUBLIC BOOLEAN,
    SUSPENSION_STATE BOOLEAN,
    BAN_REASON TEXT,
    FOREIGN KEY (ACCOUNT_ID) REFERENCES ACCOUNT(ACCOUNT_ID)
  );
`;

const createFollowTableQuery = `
  CREATE TABLE IF NOT EXISTS FOLLOW (
    USER_FOLLOWING INT,
    USER_FOLLOWER INT,
    STATE VARCHAR(20),
    FOREIGN KEY (USER_FOLLOWING) REFERENCES "USER"(ACCOUNT_ID),
    FOREIGN KEY (USER_FOLLOWER) REFERENCES "USER"(ACCOUNT_ID),
    PRIMARY KEY (USER_FOLLOWING, USER_FOLLOWER)
  );
`;

const createEchoTableQuery = `
  CREATE TABLE IF NOT EXISTS ECHO (
    ECHO_ID SERIAL PRIMARY KEY,
    POSTER_ID INT,
    CONTENT TEXT,
    LATEST_UPDATE_TIME TIMESTAMP,
    REECHO_FLAG BOOLEAN,
    REECHO_ID INT,
    SUSPENSION_STATE BOOLEAN,
    FOREIGN KEY (POSTER_ID) REFERENCES "USER"(ACCOUNT_ID)
  );
`;

const createLikeEchoTableQuery = `
  CREATE TABLE IF NOT EXISTS LIKE_ECHO (
    ECHO_ID INT,
    LIKE_USER_ID INT,
    FOREIGN KEY (LIKE_USER_ID) REFERENCES "USER"(ACCOUNT_ID),
    FOREIGN KEY (ECHO_ID) REFERENCES ECHO(ECHO_ID),
    PRIMARY KEY (ECHO_ID, LIKE_USER_ID)
  );
`;

const createEchoImagesTableQuery = `
  CREATE TABLE IF NOT EXISTS ECHO_IMAGES (
    ECHO_IMAGE_ID SERIAL PRIMARY KEY,
    ECHO_ID INT,
    IMAGE BYTEA,
    IMAGE_TYPE VARCHAR(50),
    FOREIGN KEY (ECHO_ID) REFERENCES ECHO(ECHO_ID)
  );
`;

const createCommentTableQuery = `
  CREATE TABLE IF NOT EXISTS COMMENT (
    COMMENT_ID SERIAL PRIMARY KEY,
    ECHO_ID INT,
    POSTER_ID INT,
    CONTENT TEXT,
    LATEST_UPDATE_TIME TIMESTAMP,
    SUSPENSION_STATE BOOLEAN,
    FOREIGN KEY (ECHO_ID) REFERENCES ECHO(ECHO_ID),
    FOREIGN KEY (POSTER_ID) REFERENCES "USER"(ACCOUNT_ID)
  );
`;

const createLikeCommentTableQuery = `
  CREATE TABLE IF NOT EXISTS LIKE_COMMENT (
    COMMENT_ID INT,
    LIKE_USER_ID INT,
    FOREIGN KEY (LIKE_USER_ID) REFERENCES "USER"(ACCOUNT_ID),
    FOREIGN KEY (COMMENT_ID) REFERENCES COMMENT(COMMENT_ID),
    PRIMARY KEY (COMMENT_ID, LIKE_USER_ID)
  );
`;



const createTables = async () => {
    let client
    try {
        client = await pool.connect()

        await client.query(createAccountTableQuery);
        console.log('Account table created or already exists!');
    
        await client.query(createAdminTableQuery);
        console.log('Admin table created or already exists!');
    
        await client.query(createUserTableQuery);
        console.log('User table created or already exists!');
    
        await client.query(createFollowTableQuery);
        console.log('Follow table created or already exists!');
    
        await client.query(createEchoTableQuery);
        console.log('Echo table created or already exists!');
    
        await client.query(createLikeEchoTableQuery);
        console.log('LikeEcho table created or already exists!');
    
        await client.query(createEchoImagesTableQuery);
        console.log('EchoImages table created or already exists!');
    
        await client.query(createCommentTableQuery);
        console.log('Comment table created or already exists!');
    
        await client.query(createLikeCommentTableQuery);
        console.log('LikeComment table created or already exists!');
    
        const showTablesQuery = 'SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = \'public\';';
        const result = await client.query(showTablesQuery);
        const tables = result.rows.map((row) => row.tablename);
        console.log('Tables in the database:');
        console.log(tables);
        // res.send('Tables dropped successfully');
    } catch (error) {
        console.error('Error creating tables:', error);
    } finally {
        if (client){
            client.release()
        }
    }
  };
  
module.exports = createTables
