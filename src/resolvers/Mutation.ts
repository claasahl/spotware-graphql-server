import { MutationResolvers } from "../generated/graphql";

const resolvers: MutationResolvers = {
  connect: (_parent, { host, port }, { pubsub }) => {
    const event = {
      type: "ConnectEvent",
      host: host || "live.ctraderapi.com",
      port: port || 5035
    };
    pubsub.publish("CHANGE ME", { events: event });
    return event;
  },
  disconnect: (_parent, _args, { pubsub }) => {
    const event = {
      type: "DisconnectEvent"
    };
    pubsub.publish("CHANGE ME", { events: event });
    return event;
  }
};
export default resolvers;
