var searchInput = document.getElementById('searched-input');
var suggestionBox = document.getElementById('suggested-item');

// Function for search box auto suggest and search entry
async function searchFoodItemSuggestions(foodInput) {
  // Setting Spoonacular API key and URL
  var spoonacularApiKey = "2e39a525784f4df6bc533d1a0e3e2403";
  var apiURLspoonacular = "https://api.spoonacular.com/food/ingredients/autocomplete?query=" + foodInput + "&number=10&apiKey=" + spoonacularApiKey;

  // Fetching data from API
  try {
    const response = await fetch(apiURLspoonacular);
    const suggestions = await response.json();
    return suggestions;
  } catch (error) {
    console.error(error);
    return [];
  }
}

searchInput.addEventListener('input', async () => {
  const searchTerm = searchInput.value.toLowerCase().trim();
  suggestionBox.innerHTML = '';

  if (searchTerm) {
    const suggestions = await searchFoodItemSuggestions(searchTerm);

    if (suggestions.length > 0) {
      suggestionBox.style.display = 'block';
      suggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('div');
        suggestionItem.textContent = suggestion.name;
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.addEventListener('click', () => {
          searchInput.value = suggestion.name;
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




