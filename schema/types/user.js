const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt
} = require("graphql");

const ContestType = require("./contest");
const ActivityType = require("./activity");

module.exports = new GraphQLObjectType({
  name: "user",
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    email: { type: new GraphQLNonNull(GraphQLString) },
    contests: {
      type: new GraphQLList(ContestType),
      resolve(obj, args, { loaders }) {
        return loaders.contestsByCreatedByUsers.load(obj.id);
      }
    },
    contestsCount: {
      type: GraphQLInt,
      resolve(obj, args, { loaders }, { fieldName }) {
        return loaders.mdb.usersbyUserId
          .load(obj.id)
          .then(result => result[fieldName]);
      }
    },
    namesCount: {
      type: GraphQLInt,
      resolve(obj, args, { loaders }, { fieldName }) {
        return loaders.mdb.usersbyUserId
          .load(obj.id)
          .then(result => result[fieldName]);
      }
    },
    votesCount: {
      type: GraphQLInt,
      resolve(obj, args, { loaders }, { fieldName }) {
        return loaders.mdb.usersbyUserId
          .load(obj.id)
          .then(result => result[fieldName]);
      }
    },
    activities: {
      type: new GraphQLList(ActivityType),
      resolve(obj, args, { loaders }) {
        return loaders.activitiesForUserIds.load(obj.id);
      }
    }
  })
});
