const URL_DB = window.location.hostname.includes('localhost')
  ? 'http://localhost:8080'
  : 'https://manual-do-cubo.herokuapp.com';

export default URL_DB;
