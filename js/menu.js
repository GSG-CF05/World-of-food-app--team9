// get important nodes
let allFood = document.querySelector('.all-food');
let countriesList = document.querySelector('.countries-list');
let searchInput = document.querySelector('.search-input');
let username = window.localStorage.getItem('user');
user = JSON.parse(username);
if (window.localStorage.getItem('wishlist')) {
  var wishlist_list = window.localStorage.getItem('wishlist');
  wishlist_list = JSON.parse(wishlist_list);
} else {
  var wishlist_list = [];
}

//pagination variabls
let numberOfitems = 0;
const list_element = document.getElementById('all-food');
const pagination_element = document.getElementById('pagination');
let current_page = 1;
let n_meals = 25;

// show meals to page
function addFood(info) {
  let foodItem = document.createElement('div');
  foodItem.classList.add('food-item');
  foodItem.classList.add('left-to-right-ef');
  foodItem.setAttribute('id', info['idMeal']);

  let foodImage = document.createElement('div');
  foodImage.classList.add('food-img');

  let img = document.createElement('img');
  img.src = `${info.strMealThumb}`;
  img.alt = 'meal';

  foodImage.appendChild(img);
  foodItem.appendChild(foodImage);

  let foodInfo = document.createElement('div');
  foodInfo.classList.add('food-info');

  let foodIcons = document.createElement('div');
  foodIcons.classList.add('food-icons');

  let youtubeLink = document.createElement('a');
  youtubeLink.href = `${info.strYoutube}`;
  youtubeLink.target = 'blank';

  let youtubeIcon = document.createElement('i');
  youtubeIcon.classList.add('fa-brands');
  youtubeIcon.classList.add('fa-youtube');

  youtubeLink.appendChild(youtubeIcon);

  let heartIcon = document.createElement('i');
  heartIcon.classList.add('fa-solid');
  heartIcon.classList.add('fa-heart');

  //check the element if in wish list
  wishlist_list.forEach((element) => {
    if (info['idMeal'] == element) {
      heartIcon.classList.add('favMeal');
    }
  });

  //make the heart icon orange if added in wishlist
  heartIcon.addEventListener('click', function () {
    let meal_id = heartIcon.closest('.food-item').id;
    toggle(meal_id, heartIcon);
  });

  foodIcons.appendChild(youtubeLink);
  foodIcons.appendChild(heartIcon);

  foodInfo.appendChild(foodIcons);

  let foodName = document.createElement('h3');
  foodName.classList.add('food-name');
  foodName.textContent = `${info.strMeal} `;

  let sub = document.createElement('sub');
  sub.textContent = `${info.strArea}`;
  foodName.appendChild(sub);

  foodInfo.appendChild(foodName);

  let foodMoreInfo = document.createElement('div');
  foodMoreInfo.classList.add('food-more-info');

  let showDetails = document.createElement('a');
  showDetails.textContent = 'Show details';
  showDetails.href = '../details/details.html';
  showDetails.classList.add('food-link');
  showDetails.addEventListener('click', function () {
    let meal_id = showDetails.closest('.food-item').id;
    addIdMealToLocalStorage(meal_id);
  });

  let arrowLink = document.createElement('a');
  arrowLink.href = '../details/details.html';
  arrowLink.addEventListener('click', function () {
    let meal_id = arrowLink.closest('.food-item').id;
    addIdMealToLocalStorage(meal_id);
  });

  let arrowIcon = document.createElement('i');
  arrowIcon.classList.add('fa-solid');
  arrowIcon.classList.add('fa-arrow-right');

  arrowLink.appendChild(arrowIcon);

  foodMoreInfo.appendChild(showDetails);
  foodMoreInfo.appendChild(arrowLink);

  foodInfo.appendChild(foodMoreInfo);

  foodItem.appendChild(foodInfo);
  allFood.appendChild(foodItem);
}

// add countries to page
function addCountry(country) {
  countriesList.innerHTML += `
    <a class="country-item" onclick="filterCountry(this)">${country}</a>
    `;
}

// all food api
fetch('./../assets/food.json')
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    displayList(data.meals, list_element, n_meals, current_page);
    setUpPagination(data.meals, pagination_element, n_meals);
  });

// country list api
fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    for (let i = 0; i < data.meals.length; i++) {
      if (data.meals[i].strArea == 'Unknown') {
        continue;
      }
      addCountry(data.meals[i].strArea);
    }
  });

//  move between countries using next-arrow
var button = document.getElementById('next');
button.onclick = function () {
  document.getElementById('container-countries').scrollLeft += 178;
};

//  move between countries using back-arrow
var back = document.getElementById('back');
back.onclick = function () {
  document.getElementById('container-countries').scrollLeft -= 178;
};

// filter meals according to their country
function filterCountry(country) {
  let myReq = new Request('./../assets/food.json');
  fetch(myReq)
    .then((response) => {
      return response.json();
    })
    .then((jsondata) => {
      let meals = jsondata.meals;
      countryMeals = meals.filter(
        (item) => item.strArea == country.textContent
      );
      let paginationContainer = document.querySelector('.pagenumbers');
      paginationContainer.innerHTML = '';
      displayList(countryMeals, list_element, n_meals, current_page);
      setUpPagination(countryMeals, pagination_element, n_meals);
    });

  // reactive the clicked country
  let countryItems = document.querySelectorAll('.country-item');
  countryItems.forEach((x) => {
    x.classList.remove('active-country');
  });
  country.classList.add('active-country');
  searchInput.value = '';
}

// search by name :
function search(value) {
  let activeCountry = document.querySelector('.active-country');
  fetch('./../assets/food.json')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let meals = data.meals;
      allFood.innerHTML = '';
      meals.forEach((item) => {
        if (
          activeCountry.textContent == 'All' &&
          item.strMeal.toLowerCase().includes(value.toLowerCase())
        ) {
          addFood(item);
        } else if (
          activeCountry.textContent == item.strArea &&
          item.strMeal.toLowerCase().includes(value.toLowerCase())
        ) {
          addFood(item);
        }
      });
    });
}

function displayList(items, wrapper, n_meals_per_page, page) {
  wrapper.innerHTML = '';
  page--;
  let start = n_meals_per_page * page;
  let end = start + n_meals_per_page;

  let paginatedItems = items.slice(start, end);
  for (let i = 0; i < paginatedItems.length; i++) {
    let item = paginatedItems[i];

    let item_element = addFood(item);
  }
}
function setUpPagination(items, wrapper, n_meals_per_page) {
  wrapper.innerhtml = '';
  let page_count = Math.ceil(items.length / n_meals_per_page);
  for (let i = 1; i < page_count + 1; i++) {
    let btn = paginationButton(i, items);
    wrapper.appendChild(btn);
  }
}
function paginationButton(page, items) {
  let button = document.createElement('button');
  button.innerText = page;

  if (current_page == page) {
    button.classList.add('active');
  }
  button.addEventListener('click', function () {
    console.log;
    current_page = page;
    displayList(items, list_element, n_meals, current_page);
    let current_btn = document.querySelector('.pagenumbers button.active');
    current_btn.classList.remove('active');
    button.classList.add('active');
    searchInput.value = '';
  });

  return button;
}

//wishlist functionality
function toggle(item, like) {
  if (!wishlist_list) {
    addToWish(item, like);
  } else if (wishlist_list.includes(item)) {
    removeFromWish(item, like);
  } else {
    addToWish(item, like);
  }
}
//function add to wish list
function addToWish(item, like) {
  if (typeof wishlist_list == 'string') {
    wishlist_list = JSON.parse(wishlist_list);
  } else if (!Array.isArray(wishlist_list)) {
    wishlist_list = [];
  }
  wishlist_list.push(item);
  window.localStorage.setItem('wishlist', JSON.stringify(wishlist_list));
  like.classList.add('favMeal');
}
//function remove form with list
function removeFromWish(item, like) {
  let wishlist_items = localStorage.getItem('wishlist');

  let i = 0;
  wishlist_items = JSON.parse(wishlist_items);
  wishlist_items.forEach((element) => {
    if (element == item) {
      wishlist_items.splice(i, 1);
    }
    i++;
  });
  localStorage.setItem('wishlist', JSON.stringify(wishlist_items));
  wishlist_list = wishlist_items;
  like.classList.remove('favMeal');
}
// function addUserName(name) {
//   console.log(name);
//   let nameEle = document.querySelector('.bars-icon');
//   console.log(nameEle);
//   nameEle.innerText(`${name}`);
// }
// addUserName(user['username']);
//for save the meal id in local storage for show meal details
function addIdMealToLocalStorage(id) {
  window.localStorage.setItem('meal_id_details', JSON.stringify(id));
}
