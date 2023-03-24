export function fetchCountries(name) {

  const BASE_URL = 'https://restcountries.com/v3.1/name/';

  return fetch(`${BASE_URL}${name}?fields=name,capital,population,flags,languages`).then(response => {
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Oops, there is no country with that name');
      } else {
        throw new Error(response.status);
      }
    }
    return response.json();
  })
}