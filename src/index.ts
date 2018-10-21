import { ApolloServer, gql, IResolvers } from 'apollo-server-micro'
import { importSchema } from 'graphql-import'
import { GQLAddress, GQLResolver, MutationToCreateAddressArgs } from './schema'
import { GraphQLResolveInfo } from 'graphql'
import uuid = require('uuid')

const schema = importSchema('src/schema/schema.graphql')
const typeDefs = gql`${schema}`

const addressDatabase: Map<string, GQLAddress> = new Map<string, GQLAddress>()

const resolvers = {
    Query: {
        randomAddress: (): GQLAddress => {
            const allAddresses = Array.from(addressDatabase.values())
            return allAddresses[Math.floor(Math.random() * allAddresses.length)]
        }
    },
    Mutation: {
        createAddress: (parent: any, args: MutationToCreateAddressArgs, context: any, info: GraphQLResolveInfo): GQLAddress => {
            if (args && args.input) {
                const address: GQLAddress = {
                    id: uuid(),
                    name: args.input.name
                }

                addressDatabase.set(address.id, address)

                return address
            } else {
                throw new Error('Mutation \'createAddress\' is missing input arguments')
            }
        }
    }
} as GQLResolver & IResolvers

const apolloServer = new ApolloServer({ typeDefs, resolvers })
module.exports = apolloServer.createHandler()
