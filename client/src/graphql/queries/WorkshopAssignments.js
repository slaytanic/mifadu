import gql from 'graphql-tag';

import AssignmentList from 'graphql/fragments/AssignmentList';

export default gql`
  query WorkshopAssignments($id: ID!, $status: AssignmentStatus) {
    workshop(id: $id) {
      id
      assignments(status: $status) {
        ...AssignmentList
      }
      isTutor
    }
  }
  ${AssignmentList}
`;
