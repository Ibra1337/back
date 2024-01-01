const { reject } = require('lodash');

const sqlite3 = require('sqlite3').verbose();

const initialize = () => {
    const db = new sqlite3.Database('./users.db', sqlite3.OPEN_READWRITE);
    console.log('init');
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE , 
        email TEXT UNIQUE , 
        password TEXT ,
        entrenceCounter INTEGER
    )`);
    console.log(db.open)
    return db;
};

const insertUser = async (db, name, password , email)  => {
    db.run('INSERT INTO users (name, password, email , entrenceCounter) VALUES (?, ?, ? , ?)', [name, email, password, 1], function(err) {
        if (err) {
            return console.error(err.message);
        } 
        console.log('User hass been added');
    });
};

const updateEntranceCounter = (db, name) => {
    const sql = 'UPDATE users SET entrenceCounter = entrenceCounter + 1 WHERE name = ?';

    db.run(sql, [name], function(err) {
        if (err) {
            console.error(err.message);
        }

        if (this.changes > 0) {
            console.log(`Entrance counter updated for user: ${name}`);
            return true;
        } else {
            console.log(`User with name ${name} not found`);
        }
        return false;
    });
};

const display = (db) => {
    const sql = 'SELECT * FROM users';
    db.all(sql, [], (err, rows) => {
        if (rows.length >0 ) {
            console.log('contains')
        }else{
            console.log(`containsn't`)
        }

        console.log('Rows retrieved:');
        rows.forEach(row => {
            console.log(row);
        });
        return false;
    });
};




const xd = (err, rows) => {
    if (err) {
        console.log(rows.length)
        console.error(err);
        return false;
    }
    return rows.length > 0;
};
/*
@typeof(containsUsername(any , string) ) Promise<Boolean>
*/
const containsUsername = async (db, username) => {
    try {
        const rows = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM users WHERE name = ?', [username], (err, rows) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    console.log('len:', rows.length);
                    resolve(rows);
                }
            });
        });

        const len = rows.length;
        console.log('len:', len);

        const res = len > 0;
        console.log('-----------', res);

        return res;
    } catch (err) {
        console.error(err.message);
        throw new Error('Error checking username existence');
    }
};


const contains = async (db, sql, params) => {
    try {
        const rows = await new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        const len = rows.length;
        console.log('len:', len);

        const res = len > 0;
        console.log('-----------', res);

        return res;
    } catch (err) {
        console.error(err.message);
        throw new Error('Error executing database query');
    }
};

const getTop5 = async (db) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users ORDER BY entrenceCounter DESC LIMIT 5';

        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                console.log('Top 5 Rows with Highest Entrance Counts:');
                rows.forEach(row => {
                    console.log(row);
                });
                resolve(rows);
            }
        });
    });
};






module.exports = {
    initialize,
    insertUser,
    updateEntranceCounter,
    display,
    containsUsername,
    getTop5 ,
    contains
};


