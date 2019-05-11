import { SpotwareEventResolvers } from "../generated/graphql";
import EventResolvers from "./Event";

const resolvers: SpotwareEventResolvers = {
  ...EventResolvers,
  __resolveType: parent => {
    switch (parent.type) {
      case "HeartbeatEvent":
      case "OpenApiVersionReq":
      case "OpenApiVersionRes":
        return parent.type;
      default:
        return null;
    }
  },
  clientMsgId: parent => parent.clientMsgId
};
export default resolvers;
