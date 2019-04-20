import gql from 'graphql-tag';

import FullUser from 'graphql/fragments/FullUser';

export default gql`
  query Me {
    me {
      ...FullUser
    }
  }
  ${FullUser}
`;
