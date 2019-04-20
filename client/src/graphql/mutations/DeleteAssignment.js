import gql from 'graphql-tag';

export default gql`
  mutation DeleteAssignment($id: ID!) {
    deleteAssignment(id: $id) {
      id
    }
  }
`;
