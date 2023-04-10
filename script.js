var searchInput = document.getElementById('searched-input');
var suggestionBox = document.getElementById('suggested-item');

// Function for search box auto suggest and search entry
async function searchFoodItemSuggestions(foodInput) {
  // Setting Spoonacular API key and URL
  var spoonacularApiKey = "2e39a525784f4df6bc533d1a0e3e2403";
  var apiURLspoonacular = "https://api.spoonacular.com/food/ingredients/autocomplete?query=" + foodInput + "&number=10&apiKey=" + spoonacularApiKey;

  // Fetching data from API
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

    
    var uniqueSuggestionNames = new Set();

    
    suggestions.forEach(function(suggestion) {
      uniqueSuggestionNames.add(suggestion.name);
    });

    
    var uniqueSuggestions = Array.from(uniqueSuggestionNames);

    if (uniqueSuggestions.length > 0) {
      suggestionBox.style.display = 'block';
      uniqueSuggestions.forEach(function(suggestionName) {
        var suggestionItem = document.createElement('div');
        suggestionItem.textContent = suggestionName;
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.addEventListener('click', function() {
          searchInput.value = suggestionName;
          suggestionBox.style.display = 'none';
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



