import gql from 'graphql-tag';

const ASSIGN_USER_TO_GROUP = gql`
  mutation($assignmentId: ID!, $number: Int!) {
    assignUserToGroup(assignmentId: $assignmentId, number: $number) {
      myGroup {
        number
      }
    }
  }
`;

export default ASSIGN_USER_TO_GROUP;
