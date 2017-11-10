const orm = require('../config/orm.js');


const material = {
    GetUserId: function(username, callback) {
        orm.FindUser('users', 'username', username, function(result) {
            callback(result);
        });
    },

    SaveRecipe: function(val1, val2, val3, val4, val5, val6, val7, callback) {
        orm.SaveDish('recipes', 'user_id', 'dish_name', 'category', 'link', 'servings', 'photo_url', 'description', val1, val2, val3, val4, val5, val6, val7, function(result) {
                callback(result);
        });
    },

    SaveIngredients: function(val1, callback) {
        orm.SaveIngredients('ingredients', 'ingredient_name', val1, function(result) {
            callback(result);
        });
    },

    GetIngredientId: function(name, callback) {
        orm.FindIds('ingredients', 'ingredient_name', name, function(result) {
            callback(result);
        })
    },

    GetRecipeId: function(name, callback) {
        orm.FindIds('recipes', 'dish_name', name, function(result) {
            callback(result);
        })
    },

    MapRecipe: function(val1, val2, val3, callback) {
        orm.RecipeMap('recipe_ingredients', 'recipe_id', 'ingredient_id', 'original_string', val1, val2, val3)
    },

    MyRecipes: function(value, callback) {
        orm.SeeAll('recipes', 'user_id', value, function(result) {
            callback(result);
        });
    },

    RecipeInfo: function(value, callback) {
        orm.GetSaved('recipes', 'recipe_id', value, function(result) {
            callback(result);
        });
    },

    RecipeIngredients: function(value, callback) {
        orm.GetSaved('recipe_ingredients', 'recipe_id', value, function(result) {
            callback(result);
        });
    }
};

module.exports = material;
