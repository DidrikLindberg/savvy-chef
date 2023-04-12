var searchInput = document.getElementById('searched-input');
var suggestionBox = document.getElementById('suggested-item');
var selectedItemsList = document.getElementById('selected-items-list');
var selectedItems = [];

function removeDuplicateSuggestions(suggestions) {
  var seen = new Set();
  return suggestions.filter(function(suggestion) {
    var lowerCaseName = suggestion.name.toLowerCase();
    var isDuplicate = seen.has(lowerCaseName);
    seen.add(lowerCaseName);
    return !isDuplicate;
  });
}

const inputField = document.getElementById('searched-input');
const ingredientList = document.querySelector('.current-ingredients ul');

inputField.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    const newIngredient = inputField.value.trim();
    if (newIngredient !== '') {
      const newListItem = document.createElement('li');
      newListItem.textContent = newIngredient;
      ingredientList.appendChild(newListItem);
      inputField.value = '';
    }
  }
});

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

async function searchFoodItemSuggestions(foodInput) {
  var spoonacularApiKey = "2e39a525784f4df6bc533d1a0e3e2403";
  var apiURLspoonacular = "https://api.spoonacular.com/food/ingredients/autocomplete?query=" + foodInput + "&number=10&apiKey=" + spoonacularApiKey;

  try {
    var response = await fetch(apiURLspoonacular);
    var suggestions = await response.json();
    return suggestions;
  } catch (error) {
    console.error(error);
    return [];
  }
}

searchInput.addEventListener('input', async () => {
  var searchTerm = searchInput.value.toLowerCase().trim();
  suggestionBox.innerHTML = '';

  if (searchTerm) {
    var suggestions = await searchFoodItemSuggestions(searchTerm);
    var uniqueSuggestions = removeDuplicateSuggestions(suggestions);

    suggestionBox.style.display = 'none';
    suggestionBox.innerHTML = '';

    if (uniqueSuggestions.length > 0) {
      suggestionBox.style.display = 'block';
      uniqueSuggestions.forEach(function(suggestion) {
        var suggestionItem = document.createElement('div');
        suggestionItem.textContent = suggestion.name;
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.addEventListener('click', function() {
          searchInput.value = suggestion.name;
          suggestionBox.style.display = 'none';
          if (!selectedItems.includes(suggestion.name)) {
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
  } else {
    suggestionBox.style.display = 'none';
  }
});

var getRecipesButton = document.getElementById('get-recipes');
getRecipesButton.addEventListener('click', async function() {
  var selectedIngredients = selectedItems.join();
  var spoonacularApiKey = "2e39a525784f4df6bc533d1a0e3e2403";
  var apiURLspoonacular = "https://api.spoonacular.com/recipes/complexSearch?includeIngredients=" + selectedIngredients + "&number=10&addRecipeInformation=true&apiKey=" + spoonacularApiKey;

  try {
    var response = await fetch(apiURLspoonacular);
    var recipes = await response.json();
    console.log(recipes);
    console.log(response);

    // Clear any previous recipe results
    var resultsContainer = document.getElementById('suggested-recipes');
    resultsContainer.innerHTML = '';

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

// Add the recipe


      // Add the recipe element to the results container
      resultsContainer.appendChild(recipeElement);
    });
  } catch (error) {
    console.error(error);
  }
});


var cocktailTile = document.getElementById('suggested-cocktail');
const button = document.querySelector('#get-cocktails');
var recipeTile = document.querySelector('#suggested-recipes');

cocktailTile.style.display = 'none';

// Attach a click event listener to the button
button.addEventListener('click', () => {
  document.getElementById('ingredient1').textContent = "";
  document.getElementById('ingredient2').textContent = "";
  document.getElementById('ingredient3').textContent = "";
  document.getElementById('ingredient4').textContent = "";
  document.getElementById('ingredient5').textContent = "";
  document.getElementById('ingredient6').textContent = "";
  recipeTile.classList.add('is-6');
  cocktailTile.style.display = '';
  fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const cocktailName = data.drinks[0].strDrink;
      const ingredient1 = data.drinks[0].strIngredient1;
      const ingredient2 = data.drinks[0].strIngredient2;
      const ingredient3 = data.drinks[0].strIngredient3;
      const ingredient4 = data.drinks[0].strIngredient4;
      const ingredient5 = data.drinks[0].strIngredient5;
      const ingredient6 = data.drinks[0].strIngredient6;
      const instructions = data.drinks[0].strInstructions;
      const image = data.drinks[0].strDrinkThumb;

      document.getElementById('cocktail-name').textContent = cocktailName;
      if (data.drinks[0].strIngredient1) {
      document.getElementById('ingredient1').textContent = data.drinks[0].strMeasure1 + " " + ingredient1;}
      if (data.drinks[0].strIngredient2) {
      document.getElementById('ingredient2').textContent = data.drinks[0].strMeasure2 + " " + ingredient2;}
      if (data.drinks[0].strIngredient3) {
      document.getElementById('ingredient3').textContent = data.drinks[0].strMeasure3 + " " + ingredient3;}
      if (data.drinks[0].strIngredient4) {
      document.getElementById('ingredient4').textContent = data.drinks[0].strMeasure4 + " " + ingredient4;}
      if (data.drinks[0].strIngredient5) {
      document.getElementById('ingredient5').textContent = data.drinks[0].strMeasure5 + " " + ingredient5;}
      if (data.drinks[0].strIngredient6) {
      document.getElementById('ingredient6').textContent = data.drinks[0].strMeasure6 + " " + ingredient6;}

      document.getElementById('cocktail-instructions').textContent = instructions;
      document.getElementById('cocktail-image').src = image;
    })
    .catch(error => console.error(error));
});
