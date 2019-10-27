import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    allUsers: [User]!
    userById(id: ID!): User
    userByUsername(username: String!): User
    userByEmail(email: String!): User
    currentUser: User
  }

  extend type Mutation {
    updateUser(
      email: String
      name: String
      username: String
      profilePic: URL
      gitProfile: URL
    ): User!

    deleteUser(id: ID!): Boolean!
  }

  type User {
    id: ID!

    name: String!
    email: String
    username: String!
    profilePic: URL!
    gitProfile: URL!
  }
`;
