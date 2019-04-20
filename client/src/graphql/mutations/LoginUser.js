import gql from 'graphql-tag';

import FullUser from 'graphql/fragments/FullUser';

export default gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      ...FullUser
    }
  }
  ${FullUser}
`;
