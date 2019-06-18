import gql from 'graphql-tag';
import FullAssignment from 'graphql/fragments/FullAssignment';

export default gql`
  mutation UpdateAssignment($id: ID!, $input: AssignmentInput!) {
    updateAssignment(id: $id, input: $input) {
      ...FullAssignment
    }
  }
  ${FullAssignment}
`;
