
CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author TEXT,
  url TEXT NOT NULL CHECK (url <> ''),
  title TEXT NOT NULL CHECK (title <> ''),
  likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title)
VALUES ('Dan Abramov', 'https://overreacted.io/on-let-vs-const/', 'On let vs const');

INSERT INTO blogs (author, url, title, likes)
VALUES ('Laurenz Albe', 'https://www.cybertec-postgresql.com/en/gaps-in-sequences-in-postgresql/', 'Gaps in sequences in PostgreSQL', 0);

SELECT * FROM blogs;
