import axios from 'axios';

import { GRAPHQL_ENDPOINT } from './common';

export function getTags() {
  return axios.post(GRAPHQL_ENDPOINT, {
    query: 'query { tags { id, name } }',
  });
}

export function createTag(input) {
  return axios.post(GRAPHQL_ENDPOINT, {
    query: 'mutation($input: TagInput!) { createTag(input: $input) { id, name } }',
    variables: { input },
  });
}
