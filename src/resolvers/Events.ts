import { EventsResolvers } from "../generated/graphql";

const resolvers: EventsResolvers = {
  __resolveType: parent => {
    switch (parent.TYPE) {
      case "ConnectEvent":
      case "ConnectedEvent":
      case "DisconnectEvent":
      case "DisconnectedEvent":
        return parent.TYPE;
      case "HeartbeatEvent":
      case "OpenApiVersionReq":
      case "OpenApiVersionRes":
        return parent.TYPE;
      default:
        return null;
    }
  }
};
export default resolvers;
