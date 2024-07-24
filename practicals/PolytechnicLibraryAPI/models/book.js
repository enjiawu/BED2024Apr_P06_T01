const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Book {
  constructor(book_id, title, author, availability) {
    this.book_id = book_id;
    this.title = title;
    this.author = author;
    this.availability = availability;
  }

  static async getAllBooks() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Books`; 

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) => new Book(row.book_id, row.title, row.author, row.availability)
    ); // Convert rows to Book objects
  }

  static async getBookById(book_id) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Books WHERE book_id = @book_id`; // Parameterized query

    const request = connection.request();
    request.input("book_id", book_id);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new Book(
          result.recordset[0].book_id,
          result.recordset[0].title,
          result.recordset[0].author,
          result.recordset[0].availability
        )
      : null; // Handle book not found
  }

  static async updateBookAvailability(book_id, newAvailability) {
    let pool;
    try {
      pool = await sql.connect(dbConfig);

      // Update query
      const sqlQuery = `
        UPDATE Books
        SET availability = @availability
        WHERE book_id = @book_id
      `;

      // Execute the update query
      await pool
        .request()
        .input("availability", newAvailability)
        .input("book_id", book_id)
        .query(sqlQuery);

      // Fetch and return the updated book object
      return await this.getBookById(book_id);
    } catch (err) {
      console.error("Error updating book availability:", err.message);
      throw err; // Rethrow the error to be handled by the caller
    } finally {
      if (pool) pool.close();
    }
  }
}

module.exports = Book;