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
      'mutation($email: String!, $password: String!) { loginUser(email: $email, password: $password) { firstName, lastName, email, completedProfile } }',
    variables: {
      email,
      password,
    },
  });
}

export function createOrUpdateUser(input) {
  return axios.post(GRAPHQL_ENDPOINT, {
    query:
      'mutation($input: UserInput!) { createOrUpdateUser(input: $input) { firstName, lastName, email, completedProfile } }',
    variables: {
      input,
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

export function getMyAssignments() {
  return axios.post(GRAPHQL_ENDPOINT, {
    query: '{ myAssignments { id, name } }',
  });
}

export function getAssignment(id) {
  return axios.post(GRAPHQL_ENDPOINT, {
    query: 'query($id: ID!) { getAssignment(id: $id) { id, name } }',
    variables: {
      id,
    },
  });
}

export function getTags() {
  return axios.post(GRAPHQL_ENDPOINT, {
    query: '{ tags { id, name } }',
  });
}

export function createAssignment(input) {
  return axios.post(GRAPHQL_ENDPOINT, {
    query:
      'mutation($input: AssignmentInput!) { createAssignment(input: $input) { id } }',
    variables: {
      input,
    },
  });
}
