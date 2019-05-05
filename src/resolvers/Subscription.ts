import { SubscriptionResolvers } from "../generated/graphql";

const resolvers: SubscriptionResolvers = {
  events: {
    subscribe: (_parent, _args, { clients }) =>
      clients.pubsub.asyncIterator("CHANGE ME")
  }
};
export default resolvers;
