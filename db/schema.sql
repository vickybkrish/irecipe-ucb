CREATE DATABASE trythis_db;
USE trythis_db;

CREATE TABLE recipes (
    recipe_id int NOT NULL AUTO_INCREMENT,
    user_id int NOT NULL,
    dish_name varchar(250) NOT NULL,
    category varchar(250),
    link varchar(500),
    servings int,
    photo_url varchar(250),
    description mediumtext,
    PRIMARY KEY (recipe_id)
);

CREATE TABLE ingredients (
    ingredient_id int NOT NULL AUTO_INCREMENT,
    ingredient_name varchar(250) NOT NULL,
    PRIMARY KEY (ingredient_id)
);

CREATE TABLE recipe_ingredients (
    recipe_id int NOT NULL,
    ingredient_id int NOT NULL,
    original_string varchar(250) NOT NULL,
    KEY recipe_id (recipe_id),
    KEY ingredient_id (ingredient_id)
);

CREATE TABLE users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(20) NOT NULL,
    password CHAR(60) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC),
    UNIQUE INDEX username_UNIQUE (username ASC)
);
