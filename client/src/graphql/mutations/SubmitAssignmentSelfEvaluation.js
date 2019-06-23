import gql from 'graphql-tag';

import FullAssignment from 'graphql/fragments/FullAssignment';

export default gql`
  mutation SubmitAssignmentSelfEvaluation($id: ID!, $input: EvaluationInput!) {
    submitAssignmentSelfEvaluation(id: $id, input: $input) {
      ...FullAssignment
    }
  }
  ${FullAssignment}
`;
