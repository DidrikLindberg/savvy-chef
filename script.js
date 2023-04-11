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
            selectedItem.textContent = suggestion.name;
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

// var getRecipesButton = document.getElementById('get-recipes');
// getRecipesButton.addEventListener('click', function() {
//   // Do something with the selectedItems array
// });
var getRecipesButton = document.getElementById('get-recipes');
getRecipesButton.addEventListener('click', function() {
  // Do something with the selectedItems array
});
