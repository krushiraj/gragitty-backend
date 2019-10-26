import { combineResolvers } from "graphql-resolvers";
import { AuthenticationError, UserInputError } from "apollo-server";

import { isSelfDeleteAuth, isAuthenticated } from "./userization";

export default {
  Query: {
    allTasks: async (parent, args, { models, loggedInUser }) => {
      if (!loggedInUser) throw AuthenticationError();

      const allTasks = await models.Task.find({
        where: {
          userId: loggedInUser.id
        }
      });
      return allTasks;
    },
    task: async (parent, { id }, { models }) => {
      if (!loggedInUser) throw AuthenticationError();

      return await models.Task.findByPk(id);
    },
    completedTasks: async (parent, args, { models, loggedInUser }) => {
      if (!loggedInUser) throw AuthenticationError();

      return await models.Task.find({
        where: {
          userId: loggedInUser.id,
          completed: true
        }
      });
    },
    scheduledTasks: async (parent, args, { models, loggedInUser }) => {
      if (!loggedInUser) throw AuthenticationError();

      return await models.Task.find({
        where: {
          userId: loggedInUser.id,
          completed: false
        }
      });
    }
  },

  Mutation: {
    createTask: combineResolvers(
      isAuthenticated,
      async (parent, args, { models, loggedInUser }) => {
        return await models.Task.create({ ...args, userId: loggedInUser.id });
      }
    ),

    updateTask: combineResolvers(
      isAuthenticated,
      async (parent, args, { models, loggedInUser }) => {
        const task = await models.Task.findByPk(args.id);
        return await task.update({ ...args, userId: loggedInUser.id });
      }
    ),

    deleteTask: combineResolvers(
      isSelfDeleteAuth,
      async (parent, { id }, { models }) => {
        return await !!models.Task.destroy({
          where: { id }
        });
      }
    )
  },

  Task: {
    user: async (user, args, { models, loggedInUser }) => {
      return await models.User.findByPk(loggedInUser.id);
    }
  }
};
