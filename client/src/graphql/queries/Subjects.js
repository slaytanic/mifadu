import gql from 'graphql-tag';

export default gql`
  query Subjects {
    subjects {
      id
      name
    }
  }
`;
