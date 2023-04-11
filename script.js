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


const filterCheckboxes = document.querySelectorAll('.dropdown-menu input[type="checkbox"]');

filterCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    const filterLabel = checkbox.parentElement.querySelector('span').textContent;

    if (checkbox.checked) {
      const currentFiltersList = document.querySelector('.current-filters ul');
      const filterItem = document.createElement('li');
      filterItem.textContent = filterLabel;
      currentFiltersList.appendChild(filterItem);
    } else {
      const currentFiltersList = document.querySelector('.current-filters ul');
      const filterItems = currentFiltersList.querySelectorAll('li');
      filterItems.forEach(item => {
        if (item.textContent === filterLabel) {
          item.remove();
        }
      });
    }
  });
});



// var searchInput = document.getElementById('searched-input');
// var suggestionBox = document.getElementById('suggested-item');
// var selectedItemsList = document.getElementById('selected-items-list');
// var selectedItems = [];

// function removeDuplicateSuggestions(suggestions) {
//   var seen = new Set();
//   return suggestions.filter(function(suggestion) {
//     var lowerCaseName = suggestion.name.toLowerCase();
//     var isDuplicate = seen.has(lowerCaseName);
//     seen.add(lowerCaseName);
//     return !isDuplicate;
//   });
// }

// async function searchFoodItemSuggestions(foodInput) {
//   var spoonacularApiKey = "2e39a525784f4df6bc533d1a0e3e2403";
//   var apiURLspoonacular = "https://api.spoonacular.com/food/ingredients/autocomplete?query=" + foodInput + "&number=10&apiKey=" + spoonacularApiKey;

//   try {
//     var response = await fetch(apiURLspoonacular);
//     var suggestions = await response.json();
//     return suggestions;
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// }

// searchInput.addEventListener('input', async () => {
//   var searchTerm = searchInput.value.toLowerCase().trim();
//   suggestionBox.innerHTML = '';

//   if (searchTerm) {
//     var suggestions = await searchFoodItemSuggestions(searchTerm);
//     var uniqueSuggestions = removeDuplicateSuggestions(suggestions);

//     suggestionBox.style.display = 'none';
//     suggestionBox.innerHTML = '';

//     if (uniqueSuggestions.length > 0) {
//       suggestionBox.style.display = 'block';
//       uniqueSuggestions.forEach(function(suggestion) {
//         var suggestionItem = document.createElement('div');
//         suggestionItem.textContent = suggestion.name;
//         suggestionItem.classList.add('suggestion-item');
//         suggestionItem.addEventListener('click', function() {
//           searchInput.value = suggestion.name;
//           suggestionBox.style.display = 'none';
//           if (!selectedItems.includes(suggestion.name)) {
//             selectedItems.push(suggestion.name);
//             var selectedItem = document.createElement('div');
//             selectedItem.textContent = suggestion.name;
//             selectedItemsList.appendChild(selectedItem);
//           }
//         });
//         suggestionBox.appendChild(suggestionItem);
//       });
//     } else {
//       suggestionBox.style.display = 'none';
//     }
//   } else {
//     suggestionBox.style.display = 'none';
//   }
// });
  



// yelp api
// const apiKey = "sqTClu2QmI83wxtLBLe49xomsyJqkQHJnlb55lGNNajRfMoKMIHN6Nut0buqkf3wOAK54sVNKROwyDe8seq0_tKSo2SN_-8r0reYem3IMRj3zMkOm9vdE3Di1bk1ZHYx";
// const url = `https://api.yelp.com/v3/businesses/search?term=mexican&location=San+Francisco`;
// const headers = {
//   Authorization: `Bearer ${apiKey}`,
//   "Content-Type": "application/json"
// };

// async function fetchWithCORS(url, options) {
//   const proxyURL = 'https://api.allorigins.win/raw?url=';
//   const response = await fetch(proxyURL + encodeURIComponent(url), options);
//   return response;
// }

// // Updated fetch call
// fetchWithCORS(url, { headers })
//   .then(response => response.json())
//   .then(data => {
//     // Handle the API response
//   })
//   .catch(error => {
//     console.error(error);
//   });






// // Get the input element for searching food items
// var searchInput = document.getElementById('searched-input');
// // Get the element that will display the suggested items
// var suggestionBox = document.getElementById('suggested-item');
// // Get the element that will display the selected food items
// var selectedItemsList = document.getElementById('selected-items-list');
// // Initialize an array to store the selected food items
// var selectedItems = [];

// // This function removes duplicate suggestions based on their names
// function removeDuplicateSuggestions(suggestions) {
// var seen = new Set(); // Create a set to store unique food item names
// return suggestions.filter(function(suggestion) {
// var lowerCaseName = suggestion.name.toLowerCase(); // Convert the food item name to lower case
// var isDuplicate = seen.has(lowerCaseName); // Check if the set already has this food item
// seen.add(lowerCaseName); // Add the food item to the set
// return !isDuplicate; // Return true if the food item is not a duplicate, false otherwise
// });
// }

// // This function fetches food item suggestions from the Spoonacular API
// async function searchFoodItemSuggestions(foodInput) {
// // Define the Spoonacular API key and endpoint
// var spoonacularApiKey = "2e39a525784f4df6bc533d1a0e3e2403";
// var apiURLspoonacular = "https://api.spoonacular.com/food/ingredients/autocomplete?query=" + foodInput + "&number=10&apiKey=" + spoonacularApiKey;

// try {
// var response = await fetch(apiURLspoonacular); // Fetch data from the Spoonacular API
// var suggestions = await response.json(); // Parse the JSON data
// return suggestions; // Return the list of food item suggestions
// } catch (error) {
// console.error(error); // Log any errors to the console
// return [];
// }
// }

// // Add an event listener for when the user types in the search input
// searchInput.addEventListener('input', async () => {
// var searchTerm = searchInput.value.toLowerCase().trim(); // Get the search term and convert it to lower case
// suggestionBox.innerHTML = ''; // Clear any existing suggestions

// if (searchTerm) {
// var suggestions = await searchFoodItemSuggestions(searchTerm); // Fetch suggestions for the current search term
// var uniqueSuggestions = removeDuplicateSuggestions(suggestions); // Remove any duplicate suggestions

//     // Hide the suggestion box and clear its contents
// suggestionBox.style.display = 'none';
// suggestionBox.innerHTML = '';

// // If there are any unique suggestions, show the suggestion box and populate it with the suggestions
// if (uniqueSuggestions.length > 0) {
//   suggestionBox.style.display = 'block';
//   uniqueSuggestions.forEach(function(suggestion) {
//     var suggestionItem = document.createElement('div'); // Create a new div element for each suggestion
//     suggestionItem.textContent = suggestion.name; // Set the text content of the div to the suggestion's name
//     suggestionItem.classList.add('suggestion-item'); // Add a CSS class to the suggestion item

//     // Add a click event listener for when the user clicks on a suggestion
//     suggestionItem.addEventListener('click', function() {
//       searchInput.value = suggestion.name; // Update the search input value to the clicked suggestion's name
//       suggestionBox.style.display = 'none'; // Hide the suggestion box
//       if (!selectedItems.includes(suggestion.name)) { // If the selected items list doesn't already include the suggestion
//         selectedItems.push(suggestion.name); // Add the suggestion to the selected items list
//         var selectedItem = document.createElement('div'); // Create a new div element for the selected item
//         selectedItem.textContent = suggestion.name; //// Set the text content of the div to the selected item's name



//         selectedItem.textContent = suggestion.name;
//         // Add the selected item div to the selected items list element
//         selectedItemsList.appendChild(selectedItem);
//         }
//         });
//         // Add the suggestion item div to the suggestion box element
//         suggestionBox.appendChild(suggestionItem);
//         });
//         } else {
//         // If there are no unique suggestions, hide the suggestion box
//         suggestionBox.style.display = 'none';
//         }
//         } else {
//         // If there is no search term, hide the suggestion box
//         suggestionBox.style.display = 'none';
//         }
//         });
        
//         // Initialize the access token and its expiration time
//         let accessToken = '';
//         let expirationTime = 0;
        
//         // This function fetches an access token from the Kroger API
//         async function getAccessToken() {
//         // Define the Kroger API credentials
//         var clientId = 'recipepicker-10c9986c48c671640284d40976cd7e994572323350031644696';
//         var clientSecret = '7MqLtODQzHmZ6Qq_CGS5zE2JeSyGO84mXGRoKvoP';
//         // Encode the credentials in base64 format
//         var base64Credentials = btoa(${clientId}:${clientSecret});
        
//         // Fetch an access token from the Kroger API
//         var response = await fetch('https://api.kroger.com/v1/connect/oauth2/token', {
//         method: 'POST',
//         headers: {
//         'Authorization': Basic ${base64Credentials},
//         'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         body: 'grant_type=client_credentials&scope=product.compact'
//         });
        
//         // Parse the JSON data and store the access token and its expiration time
//         var data = await response.json();
//         accessToken = data.access_token;
//         expirationTime = Date.now() + (data.expires_in * 1000) - 60000;
//         }
        
//         // This function ensures that the access token is still valid
//         async function ensureAccessToken() {
//         if (Date.now() >= expirationTime) {
//         await getAccessToken();
//         }
//         }




// // This function fetches product data from the Kroger API using the search term
// async function getProductData(searchTerm) {
// await ensureAccessToken(); // Ensure that the access token is still valid

// // Fetch product data from the Kroger API
// var response = await fetch(https://api.kroger.com/v1/products?filter.term=${searchTerm}&filter.limit=10, {
// method: 'GET',
// headers: {
// 'Authorization': Bearer ${accessToken},
// 'Accept': 'application/json'
// }
// });

// // Parse the JSON data and log it to the console
// var data = await response.json();
// console.log(data);
// }

// // Add a click event listener for the search button
// document.getElementById('search-button').addEventListener('click', () => {
// // Get the user's input value
// const userInput = document.getElementById('user-input').value;
// // Fetch product data using the user's input
// getProductData(userInput);
// });






