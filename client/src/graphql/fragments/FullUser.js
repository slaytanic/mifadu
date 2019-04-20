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
      workshop {
        id
        name
        memberCount
      }
      year
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
    tutoredWorkshops {
      id
      name
    }
    avatar {
      publicId
    }
  }
`;
