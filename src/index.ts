import { ApolloServer, gql, IResolvers } from 'apollo-server-micro'
import { importSchema } from 'graphql-import'
import { GQLAddress, GQLResolver } from 'src-gen/schema'

const schema = importSchema('schema.graphql')
const typeDefs = gql`${schema}`

const resolvers = {
    Query: {
        randomAddress: (): GQLAddress => {
            return {
                id: 'xyz',
                name: 'Totoro'
            }
        }
    }
} as GQLResolver & IResolvers

const apolloServer = new ApolloServer({ typeDefs, resolvers })
module.exports = apolloServer.createHandler()