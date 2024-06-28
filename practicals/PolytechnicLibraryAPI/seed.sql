CREATE TABLE Users (
  user_id INT IDENTITY(1,1) PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  passwordHash VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('member','librarian')) NOT NULL
);

CREATE TABLE Books (
  book_id INT IDENTITY(1,1) PRIMARY KEY,
  title VARCHAR(255) NOT NULL UNIQUE, -- Title is required and unique (cannot be NULL)
  author VARCHAR(255) NOT NULL, -- Author is required (cannot be NULL)
  availability CHAR(1) CHECK (availability IN ('Y','N')) NOT NULL
);

-- Insert data into Books table
INSERT INTO Books (title, author, availability)
VALUES
  ('The Lord of the Rings', 'J.R.R. Tolkien', 'Y'),
  ('Pride and Prejudice', 'Jane Austen', 'Y');