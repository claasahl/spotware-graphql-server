import { SpotwareMessageEventResolvers } from "../generated/graphql";
import EventResolvers from "./Event";

const resolvers: SpotwareMessageEventResolvers = {
  ...EventResolvers,
  type: parent => parent.type,
  payloadType: parent => parent.payloadType,
  payload: parent => parent.payload,
  clientMsgId: parent => parent.clientMsgId
};
export default resolvers;
