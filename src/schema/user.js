import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    allUsers: [User!]
    userById(id: ID!): User
    userByEmail(email: String!): User
    currentUser: User
  }

  extend type Mutation {
    signUp(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    ): Token!

    signIn(email: String!, password: String!): Token!

    updateUser(
      email: String!,
      name: String!,
      profile_pic: URL!
    ): User!

    deleteUser(id: ID!): Boolean!
  }

  type Token {
    token: String!
  }

  type User {
    id: ID!

    firstName: String!
    lastName: String!
    email: String!
    contactNo: String
    profilePic: URL!
  }
`
