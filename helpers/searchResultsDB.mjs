import sqlite3 from "sqlite3";

// Opens (or creates if it doesn't exist) a SQLite database for storing search results
// Filename is 'searchDatabase.db' to avoid conflicts with other databases
const getSearchDB = () => {
  const db = new sqlite3.Database('./searchDatabase.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to SQLite database (search results).');
  });

  return db;
};

// Creates the necessary table for storing search results
const createSearchResultsTable = () => {
  const db = getSearchDB();

  db.run(`
    CREATE TABLE IF NOT EXISTS name_search_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      price TEXT,
      img_url TEXT,
      quantity TEXT,
      brand TEXT,
      price_per_unit TEXT,
      barcode TEXT,
      store TEXT,
      search_term TEXT,
      scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

// Deletes all previous search results, should be called before a new search
// to ensure only the latest results are stored.
const clearNameSearchResults = () => {
  const db = getSearchDB();
  db.run(`DELETE FROM name_search_results`, (err) => {
    if (err) console.error("❌ Failed to clear old search results:", err);
    else console.log("🧹 Cleared old name search results");
  });
};

// Inserts a new product into the name_search_results table
const insertNameSearchResult = (product, store, searchTerm) => {
  const db = getSearchDB();
  const { title, price, img, quantity, brand, pricePerUnit, barcode } = product;

  db.run(
    `INSERT INTO name_search_results 
     (title, price, img_url, quantity, brand, price_per_unit, barcode, store, search_term) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, price, img, quantity, brand, pricePerUnit, barcode, store, searchTerm],
    (err) => {
      if (err) console.error("❌ Insert failed:", err);
    }
  );
};

// Retrieves all search results from the name_search_results table
const getAllSearchResults = () => {
  const db = getSearchDB();
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM name_search_results`, (err, rows) => {
      if (err) {
        console.error("❌ Query error:", err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

export {
  createSearchResultsTable,
  clearNameSearchResults,
  insertNameSearchResult,
  getAllSearchResults
};