import { GraphQLSchema, GraphQLObjectType } from "graphql";
import { getAllData } from "./query.js";

const RootQuery = new GraphQLObjectType({
  name: "Query",
  fields: {
    getAllData,
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
});
