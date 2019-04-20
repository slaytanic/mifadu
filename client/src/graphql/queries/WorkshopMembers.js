import gql from 'graphql-tag';

export default gql`
  query WorkshopMembers($id: ID!) {
    workshop(id: $id) {
      id
      members {
        id
        firstName
        lastName
        email
        avatar {
          publicId
        }
      }
    }
  }
`;
