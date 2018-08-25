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

export function deleteUser(id) {
  return axios.post(GRAPHQL_ENDPOINT, {
    query: 'mutation($id: ID!) { deleteUser(id: $id) { id } }',
    variables: {
      id,
    },
  });
}

export function getUsers() {
  return axios.post(GRAPHQL_ENDPOINT, {
    query: '{ users { id, firstName, lastName, email, completedProfile, idNumber } }',
  });
}

export function getMyStudents() {
  return axios.post(GRAPHQL_ENDPOINT, {
    query: '{ myStudents { id, firstName, lastName, email, completedProfile, idNumber } }',
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

export function getMyWorkshops() {
  return axios.post(GRAPHQL_ENDPOINT, { query: '{ myWorkshops { id, name } }' });
}

export function getMyAssignments() {
  return axios.post(GRAPHQL_ENDPOINT, {
    query: '{ myAssignments { id, name } }',
  });
}

export function getAssignment(id) {
  return axios.post(GRAPHQL_ENDPOINT, {
    query:
      'query($id: ID!) { assignment(id: $id) { id, name, shortDescription, description, requiredWork { id, type, description, assignmentWork { id, content, attachment { name, type, url } } }, endsAt, type, tags { id, name }, evaluationVariable, attachment { id, type, name, url }, evaluation { score1, score2, score3, score4, score5 } } }',
    variables: {
      id,
    },
  });
}

export function getAssignments() {
  return axios.post(GRAPHQL_ENDPOINT, {
    query: 'query { assignments { id, name, shortDescription } }',
  });
}

export function getPendingAssignments() {
  return axios.post(GRAPHQL_ENDPOINT, {
    query: 'query { pendingAssignments { id, name, shortDescription, endsAt } }',
  });
}

export function getCompletedAssignments() {
  return axios.post(GRAPHQL_ENDPOINT, {
    query: 'query { completedAssignments { id, name, shortDescription, endsAt } }',
  });
}

export function deleteAssignment(id) {
  return axios.post(GRAPHQL_ENDPOINT, {
    query: 'mutation($id: ID!) { deleteAssignment(id: $id) { id } }',
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
  const formData = new FormData();

  let attachment;
  if (input.attachment && input.attachment.size) {
    attachment = {
      name: input.attachment.name,
      type: input.attachment.type,
    };
    formData.append('attachment', input.attachment);
  }

  formData.append(
    'request',
    JSON.stringify({
      query: `mutation($input: AssignmentInput!) { createAssignment(input: $input) { id } }`,
      variables: {
        input: {
          ...input,
          attachment,
        },
      },
    }),
  );

  return axios.post(GRAPHQL_ENDPOINT, formData);
}

export function updateAssignment(id, input) {
  const formData = new FormData();

  let attachment;
  if (input.attachment && input.attachment.size) {
    attachment = {
      name: input.attachment.name,
      type: input.attachment.type,
    };
    formData.append('attachment', input.attachment);
  }

  formData.append(
    'request',
    JSON.stringify({
      query: `mutation($id: ID!, $input: AssignmentInput!) { updateAssignment(id: $id, input: $input) { id } }`,
      variables: {
        id,
        input: {
          ...input,
          attachment,
        },
      },
    }),
  );

  return axios.post(GRAPHQL_ENDPOINT, formData);
}

export function submitAssignmentWork(id, input) {
  const formData = new FormData();

  const attachments = {};

  if (input.assignmentWork) {
    input.assignmentWork.forEach(aw => {
      if (aw.attachment && aw.attachment.size > 0) {
        attachments[aw.requiredWorkId] = {
          name: aw.attachment.name,
          type: aw.attachment.type,
        };
        formData.append(aw.requiredWorkId, aw.attachment);
      }
    });
  }

  formData.append(
    'request',
    JSON.stringify({
      query: `mutation($id: ID!, $input: SubmitWorkInput!) { submitAssignmentWork(id: $id, input: $input) { id } }`,
      variables: {
        id,
        input: {
          ...input,
          assignmentWork: input.assignmentWork.map(aw => ({
            ...aw,
            attachment: attachments[aw.requiredWorkId],
          })),
        },
      },
    }),
  );

  return axios.post(GRAPHQL_ENDPOINT, formData);
}
