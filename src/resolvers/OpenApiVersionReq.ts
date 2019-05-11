import { OpenApiVersionReqResolvers } from "../generated/graphql";
import SpotwareEventResolvers from "./SpotwareEvent";

const resolvers: OpenApiVersionReqResolvers = {
  ...SpotwareEventResolvers
};
export default resolvers;
