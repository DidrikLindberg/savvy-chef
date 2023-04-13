




var searchInput = document.getElementById('searched-input');
var suggestionBox = document.getElementById('suggested-item');
var selectedItemsList = document.getElementById('selected-items-list');

var selectedItems = []; // Array to store selected ingredients
var currentSuggestions = []; // Array to store the current suggestions
var resultsContainer = document.getElementById('suggested-recipes');


// Function to remove duplicate suggestions
function removeDuplicateSuggestions(suggestions) {
  if (!Array.isArray(suggestions)) {
    return suggestions;
  }
  var seen = new Set();
  return suggestions.filter(function(suggestion) {
    var lowerCaseName = suggestion.name.toLowerCase();
    var isDuplicate = seen.has(lowerCaseName);
    seen.add(lowerCaseName);
    return !isDuplicate;
  });
}


// Function to check if an ingredient is already in the list
function isIngredientInList(ingredient, list) {
  const listItems = list.getElementsByTagName('li');
  for (let i = 0; i < listItems.length; i++) {
    if (listItems[i].textContent.trim().toLowerCase() === ingredient.toLowerCase()) {
      return true;
    }
  }
  return false;
}

// Get the input field and ingredient list elements
const inputField = document.getElementById('searched-input');
const ingredientList = document.querySelector('.current-ingredients ul');

// Add an event listener to the input field for handling the 'Enter' key
inputField.addEventListener('keydown', async function(event) {
  if (event.key === 'Enter') {
    const newIngredient = inputField.value.trim();

    // Check if the ingredient is in Spoonacular's database
    const suggestions = await searchFoodItemSuggestions(newIngredient);
    const isInDatabase = suggestions.some(suggestion => suggestion.name.toLowerCase() === newIngredient.toLowerCase());

    // Check if the ingredient is not a duplicate
    const isDuplicate = selectedItems.includes(newIngredient);

    // Add the ingredient to the list if it's not empty, not a duplicate, and in the database
    if (newIngredient !== '' && !isIngredientInList(newIngredient, ingredientList) && isInDatabase && !isDuplicate) {
      // Create a new list item with the delete button
      const newListItem = document.createElement('li');
      newListItem.textContent = newIngredient;
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'x';
      deleteButton.classList.add('delete-button');
      deleteButton.addEventListener('click', function() {
        newListItem.remove();
        const index = selectedItems.indexOf(newIngredient);
        if (index !== -1) {
          selectedItems.splice(index, 1);}
      });
    
      newListItem.appendChild(deleteButton);
      ingredientList.appendChild(newListItem);
      inputField.value = '';
      selectedItems.push(newIngredient);

    }
  }
});



// Add click event listeners to checkboxes for filtering recipes
const filterCheckboxes = document.querySelectorAll('input[type="checkbox"]');
filterCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('click', event => {
    const filterText = event.target.parentNode.querySelector('span').textContent;
    const filterItem = document.createElement('li');
    filterItem.textContent = filterText;
    const selectedFiltersList = document.getElementById('selected-filters-list');

    if (event.target.checked) {
      if (!selectedFiltersList.querySelector(`li[data-filter="${filterText}"]`)) {
        filterItem.setAttribute('data-filter', filterText);
        selectedFiltersList.appendChild(filterItem);
      }
    } else {
      const existingFilterItem = selectedFiltersList.querySelector(`li[data-filter="${filterText}"]`);
      if (existingFilterItem) {
        selectedFiltersList.removeChild(existingFilterItem);
      }
    }
  });
});


// Function to check if an ingredient is valid (exists in the current suggestions)
function isIngredientValid(ingredient) {
  return currentSuggestions.includes(ingredient.toLowerCase());
}

// Function to fetch food item suggestions from Spoonacular API


const searchedIngredients = {};
async function searchFoodItemSuggestions(foodInput) {
  var spoonacularApiKey = "2e39a525784f4df6bc533d1a0e3e2403";
  if (foodInput in searchedIngredients) {
    return searchedIngredients[foodInput];
  }
  var apiURLspoonacular = "https://api.spoonacular.com/food/ingredients/autocomplete?query=" + foodInput + "&number=10&apiKey=" + spoonacularApiKey;

  try {
    var response = await fetch(apiURLspoonacular);
    var suggestions = await response.json();
     // Add the suggestions to the object/map
     searchedIngredients[foodInput] = suggestions;
    return suggestions;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Add an event listener to handle changes in the search input
searchInput.addEventListener('input', async (event) => {
  var searchTerm = searchInput.value.toLowerCase().trim();
  suggestionBox.innerHTML = '';

  if (searchTerm) {
    var suggestions = await searchFoodItemSuggestions(searchTerm);
    var uniqueSuggestions = removeDuplicateSuggestions(suggestions);
    currentSuggestions = uniqueSuggestions.map(suggestion => suggestion.name.toLowerCase());
  
    // Update the suggestion box based on the fetched suggestions
    suggestionBox.style.display = 'none';
    suggestionBox.innerHTML = '';
    if (uniqueSuggestions.length > 0) {
      suggestionBox.style.display = 'block';
      uniqueSuggestions.forEach(function(suggestion) {
        var suggestionItem = document.createElement('div');
        suggestionItem.textContent = suggestion.name;
        suggestionItem.classList.add('suggestion-item');

        // Handle click events for suggestion items
        suggestionItem.addEventListener('click', function() {
          searchInput.value = suggestion.name;
          suggestionBox.style.display = 'none';
          if (!selectedItems.includes(suggestion.name) && !isIngredientInList(suggestion.name, ingredientList)) {
            selectedItems.push(suggestion.name);
            var selectedItem = document.createElement('div');
            selectedItem.classList.add('selected-item');
            selectedItem.textContent = suggestion.name;

            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'x';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', function() {
              var index = selectedItems.indexOf(suggestion.name);
              if (index > -1) {
                selectedItems.splice(index, 1);
              }
              selectedItem.remove();
            });


            selectedItem.appendChild(deleteButton);
            selectedItemsList.appendChild(selectedItem);
          }
        });

        suggestionBox.appendChild(suggestionItem);
      });
    } else {
      suggestionBox.style.display = 'none';
    }
  }
  handleIngredientInputChange(event);
});



// Function to handle changes in the ingredient input field
function handleIngredientInputChange(event) {
  const inputValue = event.target.value;
  if (inputValue.length >= 2) {
    searchFoodItemSuggestions(inputValue);
  }

  // Clear the input field when an ingredient is selected
  if (selectedItems.includes(inputValue)) {
    event.target.value = '';
  }
}

window.onload = function() {
  // Add input event listeners to the ingredient input field
  const ingredientInput = document.getElementById("searched-input");
  ingredientInput.addEventListener("input", handleIngredientInputChange);
  ingredientInput.addEventListener("blur", handleIngredientInputChange);

  var resultsContainer = document.getElementById('suggested-recipes');
  resultsContainer.style.display = 'none';


const sortBySelect = document.getElementById('sort-by');
let sortOrder = sortBySelect.value;
sortBySelect.addEventListener('change', event => {
  sortOrder = event.target.value;
});

  // Add click event listener to the 'Get Recipes' button
  var getRecipesButton = document.getElementById('get-recipes');
  getRecipesButton.addEventListener('click', async function() {
    resultsContainer.style.display = "";
    cocktailButton.classList.add('is-4');
    var selectedIngredients = selectedItems.join();
    var spoonacularApiKey = "2e39a525784f4df6bc533d1a0e3e2403";
    var intolerancesParam = intolerances.length > 0 ? '&intolerances=' + intolerances.join(',') : '';


   var dietsParam  = selectedDiet ? '&diet=' + selectedDiet : '';



    var maxReadyTimeParam = selectedMaxReadyTimes.length > 0 ? '&maxReadyTime=' + Math.min(...selectedMaxReadyTimes) : '';

    
    var cuisineParam = selectedCuisine ? '&cuisine=' + selectedCuisine : '';


    

    var apiURLspoonacular = "https://api.spoonacular.com/recipes/complexSearch?includeIngredients=" + selectedIngredients + "&number=10&addRecipeInformation=true" + intolerancesParam + maxReadyTimeParam + dietsParam + cuisineParam + "&apiKey=" + spoonacularApiKey;



    try {
      var response = await fetch(apiURLspoonacular);
      var recipes = await response.json();
      console.log(recipes);
      console.log(response);

      // Clear any previous recipe results
      resultsContainer.innerHTML = '';
if (sortOrder === "price") {
    recipes.results.sort((a, b) => a.pricePerServing - b.pricePerServing);
  } else if (sortOrder === "-price") {
    recipes.results.sort((a, b) => b.pricePerServing - a.pricePerServing);
  }
      // Create and display recipe elements for each fetched recipe
      recipes.results.forEach(function(recipe) {
        // Skip recipes from foodista.com

        // if (recipe.sourceUrl.includes('foodista.com')) {
        //   return;
        // }


        // Create a new element for the recipe
        var recipeElement = document.createElement('div');
        recipeElement.classList.add('recipe');

        // Create a container for the recipe image, title, and save button
        var recipeImgTitleSaveContainer = document.createElement('div');
        recipeImgTitleSaveContainer.classList.add('recipe-img-title-save-container');

        // Add the recipe title to the element as a clickable link
        var recipeTitle = document.createElement('a');
        recipeTitle.textContent = recipe.title;
        recipeTitle.href = recipe.sourceUrl;
        recipeTitle.classList.add('recipe-title');
        recipeTitle.style.fontWeight = 'bold';
        recipeTitle.style.fontSize = '1.2rem';
        recipeTitle.target = '_blank'; // open link in a new tab
        recipeImgTitleSaveContainer.appendChild(recipeTitle);

        

        // Add the recipe image to the element
        var recipeImage = document.createElement('img');
        recipeImage.src = recipe.image;
        recipeImage.alt = recipe.title;
        recipeImage.classList.add('recipe-image');
        recipeImgTitleSaveContainer.appendChild(recipeImage);

        // Add the save button to the element
        var saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.classList.add('save-button');
        recipeImgTitleSaveContainer.appendChild(saveButton);

        saveButton.addEventListener('click', function() {
          // Get the recipe name, image, and summary
          var recipeName = recipe.title;
          var recipeImage = recipe.image;
          // replaces any html tags with an empty string
          var recipeSummary = recipe.summary.replace(/<[^>]*>?/gm, '');
        
          // Create an object to represent the saved recipe
          var savedRecipe = {
            name: recipeName,
            image: recipeImage,
            summary: recipeSummary
          };
        
          // Get the existing saved recipes from local storage
          var savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
        
          // Add the new recipe to the array of saved recipes
          savedRecipes.push(savedRecipe);
        
          // Save the updated list of saved recipes to local storage
          localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
        });
        // Add the recipe image, title, and save button container to the recipe element
        recipeElement.appendChild(recipeImgTitleSaveContainer);

        


        // Create a container for the recipe information
        var recipeInfoContainer = document.createElement('div');
        recipeInfoContainer.classList.add('recipe-info-container');

        // Add the recipe summary to the information element
        if (recipe.summary) {
          var recipeSummary = document.createElement('p');
          recipeSummary.classList.add('recipe-summary');
          // replaces any html tags with an empty string
          recipeSummary.textContent = recipe.summary.replace(/<[^>]*>?/gm, '');
          recipeInfoContainer.appendChild(recipeSummary);
        }

        // Add the recipe information to the recipe element
        recipeElement.appendChild(recipeInfoContainer);

        // Add the recipe element to the results container
        resultsContainer.appendChild(recipeElement);
      });

      // Scroll to the bottom of the results container to show the new recipes
resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });


    } catch (error) {
      console.error(error);
    }
  });
};

const dietsCheckboxes = document.querySelectorAll('#diets-dropdown input[type="checkbox"]');
let diets = [];
dietsCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('click', event => {
    const dietsText = event.target.parentNode.querySelector('span').textContent.replace('No', '').toLowerCase();
  });
});

const dietsRadioButtons = document.querySelectorAll('.diets-radio');

let selectedDiet = '';
dietsRadioButtons.forEach(radioButton => {
  radioButton.addEventListener('click', event => {
    const dietsText = event.target.parentNode.querySelector('span').textContent.replace('No', '').toLowerCase();
     // If the clicked radio button is already selected, deselect it
     if (selectedDiet === dietsText) {
      event.target.checked = false;
      selectedDiet = '';
    } else {
      // Otherwise, set the selected diet to the clicked radio button's value
      selectedDiet = dietsText;
    }
  });
});




const intoleranceCheckboxes = document.querySelectorAll('#intolerance-dropdown input[type="checkbox"]');

let intolerances = [];
intoleranceCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('click', event => {
    const intoleranceText = event.target.parentNode.querySelector('span').textContent.replace('No ', '').toLowerCase();
    if (event.target.checked) {
      intolerances.push(intoleranceText);
    } else {
      const index = intolerances.indexOf(intoleranceText);
      if (index !== -1) {
        intolerances.splice(index, 1);
      }
    }
  });
});

const maxReadyTimeCheckboxes = document.querySelectorAll('#max-ready-time-dropdown');



let selectedMaxReadyTimes = [];



maxReadyTimeCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('click', event => {
    const maxReadyTimeText = event.target.parentNode.querySelector('span').textContent;
    const maxReadyTimeValue = parseInt(maxReadyTimeText.match(/\d+/)[0]);



    if (event.target.checked) {
      // Add the maxReadyTimeValue to the selectedMaxReadyTimes array if it's not already there
      if (!selectedMaxReadyTimes.includes(maxReadyTimeValue)) {
        selectedMaxReadyTimes.push(maxReadyTimeValue);
      }
    } else {
      // Remove the maxReadyTimeValue from the selectedMaxReadyTimes array
      selectedMaxReadyTimes = selectedMaxReadyTimes.filter(value => value !== maxReadyTimeValue);
    }

  });
});




const cuisinesRadioButtons = document.querySelectorAll('.cuisines-radio');
let selectedCuisine = '';
cuisinesRadioButtons.forEach(radioButton => {
  radioButton.addEventListener('click', event => {
    const cuisineText = event.target.parentNode.querySelector('span').textContent.replace('No', '').toLowerCase();
  // If the clicked radio button is already selected, deselect it
  if (selectedCuisine  === cuisineText) {
    event.target.checked = false;
    selectedCuisine  = '';
  } else {
    // Otherwise, set the selected diet to the clicked radio button's value
    selectedCuisine = cuisineText;
  }



   


  });
});








// declaring variables for cocktail function
var cocktailTile = document.getElementById('suggested-cocktail');
var cocktailButton = document.querySelector('#get-cocktails');
var recipeTile = document.querySelector('#suggested-recipes');

// defaults to hiding the cocktail tile
cocktailTile.style.display = 'none';

 

cocktailButton.addEventListener('click', function () {
// once the button is clicked, all content is emptied to be repopulated
  document.getElementById('ingredient1').textContent = "";
  document.getElementById('ingredient2').textContent = "";
  document.getElementById('ingredient3').textContent = "";
  document.getElementById('ingredient4').textContent = "";
  document.getElementById('ingredient5').textContent = "";
  document.getElementById('ingredient6').textContent = "";

  document.getElementById('ingredient1-amount').textContent = "";
  document.getElementById('ingredient2-amount').textContent = "";
  document.getElementById('ingredient3-amount').textContent = "";
  document.getElementById('ingredient4-amount').textContent = "";
  document.getElementById('ingredient5-amount').textContent = "";
  document.getElementById('ingredient6-amount').textContent = "";
  // resizes the recipes tile to make room for cocktail tile that appears
  recipeTile.classList.add('is-8');
  cocktailTile.style.display = '';
  // api request for a random cocktail
  fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // declaring variables for drink information
      var cocktailName = data.drinks[0].strDrink;
      var ingredient1 = data.drinks[0].strIngredient1;
      var ingredient2 = data.drinks[0].strIngredient2;
      var ingredient3 = data.drinks[0].strIngredient3;
      var ingredient4 = data.drinks[0].strIngredient4;
      var ingredient5 = data.drinks[0].strIngredient5;
      var ingredient6 = data.drinks[0].strIngredient6;
      var instructions = data.drinks[0].strInstructions;
      var image = data.drinks[0].strDrinkThumb;
      
      // checks if content exists before populating in html
      document.getElementById('cocktail-name').textContent = cocktailName;
      if (data.drinks[0].strIngredient1) {
        document.getElementById('ingredient1').textContent = ingredient1;}
      if (data.drinks[0].strMeasure1) {
        document.getElementById('ingredient1-amount').textContent = data.drinks[0].strMeasure1;}
      if (data.drinks[0].strIngredient2) {
        document.getElementById('ingredient2').textContent = ingredient2;}
      if (data.drinks[0].strMeasure2) {
        document.getElementById('ingredient2-amount').textContent = data.drinks[0].strMeasure2;}
      if (data.drinks[0].strIngredient3) {
        document.getElementById('ingredient3').textContent = ingredient3;}
      if (data.drinks[0].strMeasure3) {
        document.getElementById('ingredient3-amount').textContent = data.drinks[0].strMeasure3;}
      if (data.drinks[0].strIngredient4) {
        document.getElementById('ingredient4').textContent = ingredient4;}
      if (data.drinks[0].strMeasure4) {
        document.getElementById('ingredient4-amount').textContent = data.drinks[0].strMeasure4;}
      if (data.drinks[0].strIngredient5) {
        document.getElementById('ingredient5').textContent = ingredient5;}
      if (data.drinks[0].strMeasure5) {
        document.getElementById('ingredient5-amount').textContent = data.drinks[0].strMeasure5;}
      if (data.drinks[0].strIngredient6) {
        document.getElementById('ingredient6').textContent = ingredient6;}
      if (data.drinks[0].strMeasure6) {
        document.getElementById('ingredient6-amount').textContent = data.drinks[0].strMeasure6;}


      document.getElementById('cocktail-instructions').textContent = instructions;
      document.getElementById('cocktail-image').src = image;
      cocktailTile.scrollIntoView({ behavior: 'smooth', block: 'start' });
    })
    
    .catch(error => console.error(error));

  });

var savedRecipes = document.querySelector(".saved-recipes");
// saved recipes button changes page to recipes.html
savedRecipes.addEventListener("click", function() {
  window.location = "./recipes.html";
});