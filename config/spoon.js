const unirest = require('unirest');

let spoon = {
    RecipeSearch: function(query, diet, intolerances, type, callback) {

        let apiQuery = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?";

        if(diet) {
            diet = diet.split(' ').join('+');
            diet = "diet=" + diet;
            apiQuery = apiQuery + diet;
        }

        if (intolerances) {
            intolerances = intolerances.split(', ').join('+');
            intolerances = "&intolerances=" + intolerances;
            apiQuery = apiQuery + intolerances;
        }

        if(query) {
            query = query.split(' ').join('+');
            query = "&limitLicense=false&number=10&offset=0&query=" + query;
            apiQuery = apiQuery + query;
        }



        if (type) {
            type = type.split(' ').join('+');
            type = "&type=" + type;
            apiQuery = apiQuery + type;
        }



        unirest.get(apiQuery)
        .header("X-Mashape-Key", "x2othLjl1ymshrQWwghfeNrLwz9Ap1u7uCZjsnylnshOVnR3Wh")
        .header("Accept", "application/json")
        .end(function (result) {
            callback(result.body.results);
        });
    },

    GetRecipes: function(searchUrl, callback) {
        unirest.get(searchUrl)
        .header("X-Mashape-Key", "x2othLjl1ymshrQWwghfeNrLwz9Ap1u7uCZjsnylnshOVnR3Wh")
        .header("Accept", "application/json")
        .end(function (result) {

            let recipeSelection =  {
                id: result.body.id,
                title: result.body.title,
                time: result.body.readyInMinutes,
                category: result.body.dishTypes[0],
                servings: result.body.servings,
                ingredients: result.body.extendedIngredients,
                photo_url: result.body.image,
                spoonacularUrl: result.body.spoonacularSourceUrl,
                recipeUrl: "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/" + result.body.id + "/information?includeNutrition=false"
            };


            if (result.body.instructions) {
                let editedInstructions = result.body.instructions.split('. ');
                recipeSelection.instructions = editedInstructions;
            }

            callback(recipeSelection);
        });

    }
};

module.exports = spoon;
