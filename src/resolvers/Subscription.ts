import { SubscriptionResolvers } from "../generated/graphql";

const resolvers: SubscriptionResolvers = {
  events: {
    subscribe: (_parent, _args, { pubsub }) => pubsub.asyncIterator("CHANGE ME")
  }
};
export default resolvers;
