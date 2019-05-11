import { OpenApiVersionResResolvers } from "../generated/graphql";
import SpotwareEventResolvers from "./SpotwareEvent";

const resolvers: OpenApiVersionResResolvers = {
  ...SpotwareEventResolvers,
  version: parent => parent.version
};
export default resolvers;
