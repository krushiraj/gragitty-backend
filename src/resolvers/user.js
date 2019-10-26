import { combineResolvers } from 'graphql-resolvers'
import { AuthenticationError, UserInputError } from 'apollo-server'

import { isSelfDeleteAuth, isAuthenticated } from './authorization'

export default {
  Query: {
    allUsers: async (parent, args, { models }) => {
      const allUsers = await models.User.findAll()
      return allUsers
    },
    userById: async (parent, { id }, { models }) => {
      return await models.User.findByPk(id)
    },
    userByEmail: async (parent, { email }, { models }) => {
      return await models.User.findOne({
        where: {
          email
        }
      })
    },
    currentUser: async (parent, args, { models, loggedInUser }) => {
      if (!loggedInUser) {
        return null;
      }

      return loggedInUser;
    }
  },

  Mutation: {
    updateUser: combineResolvers(
      isAuthenticated,
      async (parent, args, { models, loggedInUser }) => {
        const user = await models.User.findByPk(loggedInUser.id);
        return await user.update({ ...args });
      }
    ),

    deleteUser: combineResolvers(
      isSelfDeleteAuth,
      async (parent, { id }, { models }) => {
        return await models.User.destroy({
          where: { id }
        });
      }
    )
  }
};
