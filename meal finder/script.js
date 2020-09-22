const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals'),
  notification = document.getElementById('notification-container'),
  resultHeading = document.getElementById('result-heading'),
  notifyText = document.getElementById('notify-text'),
  single_mealEl = document.getElementById('single-meal');

searchMeal = e => {
  e.preventDefault();

  //clear single meal
  single_mealEl.innerHTML = '';

  const term = search.value;

  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results for '${term}'. Try again</p>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal, i) => `
            <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
            </div>
            </div>`
            )
            .join('');
        }
      });
    //   cleaar search text
    search.value = '';
  } else {
    showNotification('Please Enter a search value');
  }
  //   console.log(term);
};

getMealById = mealId => {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];

      addMealToDom(meal);
    });
};

randomMeal = () => {
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];
      addMealToDom(meal);
    });
};

addMealToDom = meal => {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
    <div class='single-meal'>
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
        <div class="single-meal-info">
            ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
            ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
        </div>
        <div class="main">
            <p>${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
                ${ingredients
                  .map(
                    ing => `
                <li>${ing}</li>`
                  )
                  .join('')}
            </ul>
        </div>
    </div>
  `;
};

// notification
showNotification = e => {
  notifyText.innerText = e;
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
};

//Event Listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', randomMeal);

mealsEl.addEventListener('click', e => {
  //   console.log(e);
  const mealInfo = e.path.find(item => {
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
    getMealById(mealID);
  }
});
