import { EventsResolvers } from "../generated/graphql";

const resolvers: EventsResolvers = {
  __resolveType: parent => {
    switch (parent.type) {
      case "ConnectEvent":
      case "ConnectedEvent":
      case "DisconnectEvent":
      case "DisconnectedEvent":
        return parent.type;
      default:
        return null;
    }
  }
};
export default resolvers;
