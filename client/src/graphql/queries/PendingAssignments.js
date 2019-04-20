import gql from 'graphql-tag';

import AssignmentList from 'graphql/fragments/AssignmentList';

export default gql`
  query PendingAssignments {
    me {
      pendingAssignments {
        ...AssignmentList
      }
    }
  }
  ${AssignmentList}
`;
