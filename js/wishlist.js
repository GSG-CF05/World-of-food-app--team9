let wishlist_list = window.localStorage.getItem('wishlist');
let allFood = document.querySelector('.all-food');

function addFood(info) {
  console.log(info);
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
  console.log(wishlist_list);
  if (typeof wishlist_list == 'string') {
    list = JSON.parse(wishlist_list);
  } else if (!Array.isArray(wishlist_list)) {
    wishlist_list = [];
    let list = JSON.parse(wishlist_list);
  }

  if (list) {
    list.forEach((element) => {
      if (info['idMeal'] == element) {
        heartIcon.classList.add('favMeal');
      }
    });
  }

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
  showDetails.href = '#';
  showDetails.classList.add('food-link');

  //evant listener for add meal id to local storage by showDetails anchor
  showDetails.addEventListener('click', function () {
    let meal_id = showDetails.closest('.food-item').id;
    addIdMealToLocalStorage(meal_id);
  });

  let arrowLink = document.createElement('a');
  arrowLink.href = '#';
  //evant listener for add meal id to local storage by showDetails anchor
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
function toggle(item, like) {
  if (!wishlist_list) {
    addToWish(item, like);
  } else if (wishlist_list.includes(item)) {
    removeFromWish(item, like);
  } else {
    console.log(`${item} is not set in list`);
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
  console.log(wishlist_list);
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
  allFood.innerHTML = '';
  if (typeof wishlist_list != 'string') {
    wishlist_list = JSON.stringify(wishlist_list);
  } else if (!Array.isArray(wishlist_list)) {
    wishlist_list = [];
  }

  listWishListItems(wishlist_list);
}

function listWishListItems(list) {
  list = JSON.parse(list);
  list.forEach((id) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        addFood(data.meals[0]);
      });
  });
}
listWishListItems(wishlist_list);
