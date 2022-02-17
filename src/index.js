import './css/styles.css';
import {fetchCountries} from './fetchCountries';
import { Notify } from 'notiflix';
const lodashDebounce = require('lodash/debounce');
const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');


searchBox.addEventListener('input', lodashDebounce(searchHandler, DEBOUNCE_DELAY));

function searchHandler(event) {
  event.preventDefault();
  const name = searchBox.value.trim();

  if (name) {
    return fetchCountries(name).then(createMarkup).catch(error);
  } else {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  }
}

function createMarkup(countries) {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';

  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.', { timeout: 1000 });
    return;
  }
  if (countries.length >= 2 && countries.length <= 10) {
    countryList.innerHTML = createCountriesList(countries);
  }
  if (countries.length === 1) {
    countryInfo.innerHTML = createOneCountryMarkup(countries);
  }
}

function createCountriesList(countries) {
  return countries
    .map(({ name, flags }) => {
      return `<li><img src="${flags.svg}" alt="Flag of ${name.official}" style="height: 100px; width: 100px"><p>${name.official}</p></li>`;
    })
    .join('');
}

function createOneCountryMarkup(countries) {
  return countries
    .map(({ name, capital, population, flags, languages }) => {
      return `<h1><img src="${flags.svg}" alt="Flag of ${
        name.official
      }" style="height: 1em; width: 1em"> ${name.official}</h1>
        <p><b>Capital</b>: ${capital}</p>
        <p><b>Population</b>: ${population}</p>
        <p><b>Languages</b>: ${Object.values(languages)}</p>`;
    })
    .join('');
}

function error() {
  return Notify.failure('Oops, there is no country with that name', { timeout: 1000 });
}