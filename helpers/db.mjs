import sqlite3 from "sqlite3"


const getDB = () => {

    const db = new sqlite3.Database('./database.db', (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Connected to SQLite database.');
      });
      
      // Create a table (run only once or use conditional checks)
      db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price TEXT,
        img TEXT
      )`);
    
    return db
}

const insertProduct = (name, price, img) => {

    const db = getDB()

    db.run(`INSERT INTO products (name, price, img) VALUES (?, ?)`, [name, price, img], function(err) {
        console.log("fuuuuuck")
        console.log(err)
    });

}

export { insertProduct }