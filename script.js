// Get the input field, suggestion box, and selected items list elements
var searchInput = document.getElementById('searched-input');
var suggestionBox = document.getElementById('suggested-item');
var selectedItemsList = document.getElementById('selected-items-list');
var selectedItems = []; // Array to store selected ingredients
var currentSuggestions = []; // Array to store the current suggestions

// Function to remove duplicate suggestions
function removeDuplicateSuggestions(suggestions) {
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

           

            // Add the delete button to the selected item
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

// Add input event listeners to the ingredient input field
const ingredientInput = document.getElementById("searched-input");
ingredientInput.addEventListener("input", handleIngredientInputChange);
ingredientInput.addEventListener("blur", handleIngredientInputChange);

// Add click event listener to the 'Get Recipes' button
var getRecipesButton = document.getElementById('get-recipes');
getRecipesButton.addEventListener('click', async function() {
  var selectedIngredients = selectedItems.join
  // Join selected ingredients into a comma-separated string
  var selectedIngredients = selectedItems.join();
  var spoonacularApiKey = "2e39a525784f4df6bc533d1a0e3e2403";
  var apiURLspoonacular = "https://api.spoonacular.com/recipes/complexSearch?includeIngredients=" + selectedIngredients + "&number=10&addRecipeInformation=true&apiKey=" + spoonacularApiKey;

  try {
    var response = await fetch(apiURLspoonacular);
    var recipes = await response.json();

    // Clear any previous recipe results
    var resultsContainer = document.getElementById('suggested-recipes');
    resultsContainer.innerHTML = '';

    // Create and display recipe elements for each fetched recipe
    recipes.results.forEach(function(recipe) {
      // Create a new element for the recipe
      var recipeElement = document.createElement('div');
      recipeElement.classList.add('recipe');

      // Add the recipe image to the element
      var recipeImage = document.createElement('img');
      recipeImage.src = recipe.image;
      recipeImage.alt = recipe.title;
      recipeImage.classList.add('recipe-image');
      recipeElement.appendChild(recipeImage);

      // Add the recipe title to the element
      var recipeTitle = document.createElement('h3');
      recipeTitle.textContent = recipe.title;
      recipeTitle.classList.add('recipe-title');
      recipeElement.appendChild(recipeTitle);

      // Add the recipe URL to the element
      var recipeURL = document.createElement('a');
      recipeURL.textContent = 'View Recipe';
      recipeURL.href = recipe.sourceUrl;
      recipeURL.classList.add('recipe-url');
      recipeURL.target = '_blank'; // open link in a new tab
      recipeElement.appendChild(recipeURL);

      // Add the recipe element to the results container
      resultsContainer.appendChild(recipeElement);
    });
  } catch (error) {
    console.error(error);
  }
});

// Initialize the cocktail tile and button
var cocktailTile = document.getElementById('suggested-cocktail');
const button = document.querySelector('#get-cocktails');
var recipeTile = document.querySelector('#suggested-recipes');

cocktailTile.style.display = 'none';

// Attach a click event listener to the button
button.addEventListener('click', () => {
  // Clear previous cocktail ingredients
  document.getElementById('ingredient1').textContent = "";
  document.getElementById('ingredient2').textContent = "";
  document.getElementById('ingredient3').textContent = "";
  document.getElementById('ingredient4').textContent = "";
  document.getElementById('ingredient5').textContent = "";
  document.getElementById('ingredient6').textContent = "";

  // Update the display of the cocktail tile
  recipeTile.classList.add('is-6');
  cocktailTile.style.display = '';

  // Fetch a random cocktail recipe
  fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
    .then(response => response.json())
    .then(data => {
      // Extract cocktail data
      const cocktailName = data.drinks[0].strDrink;
      const ingredients = [
        data.drinks[0].strIngredient1,
        data.drinks[0].strIngredient2,
        data.drinks[0].strIngredient3,
        data.drinks[0].strIngredient4,
        data.drinks[0].strIngredient5,
        data.drinks[0].strIngredient6
      ];
      const measures = [
        data.drinks[0].strMeasure1,
        data.drinks[0].strMeasure2,
        data.drinks[0].strMeasure3,
        data.drinks[0].strMeasure4,

        data.drinks[0].strMeasure5,
        data.drinks[0].strMeasure6
      ];
      const instructions = data.drinks[0].strInstructions;
      const image = data.drinks[0].strDrinkThumb;

      // Update the cocktail tile with the fetched data
      document.getElementById('cocktail-name').textContent = cocktailName;
      
      // Display the ingredients and their measures
      ingredients.forEach((ingredient, index) => {
        if (ingredient) {
          document.getElementById(`ingredient${index + 1}`).textContent = measures[index] + " " + ingredient;
        }
      });

      // Update the instructions and image
      document.getElementById('cocktail-instructions').textContent = instructions;
      document.getElementById('cocktail-image').src = image;
    })
    .catch(error => console.error(error));
});




    
  