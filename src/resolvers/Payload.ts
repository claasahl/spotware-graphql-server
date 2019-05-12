import { PayloadResolvers } from "../generated/graphql";
import { Omit } from "../types";

const resolvers: Omit<PayloadResolvers, "__resolveType"> = {};

export default resolvers;
