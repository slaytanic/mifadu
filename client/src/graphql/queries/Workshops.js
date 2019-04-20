import gql from 'graphql-tag';

export default gql`
  query Workshops {
    workshops {
      id
      name
    }
  }
`;
