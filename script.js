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
      // Add the filter item to the selected filters list if the checkbox is checked
      if (!selectedFiltersList.querySelector(`li[data-filter="${filterText}"]`)) {
        filterItem.setAttribute('data-filter', filterText);
        selectedFiltersList.appendChild(filterItem);
      }
    } else {
      // Remove the filter item from the selected filters list if the checkbox is unchecked
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

// var getRecipesButton = document.getElementById('get-recipes');
// getRecipesButton.addEventListener('click', function() {
//   // Do something with the selectedItems array
// });
var getRecipesButton = document.getElementById('get-recipes');
getRecipesButton.addEventListener('click', function() {
  // Do something with the selectedItems array
});
