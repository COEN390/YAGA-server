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


  db.run(
    `CREATE TABLE IF NOT EXISTS metro (
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

const removeBarcode = (barcode) => {
  const db = getDB();

  db.get(`SELECT id FROM barcodes WHERE barcode = ?`, [barcode], (err, row) => {
    if (err) {
      return console.error(err);
    }

    if (!row) {
      return console.log("Barcode not found.");
    }

    const id = row.id;

    // Delete related rows first
    db.run(`DELETE FROM maxi WHERE barcode_id = ?`, [id], (err) => {
      if (err) console.error(err);
    });

    db.run(`DELETE FROM super_c WHERE barcode_id = ?`, [id], (err) => {
      if (err) console.error(err);
    });

    db.run(`DELETE FROM metro WHERE barcode_id = ?`, [id], (err) => {
      if (err) console.error(err);
    });

    // Then delete barcode
    db.run(`DELETE FROM barcodes WHERE id = ?`, [id], (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Barcode ${barcode} and related data removed.`);
      }
    });
  });
};
 
  
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

const getAllBarcodesDB = () => {

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

const getBarcodeData = (table, barcode_id) => {
  
  const db = getDB();

  if(table == "maxi") {
    return new Promise((resolve, reject) => {
      
      db.get(`SELECT * FROM maxi WHERE barcode_id = ?`, [barcode_id], (err, row) => {
        if (err) {
          console.log(err)
          reject(err)
        } 
        else if (row) {
          resolve(row)
        } else {
          reject('No row found');
        }
      });
    }) 
  }

  if(table == "super_c") {
    return new Promise((resolve, reject) => {
      
      db.get(`SELECT * FROM super_c WHERE barcode_id = ?`, [barcode_id], (err, row) => {
        if (err) {
          console.log(err)
          reject(err)
        } 
        else if (row) {
          resolve(row)
        } else {
          reject('No row found');
        }
      });
    }) 
  }

  if(table == "metro") {
    return new Promise((resolve, reject) => {
      


      db.get(`SELECT * FROM metro WHERE barcode_id = ?`, [barcode_id], (err, row) => {
        if (err) {
          console.log(err)
          reject(err)
        } 
        else if (row) {
          resolve(row)
        } else {
          reject('No row found');
        }
      });
    }) 
  }

}

const getAllMaxi = () => {
  const db = getDB();
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM maxi`, (err, rows) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

const getAllSuperC = () => {
  const db = getDB();
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM super_c`, (err, rows) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

const getAllMetro = () => {
  const db = getDB();
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM metro`, (err, rows) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

export { insertBarcode, insertMaxi, insertSuperC, getAllBarcodesDB , createDB , getBarcodeData , removeBarcode , getAllMaxi , getAllSuperC , getAllMetro }
