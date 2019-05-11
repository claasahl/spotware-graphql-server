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
  session: parent => parent.session,
  TYPE: parent => parent.TYPE
};
export default resolvers;
