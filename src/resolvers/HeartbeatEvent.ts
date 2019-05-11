import { HeartbeatEventResolvers } from "../generated/graphql";
import SpotwareEventResolvers from "./SpotwareEvent";

const resolvers: HeartbeatEventResolvers = {
  ...SpotwareEventResolvers
};
export default resolvers;
