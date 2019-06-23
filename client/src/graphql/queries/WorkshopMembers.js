import gql from 'graphql-tag';

export default gql`
  query WorkshopMembers($id: ID!) {
    workshop(id: $id) {
      id
      members {
        id
        firstName
        lastName
        fullName
        email
        avatar {
          publicId
        }
      }
    }
  }
`;
