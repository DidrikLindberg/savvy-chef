# Savvy Chef

A Recipe Generator

## Visit the Site

[Cleck Here to Visit the Deployed Site](https://didriklindberg.github.io/savvy-chef/)

## Description

Savvy Chef is a web application that helps you find recipes based on the ingredients you have on hand. With its intuitive interface, you can easily search for ingredients and add them to your list. The app then uses a Spoonacular API to suggest recipes that match your ingredient list. You can also filter the recipe results based on food intolerances, dietary restrictions, price sorting, and cuisines. Savvy chef also uses the CocktailDB API to generate delicious and unique cocktails. Savvy Chef eliminates the hassle of meal planning and helps you cook delicious meals with the ingredients you already have in your kitchen.

This app was created to address the common problem faced by users who struggle to come up with meal ideas or recipes based on the ingredients they have available at home. By providing inspiration and direct recipes tailored to individual ingredients and dietary preferences, and other criteria, the app aims to make cooking easier and more accessible for its users.There are a ton of great recipe sites that offer all kinds of filters. There are also recipe sites built around ingredient lists you feed them. But our site combines the vast filtering options with the ability to filter even further with ingredients you want to include. You can also quickly pair a cocktail with your meal.

## Technology Used

- Bulma
  [Learn about Bulma](https://bulma.io/)

- Spoonacular API
  [Learn about Spoonacular](https://spoonacular.com/food-api)

- TheCockTailDB API
  [Learn about cocktailDB](https://www.thecocktaildb.com/)

- JavaScript
  [Learn about JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

- HTML
  [Learn about HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)

- CSS
  [Learn about CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)

- Git
  [Learn about Git](https://git-scm.com/)

## Usage

1. Start typing in the "add ingredients" search box to find the ingredient you want.
2. Press enter or click the ingredient from the suggestion list.
3. The ingredient is now populated in the "current ingredients" list, but you can remove it by clicking the "x" next to it.
4. Once you have selected your desired ingredients, you can choose any filters you would like to apply to your recipe search. Pick as many as you would like, but you can only pick one type of diet and one type of cuisine at a time.
5. Once you are satisfied with your selections, click the "get recipes" button at the bottom of the page.
6. You will be shown recipes that meet your criteria. You can save recipes to your "saved recipes" page by clicking the "save" button next to the image.
7. If you want a random cocktail suggestion, click the "I want a drink" button to the right of the "get recipes" button.
8. If you would like to see your saved recipes, click on the "saved recipes" button at the top of the page. You have the option of clearing your saved recipes.

![Alt Text](./assets/2023-04-13%2023.03.34.gif)

## Code Highlight

I wanted to highlight this code snippet because I think it might be the first time I added html elements withing my JavaScript in this particular way and I just that it was neat.all the data (forecastDate, iconUrl, highTemp, lowTemp, wind speed and humidity) values are inserted using string concatenation.

```JavaScript
  var card = document.createElement("div");
      card.classList.add("col");
      card.innerHTML = '<div class="card border-dark bg-white"><div class="card-body">' +
        '<h5 class="card-title">' + forecastDate + '</h5>' +
        '<img src="' + iconUrl + '">' +
        '<p class="card-text">High: ' + highTemp + '°F</p>' +
        '<p class="card-text">Low: ' + lowTemp + '°F</p>' +
        '<p class="card-text">Wind: ' + forecastsForDate[0].wind.speed + ' mph</p>' +
        '<p class="card-text">Humidity: ' + forecastsForDate[0].main.humidity + '%</p>' +
        '</div></div>';
```

## Learning Points

- Furthered knowledge of local storage, saving and retrieving
- Learned how to use the spread operator
- learned how to utilize 3rd party APIs, calling, response, etc.
- Learned how add icons

## Authors Info

Matthew Gibson

- [Portfolio](https://ohsweetwampum.github.io/mattgibson-portfolio-page/)
- [LinkedIn](https://www.linkedin.com/in/matthew-gibson-6b9b12237/)
- [Github](https://github.com/ohSweetWampum)

Christopher Daniels

- [Portfolio](https://danielschris96.github.io/personal-portfolio-page/)
- [LinkedIn](https://www.linkedin.com/in/christopher-daniels-01317726b/)
- [Github](https://github.com/danielschris96)

Didrik Lindberg

- [Portfolio](https://github.com/DidrikLindberg?tab=repositories)
- [LinkedIn](https://www.linkedin.com/in/didrik-lindberg-3b2955148/)
- [Github](https://github.com/DidrikLindberg)

## Credits

[meyerweb.com](https://meyerweb.com/eric/tools/css/reset/)
(For my reset.css file)

[mdnwebdocs.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
(.some)

[mdnwebdocs.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
(.map)

[mdnwebdocs.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
(.some)

[mdnwebdocs.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
(.some)

[mdnwebdocs.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
(.some)

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

```

```

Create a basic HTML layout using Bootstrap that includes a form with an input field for city name and a button to submit the form.

Add event listeners to the form and the button using JavaScript to handle user input and submission.

Use a third-party weather API, such as OpenWeatherMap, to retrieve the current weather data for the entered city. You can use the fetch() method to make a GET request to the API endpoint with the city name and API key as parameters.

Parse the JSON response from the API to extract the necessary information, such as the temperature, humidity, wind speed, and weather condition icon.

Display the current weather data on the webpage using JavaScript and dynamically created HTML elements.

Use the same API to retrieve the 5-day forecast for the entered city. You can make a similar GET request to a different API endpoint that provides the forecast data.

Parse the JSON response from the API to extract the necessary information for the forecast, such as the date, temperature, humidity, and weather condition icon.

Display the 5-day forecast data on the webpage using JavaScript and dynamically created HTML elements.

Add functionality to store the searched city in local storage and display it in a search history section on the webpage.

Add event listeners to the search history items to allow the user to click on them and retrieve the current and future weather data for that city.
