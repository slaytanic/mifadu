import gql from 'graphql-tag';

import FullAssignment from 'graphql/fragments/FullAssignment';

export default gql`
  mutation SubmitAssignmentEvaluation($id: ID!, $targetUser: ID!, $input: EvaluationInput!) {
    submitAssignmentEvaluation(id: $id, targetUser: $targetUser, input: $input) {
      ...FullAssignment
    }
  }
  ${FullAssignment}
`;
