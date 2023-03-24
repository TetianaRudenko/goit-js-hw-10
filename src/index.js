import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import Debounce from 'lodash.debounce';
import { Notify } from 'notiflix';


const DEBOUNCE_DELAY = 300;
const refs = {
  searchInput: document.querySelector('#search-box'),
  countriesList: document.querySelector('.country-list'),
  countryCard: document.querySelector('.country-info'),
};

refs.searchInput.addEventListener('input', Debounce(onSearch,DEBOUNCE_DELAY))


function onSearch(e) {

  const inputValue = e.target.value.trim();
  
  if (inputValue === '') {
    clearCountriesInfo();
    return;
  }

  return fetchCountries(inputValue)
    .then(response => {
      clearCountriesInfo();

      if (response.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (response.length >= 2) {
          createCountriesList(response);
      } else if (response.length === 1) {
          createCountryCard(response[0]);
      }
    })
    .catch(error => {
      clearCountriesInfo();
      Notify.failure(error.message);
    });
}


//створюю картки списку країн 2=8
function createCountriesList(countries) {
  return countries.map(({ flags, name }) => {
    const el = `
    <li class="country-list__item">
        <img class="country-info__flag flag--small" src="${flags.svg}" alt="${name.official}" />
        <p>${name.official}</p>
    </li>
  `;
    refs.countriesList.insertAdjacentHTML('beforeend', el);
  });
}



//створюю картку країни 1
function createCountryCard({ flags, name, capital, population, languages }) {
  const lngs = Object.values(languages).join(', ');

  const el = `
  <div class="country-container">
    <img class="country-info__flag" src="${flags.svg}" alt="${name.official}" />
    <p class="country-info__title">${name.official}</p>
    <p>
      <span>Capital: </span>
      ${capital}
    </p>
    <p>
      <span>Population: </span>
      ${population}
    </p>
    <p>
      <span>Languages: </span>
      ${lngs}
    </p>
  </div>
  `;

  refs.countryCard.insertAdjacentHTML('beforeend', el);
}


//очистити поле
function clearCountriesInfo() {
  refs.countryCard.innerHTML = '';
  refs.countriesList.innerHTML = '';
}

