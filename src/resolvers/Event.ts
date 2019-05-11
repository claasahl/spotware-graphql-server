import { EventResolvers } from "../generated/graphql";

const resolvers: EventResolvers = {
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
  },
  session: parent => parent.session,
  type: parent => parent.type
};
export default resolvers;
