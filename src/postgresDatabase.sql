-- CREATE TABLE users(
--   id SERIAL PRIMARY KEY,
--   name TEXT NOT NULL,
--   email TEXT NOT NULL UNIQUE,
--   password TEXT NOT NULL,
--   confirmPassword TEXT NOT NULL
-- )

-- CREATE TABLE urls(
--   id SERIAL PRIMARY KEY,
--   "shortUrl" TEXT NOT NULL,
--   url TEXT NOT NULL
-- )

-- SELECT * FROM urls2;
-- SELECT * FROM users ORDER BY ID DESC LIMIT 1;

-- CREATE TABLE urls2(
-- 	id SERIAL PRIMARY KEY,
-- 	url TEXT NOT NULL,   
-- 	"shortUrl" TEXT NOT NULL,
-- 	user_id INT,
-- 	user_token TEXT NOT NULL
-- )
-- ALTER TABLE urls2 ADD COLUMN count INT DEFAULT 0;

-- CREATE TABLE sessions(
-- 	id SERIAL PRIMARY KEY,
-- 	user_id INT NOT NULL,   
-- 	token TEXT NOT NULL
-- )