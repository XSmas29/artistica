import gql from 'graphql-tag';

const profileInfo = gql`
  query profileInfo {
    profileInfo {
      id
      email
      first_name
      last_name
      phone
      createdAt
      is_verified
      isAdmin
      hash
    }
  }
`;

export default profileInfo;
