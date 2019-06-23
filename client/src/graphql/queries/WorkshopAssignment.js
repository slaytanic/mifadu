import gql from 'graphql-tag';

export default gql`
  query WorkshopAssignment($id: ID!, $userId: ID!) {
    assignment(id: $id) {
      id
      name
      statusTags
      shortDescription
      description
      attachment {
        filename
        secureUrl
      }
      endsAt
      evaluationVariable
      type
      tags {
        id
        name
      }
      requiredWork {
        id
        type
        description
        assignmentWorks(userId: $userId) {
          id
          content
          attachment {
            publicId
            secureUrl
          }
        }
      }
      selfEvaluation(userId: $userId) {
        score1
        score2
        score3
        score4
        score5
        observations
      }
      evaluation(userId: $userId) {
        score1
        score2
        score3
        score4
        score5
        observations
      }
      canEdit
    }
  }
`;
