import { EventResolvers } from "../generated/graphql";

const resolvers: EventResolvers = {
  __resolveType: parent => {
    switch (parent.TYPE) {
      case "ConnectEvent":
      case "ConnectedEvent":
      case "DisconnectEvent":
      case "DisconnectedEvent":
        return parent.TYPE;
      default:
        return null;
    }
  },
  SESSION: parent => parent.SESSION,
  TYPE: parent => parent.TYPE
};
export default resolvers;
