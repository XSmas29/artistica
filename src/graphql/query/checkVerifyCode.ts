import gql from 'graphql-tag';

const checkVerifyCode = gql`
  query checkVerifyCode($code: String!) {
    checkVerifyCode(code: $code) {
      id
      email
      hash
    }
  }
`;

export default checkVerifyCode;