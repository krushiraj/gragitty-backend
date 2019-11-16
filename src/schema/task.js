import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    allTasks(userId: ID): [Task]!
    completedTasks(userId: ID): [Task]!
    scheduledTasks(userId: ID): [Task]!
    task(id: ID!): Task
  }

  extend type Mutation {
    createTask(
      message: String
      color: String
      type: String
      date: String!
      completed: Boolean
      userId: ID
    ): Task!

    updateTask(
      message: String
      color: String
      type: String
      date: String
      completed: Boolean
      userId: ID
    ): Task!

    deleteTask(id: ID!): Boolean!
  }

  type Task {
    id: ID!

    message: String!
    color: String!
    type: String!
    date: String!
    completed: Boolean!
    createdAt: String

    user: User!
  }
`;
