-- DROP DATABASE IF EXISTS buy_and_sell;
--
-- CREATE DATABASE buy_and_sell
--     WITH
--     OWNER = admin
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'C'
--     LC_CTYPE = 'C'
--     TABLESPACE = pg_default
--     TEMPLATE template0
--     CONNECTION LIMIT = -1;

DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS types CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS offers_categories CASCADE;


CREATE TABLE categories
(
    id    SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL
);

CREATE TABLE users
(
    id        SERIAL PRIMARY KEY,
    firstname character varying(50)  NOT NULL,
    lastname  character varying(50)  NOT NULL,
    email     character varying(50)  NOT NULL UNIQUE,
    password  character varying(100) NOT NULL,
    avatar    character varying(50)  NOT NULL
);

CREATE TABLE offers
(
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(100) NOT NULL UNIQUE,
    description TEXT         NOT NULL,
    picture     VARCHAR(50)  NOT NULL,
    type        VARCHAR(10)  NOT NULL,
    sum         INTEGER      NOT NULL,
    created_at  TIMESTAMP    NOT NULL,
    user_id     INTEGER      NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE comments
(
    id         SERIAL PRIMARY KEY,
    text       TEXT      NOT NULL,
    offer_id   INTEGER   NOT NULL,
    user_id    INTEGER   NOT NULL,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (offer_id) REFERENCES offers (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


CREATE TABLE offers_categories
(
    offer_id    INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    CONSTRAINT offers_categories_pk PRIMARY KEY (offer_id, category_id),
    FOREIGN KEY (offer_id) REFERENCES offers (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);



