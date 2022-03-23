
// get important nodes 
let allFood = document.querySelector(".all-food");
let countriesList = document.querySelector(".countries-list");

// show meals to page 
function addFood(info) {
  let foodItem = document.createElement("div");
  foodItem.classList.add("food-item");
  foodItem.classList.add("left-to-right-ef");

  let foodImage = document.createElement("div");
  foodImage.classList.add("food-img");

  let img = document.createElement("img");
  img.src = `${info.strMealThumb}`;
  img.alt = "meal";

  foodImage.appendChild(img);
  foodItem.appendChild(foodImage);

  let foodInfo = document.createElement("div");
  foodInfo.classList.add("food-info");

  let foodIcons = document.createElement("div");
  foodIcons.classList.add("food-icons");

  let youtubeLink = document.createElement("a");
  youtubeLink.href = `${info.strYoutube}`;
  youtubeLink.target = "blank";

  let youtubeIcon = document.createElement("i");
  youtubeIcon.classList.add("fa-brands");
  youtubeIcon.classList.add("fa-youtube");

  youtubeLink.appendChild(youtubeIcon);

  let heartIcon = document.createElement("i");
  heartIcon.classList.add("fa-solid");
  heartIcon.classList.add("fa-heart");

  foodIcons.appendChild(youtubeLink);
  foodIcons.appendChild(heartIcon);

  foodInfo.appendChild(foodIcons);

  let foodName = document.createElement("h3");
  foodName.classList.add("food-name");
  foodName.textContent = `${info.strMeal} `;

  let sub = document.createElement("sub");
  sub.textContent = `${info.strArea}`;
  foodName.appendChild(sub);

  foodInfo.appendChild(foodName);

  let foodMoreInfo = document.createElement("div");
  foodMoreInfo.classList.add("food-more-info");

  let showDetails = document.createElement("a");
  showDetails.textContent = "Show details";
  showDetails.href = "#";
  showDetails.classList.add("food-link");

  let arrowLink = document.createElement("a");
  arrowLink.href = "#";

  let arrowIcon = document.createElement("i");
  arrowIcon.classList.add("fa-solid");
  arrowIcon.classList.add("fa-arrow-right");

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
fetch("./../assets/food.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    for (let i = 0; i < 24; i++) {
      addFood(data.meals[i]);
    }
  });

// country list api
fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    for (let i = 0; i < data.meals.length; i++) {
      if (data.meals[i].strArea == "Unknown") {
        continue;
      }
      addCountry(data.meals[i].strArea);
    }
  });


//  move between countries using next-arrow
var button = document.getElementById("next");
button.onclick = function () {
  document.getElementById("container-countries").scrollLeft += 178;
};

//  move between countries using back-arrow
var back = document.getElementById("back");
back.onclick = function () {
  document.getElementById("container-countries").scrollLeft -= 178;
};


// filter meals according to their country
function filterCountry(country) {
  let myReq = new Request("./../assets/food.json");
  fetch(myReq)
    .then((response) => {
      return response.json();
    })
    .then((jsondata) => {
      let meals = jsondata.meals;
      allFood.innerHTML = "";
      countryMeals = meals.filter((item) => item.strArea == country.textContent);
      for (let i = 0; i < countryMeals.length; i++) {
        addFood(countryMeals[i]);
      }
    });
  
    // reactive the clicked country
    let countryItems = document.querySelectorAll(".country-item");
    countryItems.forEach((x)=>{
      x.classList.remove("active-country")
    })
    country.classList.add("active-country")
}


// search by name : 
let searchInput =document.querySelector('.search-input');
function search(value){
  let activeCountry = document.querySelector('.active-country')
  fetch("./../assets/food.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
      let meals = data.meals;
      allFood.innerHTML= ""
      meals.forEach(item =>{
         if(activeCountry.textContent == 'All' && item.strMeal.toLowerCase().includes(value.toLowerCase())){
              addFood(item);
         }else if(activeCountry.textContent== item.strArea && item.strMeal.toLowerCase().includes(value.toLowerCase())){
            addFood(item);
         }
      })
  });
}
