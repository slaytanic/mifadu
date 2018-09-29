import axios from 'axios';

import { GRAPHQL_ENDPOINT } from './common';

export function getTags() {
  return axios.post(GRAPHQL_ENDPOINT, {
    query: '{ tags { id, name } }',
  });
}

export { getTags as default };
