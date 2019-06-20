import gql from 'graphql-tag';

import FullAssignment from 'graphql/fragments/FullAssignment';

export default gql`
  mutation DeleteAssignmentWork($id: ID!, $requiredWorkId: ID!, $assignmentWorkId: ID!) {
    deleteAssignmentWork(
      id: $id
      requiredWorkId: $requiredWorkId
      assignmentWorkId: $assignmentWorkId
    ) {
      ...FullAssignment
    }
  }
  ${FullAssignment}
`;
