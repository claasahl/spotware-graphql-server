import { SubscriptionResolvers } from "../generated/graphql";

const resolvers: SubscriptionResolvers = {
  events: {
    subscribe: (_parent, _args, { pubsub }) => {
      const channel = "CHANGE ME";
      const types = [
        "ConnectEvent",
        "ConnectedEvent",
        "DisconnectEvent",
        "DisconnectedEvent"
      ];
      let i = 0;
      setInterval(
        () => pubsub.publish(channel, { events: { type: types[i++ % 4] } }),
        1000
      );
      return pubsub.asyncIterator(channel);
    }
  }
};
export default resolvers;
