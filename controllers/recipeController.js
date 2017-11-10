const express = require('express');
const router = express.Router();
const recipe = require('../models/recipe.js');
const spoon = require('../config/spoon.js');
const jquery = require('jquery');
const passport = require('passport');


//get homepage
router.get('/', function(request, response) {

    console.log(request.user);
    console.log(request.isAuthenticated());

    let user = {
        user: request.user
    }

    response.render('index', user);
});


//retrieve recipe search list
router.post('/query', function(request, response) {

    console.log(request.body);

    const {query, diet, intolerances, type} = request.body

    spoon.RecipeSearch(query, diet, intolerances, type, function(data) {

            for (let i = 0; i < data.length; i++) {
                let image = 'https://spoonacular.com/recipeImages/' + data[i].image;
                data[i].image = image;
                data[i].recipeUrl = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/" + data[i].id + "/information?includeNutrition=false";

            };

            let recipeList = {
                list: data,
                user: request.user
            };

            response.render('index', recipeList);
        });
});




//get specific recipe
router.post('/recipe', function(request, response) {
    spoon.GetRecipes(request.body.link, function(data) {

        recipe.GetRecipeId(data.title, function(database) {

            if (database.length > 0) {
                data.confirm = 'This recipe has been saved!';
            }

            data.user = request.user;
            response.render('index', data);
        });
    });
});






// //get specific recipe
// router.post('/recipe', function(request, response) {
//     spoon.GetRecipes(request.body.link)
//     .then(function(data) {
//         recipe.GetRecipeId(data.title)
//     }).then(function(result) {
//         if (result) {
//             data.confirm = 'This recipe has been saved!';
//         };

//         data.user = request.user;
//         response.render('index', data);
//     }).catch(function(error) {
//         throw error;
//     });
// });




//Save Recipe to Database
router.post('/save', function(request, response) {
    spoon.GetRecipes(request.body.link, function(data) {

        if (data.instructions) {
            data.instructions = data.instructions.join('. ');
        } else {
            data.instructions = '';
        }

        const {title, category, recipeUrl, servings, photo_url, instructions} = data;


        //check if logged in
        if(request.user && request.isAuthenticated()) {
            recipe.GetUserId(request.user.username, function(id) {

                //save recipe info
                recipe.SaveRecipe(id[0].id, title, category, recipeUrl, servings, photo_url, instructions, function(thing) {

                    //save ingredients
                    for (let i = 0; i < data.ingredients.length; i++) {
                        recipe.SaveIngredients(data.ingredients[i].name);
                    };

                    //map ingredients to recipe
                    recipe.GetRecipeId(title, function(dish) {
                        for (let i = 0; i < data.ingredients.length; i++) {
                            recipe.GetIngredientId(data.ingredients[i].name, function(ings) {

                                recipe.MapRecipe(dish[0].recipe_id, ings[0].ingredient_id, data.ingredients[i].originalString);

                            });
                        };


                        response.redirect(307, '/recipe');

                    });
                });
            });

        } else {

            //bring to login if not logged in
            response.redirect('/login');
        }
    });
});


//get login page
router.get('/login', function(request, response) {
    response.render('login');
});


//user login
router.post('/login', passport.authenticate('local-login', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }),

    function(req, res) {

        if (req.body.remember) {
          req.session.cookie.maxAge = 1000 * 60 * 3;
        } else {
          req.session.cookie.expires = false;
        }
    res.redirect('/');
});



//get signup page
router.get('/signup', function(req, res) {
    res.render('signup');
});


//user signup
router.post('/signup', passport.authenticate('local-signup', {
    // successRedirect: '/',
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
    }), function(request, response) {
        const user_id = request.body;
        request.login(user_id, function(error) {
            response.redirect('/');
        });
});


//logout function
router.get('/logout', function(request, response) {
    request.logout();
    response.redirect('/');
});


//check user authentication
function isLoggedIn(request, response, next) {

    console.log(`request.session.passport.user: ${JSON.
        stringify(request.session.passport)}`);

    if (request.isAuthenticated()) {
        return next();
    } else {
        response.redirect('/login');
    };
};


//passport serialize session
passport.serializeUser(function(user_id, done) {
    done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
    done(null, user_id);
});



// Profile Page
router.get('/my-recipes', isLoggedIn, function(request, response) {
    console.log(request.user);
    console.log(request.isAuthenticated());

    recipe.GetUserId(request.user.username, function(id) {

        recipe.MyRecipes(id[0].id, function(recipeList) {
            let names = [];

            for (let i = 0; i < recipeList.length; i++) {
                let obj = {};
                obj['dish_name'] = recipeList[i].dish_name;
                obj['photo_url'] = recipeList[i].photo_url;
                obj['recipe_id'] = recipeList[i].recipe_id;
                names.push(obj);
            };

            let savedRecipes = {
                list: names,
                user: request.user
            };

            response.render('my-recipes', savedRecipes);
        });
    });
});


// Get saved recipe info
router.post('/chosen-recipe', function(request, response) {
    recipe.RecipeInfo(request.body.id, function(recipeInfo) {
        recipe.RecipeIngredients(request.body.id, function(recipeIngredients) {

            recipeInfo[0].description = recipeInfo[0].description.split('. ');

            let info = {
                info: recipeInfo,
                ingredients: recipeIngredients,
                user: request.user
            };

            response.render('my-recipes', info);
        });
    });
});




module.exports = router;
