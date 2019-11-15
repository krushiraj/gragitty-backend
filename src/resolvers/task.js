import { combineResolvers } from "graphql-resolvers";
import { AuthenticationError } from "apollo-server";

import { isSelfTaskDeleteAuth, isAuthenticated } from "./authorization";

export default {
  Query: {
    allTasks: async (parent, { userId }, { models, loggedInUser }) => {
      if (!userId && !loggedInUser) throw new AuthenticationError();

      const allTasks = await models.Task.findAll({
        where: {
          userId: userId || loggedInUser.id
        }
      });
      return allTasks;
    },
    task: async (parent, { id }, { models }) => {
      return await models.Task.findByPk(id);
    },
    completedTasks: async (parent, { userId }, { models, loggedInUser }) => {
      if (!userId && !loggedInUser) throw new AuthenticationError();

      return await models.Task.findAll({
        where: {
          userId: userId || loggedInUser.id,
          completed: true
        }
      });
    },
    scheduledTasks: async (parent, { userId }, { models, loggedInUser }) => {
      if (!userId && !loggedInUser) throw new AuthenticationError();

      return await models.Task.findAll({
        where: {
          userId: userId || loggedInUser.id,
          completed: false
        }
      });
    }
  },

  Mutation: {
    createTask: combineResolvers(
      isAuthenticated,
      async (parent, args, { models, loggedInUser }) => {
        // console.log({
        //   loggedInUser,
        //   userId: args.userId ? args.userId : loggedInUser.id
        // });
        return await models.Task.create({
          ...args,
          userId: (args.userId ? args.userId : loggedInUser.id)
        });
      }
    ),

    updateTask: combineResolvers(
      isAuthenticated,
      async (parent, args, { models, loggedInUser }) => {
        // const task = await models.Task.findByPk(args.id);
        // console.log(parent)
        let userId = parent.userId
        if (userId !== args.userId) {
          if (args.userId) {
            userId = args.userId
          } else {
            userId = loggedInUser.id
          }
        }
        return await parent.update({
          ...args,
          userId
        });
      }
    ),

    deleteTask: combineResolvers(
      isSelfTaskDeleteAuth,
      async (parent, { id }, { models }) => {
        return await !!models.Task.destroy({
          where: { id }
        });
      }
    )
  },

  Task: {
    user: async (parent, args, { models }) => {
      return await models.User.findByPk(parent.userId);
    }
  }
};
