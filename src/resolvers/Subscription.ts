import { SubscriptionResolvers } from "../generated/graphql";

const resolvers: SubscriptionResolvers = {
  events: {
    subscribe: (_parent, _args, { sessionId, clients }) =>
      clients.pubsub.asyncIterator(sessionId)
  }
};
export default resolvers;
