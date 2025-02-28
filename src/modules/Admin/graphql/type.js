import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean } from "graphql";

export const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    mobileNumber: { type: GraphQLString },
    DOB: { type: GraphQLString }, 
    role: { type: GraphQLString }, 
    isConfirmed: { type: GraphQLBoolean },
    bannedAt: { type: GraphQLBoolean },
  },
});

export const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: {
    id: { type: GraphQLID },
    companyName: { type: GraphQLString },
    companyEmail: { type: GraphQLString },
    description: { type: GraphQLString },
    industry: { type: GraphQLString },
    address: { type: GraphQLString },
    numberOfEmployees: { type: GraphQLString },
    approvedByAdmin: { type: GraphQLBoolean },
  },
});