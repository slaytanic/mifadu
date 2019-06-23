import gql from 'graphql-tag';

export default gql`
  fragment FullAssignment on Assignment {
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
      myAssignmentWorks {
        id
        content
        attachment {
          publicId
          secureUrl
        }
      }
    }
    selfEvaluation {
      score1
      score2
      score3
      score4
      score5
      observations
    }
    evaluation {
      score1
      score2
      score3
      score4
      score5
      observations
    }
    canEdit
  }
`;
