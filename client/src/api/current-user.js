import axios from 'axios';

import { GRAPHQL_ENDPOINT } from './common';

const currentUserFields = `
  fragment currentUserFields on User {
    id
    firstName,
    lastName,
    fullName
    email,
    completedProfile,
    tutoredWorkshops {
      id
      name
    }
  }
`;

export function getCurrentUser() {
  return axios.post(GRAPHQL_ENDPOINT, {
    query: `
      query {
        me {
          ...currentUserFields
        }
      }
      ${currentUserFields} 
    `,
  });
}

export function loginUser(email, password) {
  return axios.post(GRAPHQL_ENDPOINT, {
    query: `
      mutation($email: String!, $password: String!) {
        loginUser(email: $email, password: $password) {
          ...currentUserFields
        }
      }
      ${currentUserFields} 
    `,
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
    query: `
      mutation($input: UserInput!) {
        createOrUpdateUser(input: $input) {
          ...currentUserFields
        }
      }
      ${currentUserFields} 
    `,
    variables: {
      input,
    },
  });
}

export function recoverPassword(email) {
  return axios.post(GRAPHQL_ENDPOINT, {
    query: 'mutation($email: String!) { recoverPassword(email: $email) }',
    variables: {
      email,
    },
  });
}

export function resetPassword(password, recoveryToken) {
  return axios.post(GRAPHQL_ENDPOINT, {
    query: `
      mutation($password: String!, $recoveryToken: String!) {
        resetPassword(password: $password, recoveryToken: $recoveryToken) {
          ...currentUserFields
        }
      }
      ${currentUserFields}
    `,
    variables: {
      password,
      recoveryToken,
    },
  });
}
