import gql from 'graphql-tag';

export default gql`
  mutation CreateTag($input: TagInput!) {
    createTag(input: $input) {
      id
      name
    }
  }
`;
