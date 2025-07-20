import sqlite3 from "sqlite3"

const createDB = () => {
  const db = getDB();

  // Create a table (run only once or use conditional checks)
  db.run(
    `CREATE TABLE IF NOT EXISTS barcodes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      barcode TEXT Unique
    )`
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS maxi (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      price TEXT,
      img_url TEXT,
      barcode_id INTEGER,
      FOREIGN KEY (barcode_id) REFERENCES barcodes (id)
    )`
  )

  db.run(
    `CREATE TABLE IF NOT EXISTS super_c (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      price TEXT,
      img_url TEXT,
      barcode_id INTEGER,
      FOREIGN KEY (barcode_id) REFERENCES barcodes (id)
    )`
  )
}

const getDB = () => {

    const db = new sqlite3.Database('./database.db', (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Connected to SQLite database.');
      });

    return db
}

const insertBarcode = (barcode) => {

    const db = getDB()

    return new Promise( (resolve, reject) => {
      
      db.run(`INSERT INTO barcodes (barcode) VALUES (?)`, [barcode], function (err) {
          if (err){
            reject(err)
          } else {
            resolve(this.lastID)
          }
      });
    })
}

const insertMaxi = (title, price, url, id) => {
  const db = getDB()
  db.run(`INSERT INTO maxi (title, price, img_url, barcode_id) VALUES (?, ?, ?, ?)`, [title, price, url, id], (err) => {
  });
}

const insertSuperC = (title, price, url, id) => {
  const db = getDB()
  db.run(`INSERT INTO super_c (title, price, img_url, barcode_id) VALUES (?, ?, ?, ?)`, [title, price, url, id], (err) => {
  });
}

const getAllBarcodes = () => {

  const db = getDB();
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM barcodes`, (err, rows) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

export { insertBarcode, insertMaxi, insertSuperC, getAllBarcodes , createDB }