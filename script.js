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

<<<<<<< HEAD
// var getRecipesButton = document.getElementById('get-recipes');
// getRecipesButton.addEventListener('click', function() {
//   // Do something with the selectedItems array
// });
=======
var getRecipesButton = document.getElementById('get-recipes');
getRecipesButton.addEventListener('click', function() {
  // Do something with the selectedItems array
});
>>>>>>> 54d64cec690e76a775ed406b57694e9338f13233



let accessToken = '';
let expirationTime = 0;

async function getAccessToken() {
  var clientId = 'recipepicker-10c9986c48c671640284d40976cd7e994572323350031644696';
  var clientSecret = '7MqLtODQzHmZ6Qq_CGS5zE2JeSyGO84mXGRoKvoP';
  var base64Credentials = btoa(`${clientId}:${clientSecret}`);

  var response = await fetch('https://api.kroger.com/v1/connect/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${base64Credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials&scope=product.compact'
  });

  var data = await response.json();
  accessToken = data.access_token;
  expirationTime = Date.now() + (data.expires_in * 1000) - 60000;
}

async function ensureAccessToken() {
  if (Date.now() >= expirationTime) {
    await getAccessToken();
  }
}

async function getProductData(searchTerm) {
  await ensureAccessToken();

  var response = await fetch(`https://api.kroger.com/v1/products?filter.term=${searchTerm}&filter.limit=10`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });

  var data = await response.json();
  console.log(data);
}

document.getElementById('search-button').addEventListener('click', () => {
  const userInput = document.getElementById('user-input').value;
  getProductData(userInput);
});

