import gql from 'graphql-tag';

import AssignmentList from 'graphql/fragments/AssignmentList';

export default gql`
  query WorkshopAssignments($id: ID!, $status: String, $year: Int) {
    workshop(id: $id) {
      id
      tutors {
        id
      }
      assignments(status: $status, year: $year) {
        ...AssignmentList
      }
    }
  }
  ${AssignmentList}
`;
