import gql from 'graphql-tag';

import AssignmentList from 'graphql/fragments/AssignmentList';

export default gql`
  query CompletedAssignments {
    me {
      completedAssignments {
        ...AssignmentList
      }
    }
  }
  ${AssignmentList}
`;
