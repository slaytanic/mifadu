import axios from 'axios';

import { GRAPHQL_ENDPOINT } from './common';

export function deleteUser(id) {
  return axios.post(GRAPHQL_ENDPOINT, {
    query: 'mutation($id: ID!) { deleteUser(id: $id) { id } }',
    variables: {
      id,
    },
  });
}

export function getUser(id) {
  return axios.post(GRAPHQL_ENDPOINT, {
    query:
      'query($id: ID!) { user(id: $id) { id, firstName, lastName, email, completedProfile, idNumber, tutoredWorkshops { id } } }',
    variables: { id },
  });
}

export function getUsers() {
  return axios.post(GRAPHQL_ENDPOINT, {
    query:
      '{ users { id, firstName, lastName, email, completedProfile, idNumber, tutoredWorkshops { id } } }',
  });
}
