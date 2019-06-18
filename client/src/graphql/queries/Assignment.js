import gql from 'graphql-tag';
import FullAssignment from 'graphql/fragments/FullAssignment';

export default gql`
  query Assignment($id: ID!) {
    assignment(id: $id) {
      ...FullAssignment
    }
  }
  ${FullAssignment}
`;
