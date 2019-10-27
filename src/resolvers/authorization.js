import { ForbiddenError } from 'apollo-server';
import { combineResolvers, skip } from 'graphql-resolvers';
import models from '../models'

export const isAuthenticated = (parent, args, { loggedInUser }) =>
  loggedInUser ? skip : new ForbiddenError('Not authenticated as user.');

export const isSelfTaskDeleteAuth = combineResolvers(
  isAuthenticated,
  async (parent, { id }, { loggedInUser }) => {
    const task = await models.Task.findByPk(id)
    return (
      task.userId === loggedInUser.id
      ? skip
      : new ForbiddenError('Not authorized to delete.')
    )
  }
)

export const isSelfDeleteAuth = combineResolvers(
  isAuthenticated,
  async (parent, { id }, { loggedInUser }) => {
    return (
      id === loggedInUser.id
      ? skip
      : new ForbiddenError('Not authorized to delete.')
    )
  }
)