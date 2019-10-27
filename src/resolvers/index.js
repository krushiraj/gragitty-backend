import { URLResolver } from 'graphql-scalars'

import userResolvers from './user'
import taskResolvers from './task'

const customScalarResolver = {
  URL: URLResolver
}

export default [
  customScalarResolver,
  userResolvers,
  taskResolvers
]
