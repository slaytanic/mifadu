import gql from 'graphql-tag';

export default gql`
  mutation CreateAvatar($file: Upload!) {
    createAvatar(file: $file) {
      id
      publicId
    }
  }
`;
