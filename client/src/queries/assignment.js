import gql from 'graphql-tag';

const ASSIGNMENT = gql`
  query($id: ID!) {
    assignment(id: $id) {
      myGroup {
        number
      }
    }
  }
`;

export default ASSIGNMENT;
