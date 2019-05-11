import { DisconnectEventResolvers } from "../generated/graphql";
import EventResolvers from "./Event";

const resolvers: DisconnectEventResolvers = {
  ...EventResolvers
};
export default resolvers;
