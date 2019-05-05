import gql from 'graphql-tag';

import AssignmentList from 'graphql/fragments/AssignmentList';

export default gql`
  query WorkshopCompletedAssignments($id: ID!) {
    workshop($id: ID!) {
      id
      completedAssignments {
        ...AssignmentList
      }
    }
  }
  ${AssignmentList}
`;
