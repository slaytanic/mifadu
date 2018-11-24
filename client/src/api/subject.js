import axios from 'axios';

import { GRAPHQL_ENDPOINT } from './common';

export function getSubjects() {
  return axios.post(GRAPHQL_ENDPOINT, {
    query: '{ subjects { id, name, code } }',
  });
}

export { getSubjects as default };
