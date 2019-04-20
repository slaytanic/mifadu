import gql from 'graphql-tag';

import FullUser from 'graphql/fragments/FullUser';

export default gql`
  mutation CreateOrUpdateUser($input: UserInput!) {
    createOrUpdateUser(input: $input) {
      ...FullUser
    }
  }
  ${FullUser}
`;
