import { EventsResolvers } from "../generated/graphql";
import { Omit } from "../types";

const resolvers: Omit<EventsResolvers, "__resolveType"> = {};
export default resolvers;
