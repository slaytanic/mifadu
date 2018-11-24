import axios from 'axios';

import { GRAPHQL_ENDPOINT } from './common';

export function getWorkshops() {
  return axios.post(GRAPHQL_ENDPOINT, { query: '{ workshops { id, name } }' });
}

export function getMyWorkshops() {
  return axios.post(GRAPHQL_ENDPOINT, { query: '{ myWorkshops { id, name } }' });
}
