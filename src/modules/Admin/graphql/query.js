import { GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { UserType, CompanyType } from "./type.js";
import User from "./../../../DB/models/user/user.model.js";
import Company from "./../../../DB/models/company/company.model.js";

export const getAllData = {
  type: new GraphQLObjectType({
    name: "AllData",
    fields: {
      users: { type: new GraphQLList(UserType) },
      companies: { type: new GraphQLList(CompanyType) },
    },
  }),
  resolve: async () => {
    const users = await User.find().lean();
    const companies = await Company.find().lean();

    return {
      users: users.map((user) => ({ ...user, id: user._id.toString() })),
      companies: companies.map((company) => ({
        ...company,
        id: company._id.toString(),
      })),
    };
  },
};
