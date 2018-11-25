import axios from 'axios';

import { GRAPHQL_ENDPOINT } from './common';

const defaultAssignmentFields = `
  fragment defaultAssignmentFields on Assignment {
    id
    name
    shortDescription
    endsAt
    statusTags
    workshop {
      id
      tutors {
        id
      }
    }
    completedWorksCount
    evaluatedWorksCount
    pendingEvaluationWorksCount
    completedBy {
      id
      fullName
    }
    usersWithoutEvaluations {
      id
      fullName
    }
    usersWithEvaluations {
      id
      fullName
    }
    evaluations {
      score1
      score2
      score3
      score4
      score5
      observations
      targetUser {
        id
      }
      user {
        id
      }
    }
  }
`;

const detailAssignmentFields = `
fragment detailAssignmentFields on Assignment {
  description
  requiredWork {
    id
    type
    description
    assignmentWork {
      id
      content
      attachment {
        name
        type
        url
        publicId
      }
    }
    assignmentWorks {
      id
      content
      attachment {
        name
        type
        url
        publicId
      }
      user {
        id
      }
    }
  }
  type
  tags {
    id
    name
  }
  evaluationVariable
  attachment {
    id
    type
    name
    url
  }
  selfEvaluation {
    score1
    score2
    score3
    score4
    score5
    observations
  }
}
`;

export function getMyAssignments() {
  return axios.post(GRAPHQL_ENDPOINT, {
    query: `
      query {
        myAssignments {
          ...defaultAssignmentFields
        }
      }
      ${defaultAssignmentFields}
    `,
  });
}

export function getAssignment(id) {
  return axios.post(GRAPHQL_ENDPOINT, {
    query: `
      query($id: ID!) {
        assignment(id: $id) {
          ...defaultAssignmentFields
          ...detailAssignmentFields
        }
      }
      ${defaultAssignmentFields}
      ${detailAssignmentFields}
    `,
    variables: {
      id,
    },
  });
}

export function getAssignmentWithWorks(id) {
  return axios.post(GRAPHQL_ENDPOINT, {
    query:
      'query($id: ID!) { assignment(id: $id) { id, name, shortDescription, description, requiredWork { id, type, description, assignmentWorks { id, user { id }, content, attachment { name, type, url } } }, endsAt, type, tags { id, name }, evaluationVariable, attachment { id, type, name, url }, evaluations { id, user { id }, targetUser { id }, score1, score2, score3, score4, score5, observations } } }',
    variables: {
      id,
    },
  });
}

export function getAssignments() {
  return axios.post(GRAPHQL_ENDPOINT, {
    query:
      'query { assignments { id, name, shortDescription, endsAt, workshop { tutors { id }} } }',
  });
}

export function getPendingAssignments() {
  return axios.post(GRAPHQL_ENDPOINT, {
    query:
      'query { pendingAssignments { id, name, shortDescription, endsAt, workshop { tutors { id }} } }',
  });
}

export function getPendingEvaluationAssignments() {
  return axios.post(GRAPHQL_ENDPOINT, {
    query:
      'query { pendingEvaluationAssignments { id, name, shortDescription, endsAt, requiredWork { assignmentWorks { user { id, firstName, lastName } } } } }',
  });
}

export function getCompletedAssignments() {
  return axios.post(GRAPHQL_ENDPOINT, {
    query:
      'query { completedAssignments { id, name, shortDescription, endsAt, workshop { tutors { id }} } }',
  });
}

export function getCompletedEvaluationAssignments() {
  return axios.post(GRAPHQL_ENDPOINT, {
    query:
      'query { completedEvaluationAssignments { id, name, shortDescription, endsAt, requiredWork { assignmentWorks { user { id, firstName, lastName } } } } }',
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
      query: `
        mutation($input: AssignmentInput!) {
          createAssignment(input: $input) {
            ...defaultAssignmentFields
            ...detailAssignmentFields
          }
        }
        ${defaultAssignmentFields}
        ${detailAssignmentFields}
      `,
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
      query: `
        mutation($id: ID!, $input: AssignmentInput!) {
          updateAssignment(id: $id, input: $input) {
            ...defaultAssignmentFields
            ...detailAssignmentFields
          }
        }
        ${defaultAssignmentFields}
        ${detailAssignmentFields}
      `,
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
      query: `
        mutation($id: ID!, $input: SubmitWorkInput!) {
          submitAssignmentWork(id: $id, input: $input) {
            ...defaultAssignmentFields
            ...detailAssignmentFields
          }
        }
        ${defaultAssignmentFields}
        ${detailAssignmentFields}
      `,
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

export function submitAssignmentSelfEvaluation(id, input) {
  return axios.post(GRAPHQL_ENDPOINT, {
    query: `
      mutation($id: ID!, $input: EvaluationInput!) {
        submitAssignmentSelfEvaluation(id: $id, input: $input) {
          ...defaultAssignmentFields
          ...detailAssignmentFields
        }
      }
      ${defaultAssignmentFields}
      ${detailAssignmentFields}
    `,
    variables: {
      id,
      input,
    },
  });
}

export function submitAssignmentEvaluation(id, input) {
  return axios.post(GRAPHQL_ENDPOINT, {
    query: `
      mutation($id: ID!, $input: SubmitAssignmentEvaluationInput!) {
        submitAssignmentEvaluation(id: $id, input: $input) {
          ...defaultAssignmentFields
          ...detailAssignmentFields
        }
      }
      ${defaultAssignmentFields}
      ${detailAssignmentFields}
    `,
    variables: {
      id,
      input,
    },
  });
}
