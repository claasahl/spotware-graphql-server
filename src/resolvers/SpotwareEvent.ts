import { SpotwareEventResolvers } from "../generated/graphql";
import EventResolvers from "./Event";

const resolvers: SpotwareEventResolvers = {
  ...EventResolvers,
  __resolveType: parent => {
    switch (parent.TYPE) {
      case "HeartbeatEvent":
      case "OpenApiVersionReq":
      case "OpenApiVersionRes":
        return parent.TYPE;
      default:
        return null;
    }
  },
  payloadType: parent => parent.payloadType,
  clientMsgId: parent => parent.clientMsgId
};
export default resolvers;
