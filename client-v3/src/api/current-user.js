import axios from 'axios';

import { GRAPHQL_ENDPOINT } from './common';

export function getCurrentUser() {
  return axios.post(GRAPHQL_ENDPOINT, {
    query:
      'query { me { id, firstName, lastName, email, completedProfile, tutoredWorkshops { id } } }',
  });
}

export function loginUser(email, password) {
  return axios.post(GRAPHQL_ENDPOINT, {
    query:
      'mutation($email: String!, $password: String!) { loginUser(email: $email, password: $password) { id, firstName, lastName, email, completedProfile, tutoredWorkshops { id } } }',
    variables: {
      email,
      password,
    },
  });
}

export function logoutUser() {
  return axios.post(GRAPHQL_ENDPOINT, {
    query: 'mutation { logoutUser }',
  });
}

export function createOrUpdateUser(input) {
  return axios.post(GRAPHQL_ENDPOINT, {
    query:
      'mutation($input: UserInput!) { createOrUpdateUser(input: $input) { id, firstName, lastName, email, completedProfile, tutoredWorkshops { id } } }',
    variables: {
      input,
    },
  });
}
