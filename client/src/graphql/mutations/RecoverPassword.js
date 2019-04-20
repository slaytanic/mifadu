import gql from 'graphql-tag';

export default gql`
  mutation RecoverPassword($email: String!) {
    recoverPassword(email: $email)
  }
`;
