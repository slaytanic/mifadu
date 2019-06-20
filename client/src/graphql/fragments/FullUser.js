import gql from 'graphql-tag';

export default gql`
  fragment FullUser on User {
    id
    firstName
    lastName
    fullName
    completedProfile
    acceptedTerms
    receiveNews
    idNumber
    email
    workshop {
      id
    }
    workshops {
      id
      name
      memberCount
      year
      isTutor
      pendingAssignmentCount
      completedAssignmentCount
    }
    subjects {
      id
    }
    updatedAt
    createdAt
    previouslyOnThisChair
    previousYearOnThisChair
    website
    aboutMe
    avatar {
      publicId
    }
  }
`;
