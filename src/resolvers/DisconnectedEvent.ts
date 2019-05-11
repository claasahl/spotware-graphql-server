import { DisconnectedEventResolvers } from "../generated/graphql";
import EventResolvers from "./Event";

const resolvers: DisconnectedEventResolvers = {
  ...EventResolvers
};
export default resolvers;
