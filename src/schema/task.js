import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    allTasks(): [Task]!
    completedTasks(): [Task]!
    scheduledTasks(): [Task]!
    task(id: ID!): Task
  }

  extend type Mutation {
    createTask(
      message: String!
      color: Integer!
      type: Integer
      date: DateTime
      completed: Boolean
      userId: ID!
    ): Task!

    updateTask(
      message: String
      color: Integer
      type: Integer
      date: DateTime
      completed: Boolean
      userId: ID
    ): Task!

    deleteTask(id: ID!): Boolean!
  }

  type Task {
    id: ID!

    message: String!
    color: Integer!
    type: String!
    date: DateTime!
    completed: Boolean!

    user: User!
  }
`;
