import { DisconnectEventResolvers } from "../generated/graphql";
import EventResolvers from "./Event";

const resolvers: DisconnectEventResolvers = {
  ...EventResolvers,
  type: parent => parent.type
};
export default resolvers;
