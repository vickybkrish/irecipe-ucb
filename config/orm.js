const connection = require('./connection');
const mysql = require('mysql');
const LocalStrategy   = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');


const orm = {
    FindUser: function(table, username, val1, callback) {
        var check = "SELECT * FROM ?? WHERE (??) = (?)";
        connection.query(check, [table, username, val1], function(error, result) {
            if (error) throw error;
            callback(result);
        })
    },

    SaveDish: function(table, user_id, dish_name, category, link, servings, photo_url, description,
        val1, val2, val3, val4, val5, val6, val7, callback) {

            var check = "SELECT * FROM ?? WHERE (??, ??) = (?, ?)";
            connection.query(check, [table, user_id, dish_name, val1, val2], function(error, rows) {
                if (error) throw error;

                if (!rows.length) {
                    var makeNew = "INSERT INTO ?? (??, ??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?, ?)";

                    connection.query(makeNew, [table, user_id, dish_name, category, link, servings, photo_url, description, val1, val2, val3, val4, val5, val6, val7], function(error, result) {
                            if (error) throw error;
                            callback(result);
                    });
                };
            });
    },

    SaveIngredients: function(table, ingredient_name, val1) {

        var check = "SELECT * FROM ?? WHERE ?? = ?";
        connection.query(check, [table, ingredient_name, val1], function(error, rows) {

           if (!rows.length) {
                var query = "INSERT INTO ?? (??) VALUES (?)";
                connection.query(query, [table, ingredient_name, val1], function(error, result) {
                    if (error) throw error;
                });
           }
        })
    },

    FindIds: function(table, key, name, callback) {
        var check = "SELECT * FROM ?? WHERE (??) = ?";
        connection.query(check, [table, key, name], function(error, results) {
            if (error) throw error;
            callback(results);
        });
    },


    RecipeMap: function(table, recipe_id, ingredient_id, original_string, val1, val2, val3) {

        var check = "SELECT * FROM ?? WHERE (??, ??) = (?, ?)";
        connection.query(check, [table, recipe_id, ingredient_id, val1, val2], function(error, rows) {

            if (!rows.length) {
                var query = "INSERT INTO ?? (??, ??, ??) VALUES (?, ?, ?)";
                connection.query(query, [table, recipe_id, ingredient_id, original_string, val1, val2, val3], function(error, result) {
                        if (error) throw error;
                });
            }
        });
    },

    SeeAll: function(table, user_id, value, callback) {
        var query = "SELECT * FROM ?? WHERE ?? = ?";
            connection.query(query, [table, user_id, value], function(error, result) {
                if (error) throw error;
                callback(result);
            });
    },

    GetSaved: function(table, recipe_id, value, callback) {
        var query = "SELECT * FROM ?? WHERE ?? = ?";
        connection.query(query, [table, recipe_id, value], function(error, result) {
            if (error) throw error;
            callback(result);
        });
    }
};


module.exports = orm;
