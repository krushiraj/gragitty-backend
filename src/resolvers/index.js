import { DateTimeResolver, URLResolver } from 'graphql-scalars'

import userResolvers from './user'
import taskResolvers from './task'

const customScalarResolver = {
  DateTime: DateTimeResolver,
  URL: URLResolver
}

export default [
  customScalarResolver,
  userResolvers,
  taskResolvers
]
