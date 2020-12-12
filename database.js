const db = require('better-sqlite3')('database.db');
const crypto = require('crypto');

/**
 * 
 * This module exports a function  which registers users by using
 * 
 * 
 * @param injectedUserDBHelper - this object handles the execution of user
 * related database operation such as storing them when they register
 * 
 * @return {{registerUser: registerUser, login: *}}
 */


function saveAccessToken(accessToken, user, callback){
    let user_id = db.prepare('SELECT id FROM users WHERE username=?').get(user.username);
    let stmt = db.prepare('DELETE FROM user_token WHERE user_id = ?');
    stmt.run(user_id.id);
    stmt = db.prepare('INSERT INTO user_token (user_id, token) VALUES (?, ?)');
    stmt.run(user_id.id, accessToken);
    callback(null);
 }
 

function generateAccessToken(){
    return crypto.randomBytes(20).toString('hex');
}

function getUser(username, password, callback){
    //validate the request
    if (!isString(username) || !isString(password)){
        callback(null)
    }
    password = hashPassword(password);
    const row = db.prepare('SELECT * FROM users WHERE username=? AND password=?').get(username, password);
    callback(row);
}
function registerUser(username, password){

    //validate the request
    if (!isString(username) || !isString(password)){
        return "Invalid Credentials"
    }

    const row = db.prepare('SELECT * FROM users WHERE username=?').get(username);
    // Create account if it does not exist.
    if (row === undefined) {
        password = hashPassword(password);
        const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
        stmt.run(username, password);
        sendResponse(res, "Registration was successful", null);
    }
    // If an account with the username exists, redirect with error.
    else {
        sendResponse(res, "Failed to register user" , "User already exists.");
    }
}


function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('base64');
}


/**
 *
 * Returns true the specified parameters is a string else it returns false
 *
 * @param parameter
 * @return {boolean}
 */
function isString(parameter) {
    return parameter != null && (typeof parameter === "string"
                                        || parameter instanceof String) ? true : false
}

function getUserIDFromToken(token) {
    const row = db.prepare('SELECT user_id FROM user_token WHERE token = ?').get(token);
    if (row == undefined) {
        return null;
    }
    return row.user_id;
}
function isAccessTokenValid(token) {
    const row = db.prepare('SELECT * FROM user_token WHERE token = ?').get(token);
    return row != undefined
}

function isUserAdmin(token, callback) {
    let isAdmin = false;
    const row = db.prepare('SELECT * FROM user_token WHERE token = ?').get(token);
    if(row != undefined) {
        isAdmin = db.prepare('SELECT isAdmin FROM users WHERE id = ?').get(row.user_id);
    }
    callback(isAdmin)
}


exports.getUser = getUser;
exports.generateAccessToken = generateAccessToken;
exports.saveAccessToken = saveAccessToken;
exports.registerUser = registerUser;
exports.getUserIDFromToken = getUserIDFromToken;
exports.isAccessTokenValid = isAccessTokenValid;
exports.isUserAdmin = isUserAdmin;