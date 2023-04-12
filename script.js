var searchInput = document.getElementById('searched-input');
var suggestionBox = document.getElementById('suggested-item');
var selectedItemsList = document.getElementById('selected-items-list');
var selectedItems = [];
var resultsContainer = document.getElementById('suggested-recipes');

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

resultsContainer.style.display = 'none';

var getRecipesButton = document.getElementById('get-recipes');
getRecipesButton.addEventListener('click', async function() {
  resultsContainer.style.display = "";
  var selectedIngredients = selectedItems.join();
  var spoonacularApiKey = "2e39a525784f4df6bc533d1a0e3e2403";
  var apiURLspoonacular = "https://api.spoonacular.com/recipes/complexSearch?includeIngredients=" + selectedIngredients + "&number=5&addRecipeInformation=true&information?includeNutrition=true&apiKey=" + spoonacularApiKey;

  try {
    var response = await fetch(apiURLspoonacular);
    var recipes = await response.json();
    console.log(recipes);
    console.log(response);

    // Clear any previous recipe results
    resultsContainer.innerHTML = '';

    recipes.results.forEach(function(recipe) {
      // Skip recipes from foodista.com
      if (recipe.sourceUrl.includes('foodista.com')) {
        return;
      }

// Create a new element for the recipe
var recipeElement = document.createElement('div');
recipeElement.classList.add('recipe');

// Create a container for the recipe image and title
var recipeImgTitleContainer = document.createElement('div');
recipeImgTitleContainer.classList.add('recipe-img-title-container');

// Add the recipe title to the element as a clickable link
var recipeTitle = document.createElement('a');
recipeTitle.textContent = recipe.title;
recipeTitle.href = recipe.sourceUrl;
recipeTitle.classList.add('recipe-title');
recipeTitle.style.fontWeight = 'bold';
recipeTitle.style.fontSize = '1.2rem';
recipeTitle.target = '_blank'; // open link in a new tab
recipeImgTitleContainer.appendChild(recipeTitle);

// Add the recipe image to the element
var recipeImage = document.createElement('img');
recipeImage.src = recipe.image;
recipeImage.alt = recipe.title;
recipeImage.classList.add('recipe-image');
recipeImgTitleContainer.appendChild(recipeImage);

// Add the recipe img and title container to the recipe element
recipeElement.appendChild(recipeImgTitleContainer);

// Create a container for the recipe information
var recipeInfoContainer = document.createElement('div');
recipeInfoContainer.classList.add('recipe-info-container');

// Add the recipe summary to the information element
if (recipe.summary) {
  var recipeSummary = document.createElement('p');
  recipeSummary.classList.add('recipe-summary');
  recipeSummary.textContent = recipe.summary.replace(/<[^>]*>?/gm, '');
  recipeInfoContainer.appendChild(recipeSummary);
}

// Add the recipe information to the recipe element
recipeElement.appendChild(recipeInfoContainer);

// Add the recipe element to the results container
resultsContainer.appendChild(recipeElement);
    });
  } catch (error) {
    console.error(error);
  }
});
    

var cocktailTile = document.getElementById('suggested-cocktail');
var button = document.querySelector('#get-cocktails');
var recipeTile = document.querySelector('#suggested-recipes');

cocktailTile.style.display = 'none';

button.addEventListener('click', function () {
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
  recipeTile.classList.add('is-8');
  cocktailTile.style.display = '';
  fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      var cocktailName = data.drinks[0].strDrink;
      var ingredient1 = data.drinks[0].strIngredient1;
      var ingredient2 = data.drinks[0].strIngredient2;
      var ingredient3 = data.drinks[0].strIngredient3;
      var ingredient4 = data.drinks[0].strIngredient4;
      var ingredient5 = data.drinks[0].strIngredient5;
      var ingredient6 = data.drinks[0].strIngredient6;
      var instructions = data.drinks[0].strInstructions;
      var image = data.drinks[0].strDrinkThumb;

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
    })
    .catch(error => console.error(error));
});