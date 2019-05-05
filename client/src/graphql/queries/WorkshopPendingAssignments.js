import gql from 'graphql-tag';

import AssignmentList from 'graphql/fragments/AssignmentList';

export default gql`
  query WorkshopPendingAssignments($id: ID!) {
    workshop(id: $id) {
      id
      pendingAssignments {
        ...AssignmentList
      }
    }
  }
  ${AssignmentList}
`;
