import gql from 'graphql-tag';

import FullUser from 'graphql/fragments/FullUser';

export default gql`
  mutation ResetPassword($password: String!, $recoveryToken: String!) {
    resetPassword(password: $password, recoveryToken: $recoveryToken) {
      ...FullUser
    }
  }
  ${FullUser}
`;
