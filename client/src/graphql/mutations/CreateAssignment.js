import gql from 'graphql-tag';

export default gql`
  mutation CreateAssignment($input: AssignmentInput!) {
    createAssignment(input: $input) {
      id
    }
  }
`;
