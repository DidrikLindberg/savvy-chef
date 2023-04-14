var searchInput = document.getElementById("searched-input");
var suggestionBox = document.getElementById("suggested-item");
var selectedItemsList = document.getElementById("selected-items-list");
var resultsContainer = document.getElementById("suggested-recipes");
var selectedItems = []; // array to store selected ingredients
var currentSuggestions = []; // array to store the current suggestions

// function to remove duplicate suggestions
function removeDuplicateSuggestions(suggestions) {
  if (!Array.isArray(suggestions)) {
    return suggestions;
  }
  // Create a new Set object to store unique suggestion names
  var seen = new Set();

  return suggestions.filter(function (suggestion) {
    var lowerCaseName = suggestion.name.toLowerCase();

    var isDuplicate = seen.has(lowerCaseName);

    seen.add(lowerCaseName);

    return !isDuplicate;
  });
}

// Function to check if an ingredient is already in the list
function isIngredientInList(ingredient, list) {
  var listItems = list.getElementsByTagName("li");

  for (let i = 0; i < listItems.length; i++) {
    if (
      listItems[i].textContent.trim().toLowerCase() === ingredient.toLowerCase()
    ) {
      return true;
    }
  }

  return false;
}

var inputField = document.getElementById("searched-input");
var ingredientList = document.querySelector(".current-ingredients ul");

// Add an event listener to the input field for handling the 'Enter' key
inputField.addEventListener("keydown", async function (event) {
  if (event.key === "Enter") {
    var newIngredient = inputField.value.trim();

    var suggestions = await searchFoodItemSuggestions(newIngredient);

    var isInDatabase = suggestions.some(
      (suggestion) =>
        suggestion.name.toLowerCase() === newIngredient.toLowerCase()
    );

    var isDuplicate = selectedItems.includes(newIngredient);

    if (
      newIngredient !== "" &&
      !isIngredientInList(newIngredient, ingredientList) &&
      isInDatabase &&
      !isDuplicate
    ) {
      // Create a new list item with the delete button
      var newListItem = document.createElement("li");

      newListItem.textContent = newIngredient;
      var deleteButton = document.createElement("button");
      deleteButton.textContent = "x";
      deleteButton.classList.add("delete-button");
      deleteButton.addEventListener("click", function () {
        newListItem.remove();

        var index = selectedItems.indexOf(newIngredient);

        if (index !== -1) {
          selectedItems.splice(index, 1);
        }
      });

      newListItem.appendChild(deleteButton);
      ingredientList.appendChild(newListItem);

      inputField.value = "";

      selectedItems.push(newIngredient);
    }
  }
});

var filterCheckboxes = document.querySelectorAll('input[type="checkbox"]');

// Iterate through each checkbox element
filterCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("click", (event) => {
    var filterText = event.target.parentNode.querySelector("span").textContent;

    var filterItem = document.createElement("li");

    filterItem.textContent = filterText;

    var selectedFiltersList = document.getElementById("selected-filters-list");

    // Check if the checkbox is checked
    if (event.target.checked) {
      if (
        !selectedFiltersList.querySelector(`li[data-filter="${filterText}"]`)
      ) {
        filterItem.setAttribute("data-filter", filterText);

        selectedFiltersList.appendChild(filterItem);
      }
    } else {
      // If the checkbox is not checked, find the existingFilterItem with the data-filter attribute set to filterText
      var existingFilterItem = selectedFiltersList.querySelector(
        `li[data-filter="${filterText}"]`
      );

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

var searchedIngredients = {};

async function searchFoodItemSuggestions(foodInput) {
  var spoonacularApiKey = "2e39a525784f4df6bc533d1a0e3e2403";

  if (foodInput in searchedIngredients) {
    return searchedIngredients[foodInput];
  }

  // Constructed the Spoonacular API URL by concatenating the base URL, foodInput, number of suggestions, and the API key
  var apiURLspoonacular =
    "https://api.spoonacular.com/food/ingredients/autocomplete?query=" +
    foodInput +
    "&number=10&apiKey=" +
    spoonacularApiKey;

  // Use a try-catch block to handle errors during the fetch operation
  try {
    var response = await fetch(apiURLspoonacular);

    var suggestions = await response.json();

    searchedIngredients[foodInput] = suggestions;

    return suggestions;
  } catch (error) {
    console.error(error);

    return [];
  }
}

// Added an event listener to handle changes in the search input
searchInput.addEventListener("input", async (event) => {
  var searchTerm = searchInput.value.toLowerCase().trim();

  suggestionBox.innerHTML = "";

  // Check if the search term is not empty
  if (searchTerm) {
    var suggestions = await searchFoodItemSuggestions(searchTerm);

    var uniqueSuggestions = removeDuplicateSuggestions(suggestions);

    //The map() method creates a new array populated with the results of calling a provided function on every element in the calling array.
    currentSuggestions = uniqueSuggestions.map((suggestion) =>
      suggestion.name.toLowerCase()
    );

    suggestionBox.style.display = "none";
    suggestionBox.innerHTML = "";

    if (uniqueSuggestions.length > 0) {
      suggestionBox.style.display = "block";

      uniqueSuggestions.forEach(function (suggestion) {
        var suggestionItem = document.createElement("div");
        suggestionItem.textContent = suggestion.name;
        suggestionItem.classList.add("suggestion-item");

        // Add a click event listener for each suggestion item
        suggestionItem.addEventListener("click", function () {
          searchInput.value = suggestion.name;

          suggestionBox.style.display = "none";

          // Check if the clicked suggestion is not already in the selected items list and ingredient list

          if (
            !selectedItems.includes(suggestion.name) &&
            !isIngredientInList(suggestion.name, ingredientList)
          ) {
            selectedItems.push(suggestion.name);

            var selectedItem = document.createElement("div");
            selectedItem.classList.add("selected-item");
            selectedItem.textContent = suggestion.name;

            var deleteButton = document.createElement("button");
            deleteButton.textContent = "x";
            deleteButton.classList.add("delete-button");

            deleteButton.addEventListener("click", function () {
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
      suggestionBox.style.display = "none";
    }
  }

  // Call the handleIngredientInputChange function to handle any additional logic for the input change event
  handleIngredientInputChange(event);
});

// Function to handle changes in the ingredient input field

function handleIngredientInputChange(event) {
  var inputValue = event.target.value;
  if (inputValue.length >= 3) {
    searchFoodItemSuggestions(inputValue);
  }

  if (selectedItems.includes(inputValue)) {
    event.target.value = "";
  }
}

function sortRecipes(recipes, sortOrder) {
  if (sortOrder === "price") {
    return recipes.sort((a, b) => a.pricePerServing - b.pricePerServing);
  } else if (sortOrder === "-price") {
    return recipes.sort((a, b) => b.pricePerServing - a.pricePerServing);
  }
  return recipes;
}
// This function is called when the window is fully loaded
window.onload = function () {
  // Get the ingredient input field and add input and blur event listeners
  var ingredientInput = document.getElementById("searched-input");
  ingredientInput.addEventListener("input", handleIngredientInputChange);
  ingredientInput.addEventListener("blur", handleIngredientInputChange);

  var resultsContainer = document.getElementById("suggested-recipes");
  resultsContainer.style.display = "none";

  // Get the 'Sort By' radio buttons
  var sortRadioButtons = document.querySelectorAll('input[name="sort-by"]');
  let sortOrder = "price";

  sortRadioButtons.forEach((radioButton) => {
    radioButton.addEventListener("change", (event) => {
      sortOrder = event.target.value;
    });
  });

  // Get the 'Get Recipes' button and add a click event listener
  var getRecipesButton = document.getElementById("get-recipes");
  getRecipesButton.addEventListener("click", async function () {
    resultsContainer.style.display = "";
    cocktailButton.classList.add("is-4");

    var selectedIngredients = selectedItems.join();

    var spoonacularApiKey = "2e39a525784f4df6bc533d1a0e3e2403";

    var intolerancesParam =
      intolerances.length > 0 ? "&intolerances=" + intolerances.join(",") : "";

    var dietsParam = selectedDiet ? "&diet=" + selectedDiet : "";

    var maxReadyTimeParam =
      selectedMaxReadyTimes.length > 0
        ? "&maxReadyTime=" + Math.min(...selectedMaxReadyTimes)
        : "";

    var cuisineParam = selectedCuisine ? "&cuisine=" + selectedCuisine : "";

    // Constructed the full API URL for the Spoonacular complexSearch endpoint
    var apiURLspoonacular =
      "https://api.spoonacular.com/recipes/complexSearch?includeIngredients=" +
      selectedIngredients +
      "&number=10&addRecipeInformation=true" +
      intolerancesParam +
      maxReadyTimeParam +
      dietsParam +
      cuisineParam +
      "&apiKey=" +
      spoonacularApiKey;

    // Use a try-catch block to handle errors while fetching data from the API
    try {
      var response = await fetch(apiURLspoonacular);

      var recipes = await response.json();
      recipes.results = sortRecipes(recipes.results, sortOrder);

      console.log(recipes);
      console.log(response);

      resultsContainer.innerHTML = "";

      // Loop through the fetched recipes and create a DOM element for each one
      recipes.results.forEach(function (recipe) {
        // Create a new div element to represent the recipe
        var recipeElement = document.createElement("div");
        recipeElement.classList.add("recipe");

        // Create a container for the recipe image, title, and save button
        var recipeImgTitleSaveContainer = document.createElement("div");
        recipeImgTitleSaveContainer.classList.add(
          "recipe-img-title-save-container"
        );

        // Create a link element for the recipe title and add it to the container
        var recipeTitle = document.createElement("a");
        recipeTitle.textContent = recipe.title;
        recipeTitle.href = recipe.sourceUrl;
        recipeTitle.classList.add("recipe-title");
        recipeTitle.style.fontWeight = "bold";
        recipeTitle.style.fontSize = "1.2rem";
        recipeTitle.target = "_blank"; // open link in a new tab
        recipeImgTitleSaveContainer.appendChild(recipeTitle);

        // Create an img element for the recipe image and add it to the container
        var recipeImage = document.createElement("img");
        recipeImage.src = recipe.image;
        recipeImage.alt = recipe.title;
        recipeImage.classList.add("recipe-image");
        recipeImgTitleSaveContainer.appendChild(recipeImage);

        // Create a button element for saving the recipe and add it to the container
        var saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        saveButton.classList.add("save-button");
        recipeImgTitleSaveContainer.appendChild(saveButton);

        // Add a click event listener to the save button
        saveButton.addEventListener("click", function () {
          var recipeName = recipe.title;
          var recipeImage = recipe.image;

          var recipeSummary = recipe.summary.replace(/<[^>]*>?/gm, "");

          // Create an object to represent the saved recipe
          var savedRecipe = {
            name: recipeName,
            image: recipeImage,
            summary: recipeSummary,
          };

          // Get the existing saved recipes from local storage
          var savedRecipes =
            JSON.parse(localStorage.getItem("savedRecipes")) || [];

          savedRecipes.push(savedRecipe);

          localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
        });
        // Add the recipe image, title, and save button container to the recipe element
        recipeElement.appendChild(recipeImgTitleSaveContainer);

        var recipeInfoContainer = document.createElement("div");
        recipeInfoContainer.classList.add("recipe-info-container");

        // Add the recipe summary to the information element if it exists
        if (recipe.summary) {
          var recipeSummary = document.createElement("p");
          recipeSummary.classList.add("recipe-summary");
          // Replace any HTML tags in the summary with an empty string
          recipeSummary.textContent = recipe.summary.replace(/<[^>]*>?/gm, "");
          recipeInfoContainer.appendChild(recipeSummary);
        }

        recipeElement.appendChild(recipeInfoContainer);

        resultsContainer.appendChild(recipeElement);
      });

      // Scroll to the bottom of the results container to show the new recipes
      resultsContainer.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } catch (error) {
      console.error(error);
    }
  });
};
// Added radio button code
var dietsRadioButtons = document.querySelectorAll(".diets-radio");
var cuisinesRadioButtons = document.querySelectorAll(".cuisines-radio");
var selectedFiltersContainer = document.getElementById("selected-filters-list");

var priceRadioButtons = document.querySelectorAll(".price-radio");
let selectedDiet = "";
let selectedCuisine = "";

let selectedPrice = "";



dietsRadioButtons.forEach((radioButton) => {
  radioButton.addEventListener("click", (event) => {
    var dietsText = event.target.parentNode
      .querySelector("span")
      .textContent.trim()
      .replace(/^No /, "")
      .toLowerCase();

    if (selectedDiet === dietsText) {
      event.target.checked = false;
      selectedDiet = "";
    } else {
      selectedDiet = dietsText;
    }

    updateSelectedFilters();
  });
});

cuisinesRadioButtons.forEach((radioButton) => {
  radioButton.addEventListener("click", (event) => {
    var cuisineText = event.target.parentNode
      .querySelector("span")
      .textContent.trim()
      .replace(/^No /, "")
      .toLowerCase();

    if (selectedCuisine === cuisineText) {
      event.target.checked = false;
      selectedCuisine = "";
    } else {
      selectedCuisine = cuisineText;
    }

    updateSelectedFilters();
  });
});

priceRadioButtons.forEach((radioButton) => {
  radioButton.addEventListener("click", (event) => {
    var priceText = event.target.parentNode
      .querySelector("span")
      .textContent.trim()
      .replace(/^No /, "")
      .toLowerCase();

    if (selectedPrice === priceText) {
      event.target.checked = false;
      selectedPrice = "";
    } else {
      selectedPrice = priceText;
    }

    updateSelectedFilters();
  });
});

//Function for updating the selected filters list
function updateSelectedFilters() {
  var dietElement = selectedFiltersContainer.querySelector(".diet-filter");
  var cuisineElement = selectedFiltersContainer.querySelector(".cuisine-filter");
  var priceElement = selectedFiltersContainer.querySelector(".price-filter");

  if (selectedDiet) {
    if (!dietElement) {
      var newDietElement = document.createElement("div");
      newDietElement.classList.add("diet-filter");
      selectedFiltersContainer.appendChild(newDietElement);
    }
    selectedFiltersContainer.querySelector(".diet-filter").textContent = selectedDiet;
  } else if (dietElement) {
    selectedFiltersContainer.removeChild(dietElement);
  }

  if (selectedCuisine) {
    if (!cuisineElement) {
      var newCuisineElement = document.createElement("div");
      newCuisineElement.classList.add("cuisine-filter");
      selectedFiltersContainer.appendChild(newCuisineElement);
    }
    selectedFiltersContainer.querySelector(".cuisine-filter").textContent = selectedCuisine;
  } else if (cuisineElement) {
    selectedFiltersContainer.removeChild(cuisineElement);
  }

  if (selectedPrice) {
    if (!priceElement) {
      var newPriceElement = document.createElement("div");
      newPriceElement.classList.add("price-filter");
      selectedFiltersContainer.appendChild(newPriceElement);
    }
    selectedFiltersContainer.querySelector(".price-filter").textContent = selectedPrice;
  } else if (priceElement) {
    selectedFiltersContainer.removeChild(priceElement);
  }
}

// Get all intolerance checkboxes and store them in a variable
var intoleranceCheckboxes = document.querySelectorAll(
  '#intolerance-dropdown input[type="checkbox"]'
);

let intolerances = [];

// Iterate over each checkbox and add a click event listener
intoleranceCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("click", (event) => {
    var intoleranceText = event.target.parentNode
      .querySelector("span")
      .textContent.replace("No ", "")
      .toLowerCase();

    // If the checkbox is checked, add the intolerance to the array
    if (event.target.checked) {
      intolerances.push(intoleranceText);
    } else {
      var index = intolerances.indexOf(intoleranceText);
      if (index !== -1) {
        intolerances.splice(index, 1);
      }
    }
  });
});

var maxReadyTimeCheckboxes = document.querySelectorAll(
  "#max-ready-time-dropdown"
);

let selectedMaxReadyTimes = [];

// Iterate over each checkbox and add a click event listener
maxReadyTimeCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("click", (event) => {
    var maxReadyTimeText =
      event.target.parentNode.querySelector("span").textContent;

    // Extract the numeric value from the text
    var maxReadyTimeValue = parseInt(maxReadyTimeText.match(/\d+/)[0]);

    if (event.target.checked) {
      if (!selectedMaxReadyTimes.includes(maxReadyTimeValue)) {
        selectedMaxReadyTimes.push(maxReadyTimeValue);
      }
    } else {
      // Remove the maxReadyTimeValue from the selectedMaxReadyTimes array
      selectedMaxReadyTimes = selectedMaxReadyTimes.filter(
        (value) => value !== maxReadyTimeValue
      );
    }
  });
});

var cocktailTile = document.getElementById("suggested-cocktail");
var cocktailButton = document.querySelector("#get-cocktails");
var recipeTile = document.querySelector("#suggested-recipes");

// Hide the cocktail tile by default
cocktailTile.style.display = "none";

// Add a click event listener to the cocktail button
cocktailButton.addEventListener("click", function () {
  // Clear the content of the ingredients and their amounts when the button is clicked
  document.getElementById("ingredient1").textContent = "";
  document.getElementById("ingredient2").textContent = "";
  document.getElementById("ingredient3").textContent = "";
  document.getElementById("ingredient4").textContent = "";
  document.getElementById("ingredient5").textContent = "";
  document.getElementById("ingredient6").textContent = "";

  document.getElementById("ingredient1-amount").textContent = "";
  document.getElementById("ingredient2-amount").textContent = "";
  document.getElementById("ingredient3-amount").textContent = "";
  document.getElementById("ingredient4-amount").textContent = "";
  document.getElementById("ingredient5-amount").textContent = "";
  document.getElementById("ingredient6-amount").textContent = "";

  recipeTile.classList.add("is-8");
  cocktailTile.style.display = "";

  // Fetch a random cocktail from the API
  fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
    .then((response) => response.json())
    .then((data) => {
      // Declare variables for the cocktail information
      var cocktailName = data.drinks[0].strDrink;
      var ingredient1 = data.drinks[0].strIngredient1;
      var ingredient2 = data.drinks[0].strIngredient2;
      var ingredient3 = data.drinks[0].strIngredient3;
      var ingredient4 = data.drinks[0].strIngredient4;
      var ingredient5 = data.drinks[0].strIngredient5;
      var ingredient6 = data.drinks[0].strIngredient6;
      var instructions = data.drinks[0].strInstructions;
      var image = data.drinks[0].strDrinkThumb;

      // Populate the HTML with the fetched cocktail information
      document.getElementById("cocktail-name").textContent = cocktailName;
      if (data.drinks[0].strIngredient1) {
        document.getElementById("ingredient1").textContent = ingredient1;
      }
      if (data.drinks[0].strMeasure1) {
        document.getElementById("ingredient1-amount").textContent =
          data.drinks[0].strMeasure1;
      }
      if (data.drinks[0].strIngredient2) {
        document.getElementById("ingredient2").textContent = ingredient2;
      }
      if (data.drinks[0].strMeasure2) {
        document.getElementById("ingredient2-amount").textContent =
          data.drinks[0].strMeasure2;
      }
      if (data.drinks[0].strIngredient3) {
        document.getElementById("ingredient3").textContent = ingredient3;
      }
      if (data.drinks[0].strMeasure3) {
        document.getElementById("ingredient3-amount").textContent =
          data.drinks[0].strMeasure3;
      }
      if (data.drinks[0].strIngredient4) {
        document.getElementById("ingredient4").textContent = ingredient4;
      }
      if (data.drinks[0].strMeasure4) {
        document.getElementById("ingredient4-amount").textContent =
          data.drinks[0].strMeasure4;
      }
      if (data.drinks[0].strIngredient5) {
        document.getElementById("ingredient5").textContent = ingredient5;
      }
      if (data.drinks[0].strMeasure5) {
        document.getElementById("ingredient5-amount").textContent =
          data.drinks[0].strMeasure5;
      }
      if (data.drinks[0].strIngredient6) {
        document.getElementById("ingredient6").textContent = ingredient6;
      }
      if (data.drinks[0].strMeasure6) {
        document.getElementById("ingredient6-amount").textContent =
          data.drinks[0].strMeasure6;
      }

      document.getElementById("cocktail-instructions").textContent =
        instructions;
      document.getElementById("cocktail-image").src = image;
      cocktailTile.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    })

    .catch((error) => console.error(error));
});

var savedRecipes = document.querySelector(".saved-recipes");
// saved recipes button changes page to recipes.html
savedRecipes.addEventListener("click", function () {
  window.location = "./recipes.html";
});
