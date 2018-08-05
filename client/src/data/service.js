import axios from 'axios';

const GRAPHQL_ENDPOINT = '/graphql';

export function getMe() {
  return axios.post(GRAPHQL_ENDPOINT, {
    query: '{ me { firstName, lastName, email, completedProfile } }',
  });
}

export function logoutUser() {
  return axios.post(GRAPHQL_ENDPOINT, {
    query: 'mutation { logoutUser }',
  });
}

export function loginUser(email, password) {
  return axios.post(GRAPHQL_ENDPOINT, {
    query:
      'mutation($email: String, $password: String) { loginUser(email: $email, password: $password) { email } }',
    variables: {
      email,
      password,
    },
  });
}

export function getSubjects() {
  return axios.post(GRAPHQL_ENDPOINT, {
    query: '{ subjects { id, name, code } }',
  });
}

export function getWorkshops() {
  return axios.post(GRAPHQL_ENDPOINT, { query: '{ workshops { id, name } }' });
}
