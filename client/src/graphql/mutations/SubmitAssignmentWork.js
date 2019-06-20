import gql from 'graphql-tag';

import FullAssignment from 'graphql/fragments/FullAssignment';

export default gql`
  mutation SubmitAssignmentWork($id: ID!, $requiredWorkId: ID!, $input: AssignmentWorkInput!) {
    submitAssignmentWork(id: $id, requiredWorkId: $requiredWorkId, input: $input) {
      ...FullAssignment
    }
  }
  ${FullAssignment}
`;
