// gets the saved recipes from local storage
var savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
var savedRecipesTile = document.querySelector('#recipes-parent');
// loops through the saved recipes and create a container for each one
savedRecipes.forEach(function(recipe) {
// creates a container for the saved recipe
  var savedRecipeContainer = document.createElement('div');
  savedRecipeContainer.classList.add('saved-recipe-container');

// creates a heading element for the recipe name
  var recipeName = document.createElement('h2');
  recipeName.textContent = recipe.name;
  savedRecipeContainer.appendChild(recipeName);

// creates an image element for the recipe image
  var recipeImage = document.createElement('img');
  recipeImage.src = recipe.image;
  recipeImage.alt = recipe.name;
  savedRecipeContainer.appendChild(recipeImage);

// creates a paragraph element for the recipe summary
  var recipeSummary = document.createElement('p');
  recipeSummary.textContent = recipe.summary;
  savedRecipeContainer.appendChild(recipeSummary);

// adds the saved recipe to the results tile
  savedRecipesTile.appendChild(savedRecipeContainer);
});

var clearRecipes = document.querySelector(".clear-recipes");

// clears local storage and reloads page
clearRecipes.addEventListener("click", function() {
  localStorage.clear();
  location.reload();
});