let app = document.querySelector('#root');
let idMeal = window.localStorage.getItem('meal_id_details');

//Add container
let container = document.createElement('div');
container.setAttribute('class', 'container');
app.appendChild(container);

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

let id = params.id; // "some_value"
fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`) // API adress
  // Obtaining data from API
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    console.log(data);
    showRecipe(data.meals[0]);
  })
  .catch((error) => console.log(error));
let ingredients = [];

function showRecipe(item) {
  let card = document.createElement('div');
  card.classList.add('image-card');
  container.appendChild(card);

  // meal image addition
  let mealPic = document.createElement('div');
  mealPic.classList.add('par-img');
  mealPic.style.backgroundImage = 'url(' + item.strMealThumb + ')';
  card.appendChild(mealPic);

  // meal name addition
  let mealName = document.createElement('h1');
  mealName.textContent = item.strMeal;
  card.appendChild(mealName);

  // add Ingredients
  let ingTitle = document.createElement('h2');
  ingTitle.textContent = 'Ingredients';
  card.appendChild(ingTitle);

  for (i = 1; i <= 16; i++) {
    if (item['strIngredient' + i]) {
      ingredients.push({
        label: item['strIngredient' + i],
        image:
          'https://www.themealdb.com/images/ingredients/' +
          item['strIngredient' + i] +
          '.png',
      });
    }
  }
  // Ingredients addition (1==>16)
  let cards = document.createElement('div');
  cards.classList.add('cards');

  ingredients.forEach((element) => {
    let ingredient = document.createElement('div');

    ingredient.classList.add('card');

    let ingImg = document.createElement('img');
    ingImg.src = element.image;
    ingImg.classList.add('card-img-top');
    ingredient.appendChild(ingImg);

    let ingText = document.createElement('p');

    ingText.textContent = element.label;
    ingredient.appendChild(ingText);

    cards.appendChild(ingredient);
    console.log(12212);
  });
  container.appendChild(cards);

  // Instructions addition
  let makeIt = document.createElement('p');
  makeIt.classList.add('p');
  makeIt.textContent = item.strInstructions;
  container.appendChild(makeIt);

  let vidTitle = document.createElement('h2');
  vidTitle.textContent = 'Watch video';
  container.appendChild(vidTitle);

  // // video addition

  let videstyle = document.createElement('div');
  videstyle.classList.add('video-style');
  container.appendChild(videstyle);

  console.log(item.strYoutube);
  let vidYoutube = document.createElement('iframe');
  let linkvideo = item.strYoutube.replace('watch?v=', 'embed/');
  console.log(linkvideo);

  vidYoutube.setAttribute('src', `${linkvideo}`);

  videstyle.appendChild(vidYoutube);
}
