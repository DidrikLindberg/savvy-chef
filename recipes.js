// Get the saved recipes from local storage
var savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
var savedRecipesTile = document.querySelector('#recipes-parent');
// Loop through the saved recipes and create a container for each one
savedRecipes.forEach(function(recipe) {
  // Create a container for the saved recipe
  var savedRecipeContainer = document.createElement('div');
  savedRecipeContainer.classList.add('saved-recipe-container');

  // Create a heading element for the recipe name
  var recipeName = document.createElement('h2');
  recipeName.textContent = recipe.name;
  savedRecipeContainer.appendChild(recipeName);

// Create an image element for the recipe image
  var recipeImage = document.createElement('img');
  recipeImage.src = recipe.image;
  recipeImage.alt = recipe.name;
  savedRecipeContainer.appendChild(recipeImage);

  // Create a paragraph element for the recipe summary
  var recipeSummary = document.createElement('p');
  recipeSummary.textContent = recipe.summary;
  savedRecipeContainer.appendChild(recipeSummary);

  // Add the saved recipe container to the results container
  savedRecipesTile.appendChild(savedRecipeContainer);
});