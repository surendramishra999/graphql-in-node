const { nodeEnv } = require("./util");
const ncSchema = require("./../schema");
const { graphql } = require("graphql");
const Dataloader = require("dataloader");
const pg = require("pg");
const pgConfig = require("../config/pg")[nodeEnv];

const pgPool = new pg.Pool(pgConfig);
const pgdb = require("./../database/pgdb")(pgPool);
const mdb = require("./../database/mdb");

pgPool.on("error", function(err, client) {
  console.error("idle client error", err.message, err.stack);
  process.exit(-1);
});

const express = require("express");
const graphqlHTTP = require("express-graphql");

const { MongoClient, Logger } = require("mongodb");

const mongoConfig = require("../config/mongo")[nodeEnv];
const assert = require("assert");

MongoClient.connect(mongoConfig.url, (err, mPool) => {
  const app = express();
  assert.equal(err, null);
  Logger.setLevel("debug");
  Logger.filter("class", ["Server"]);
  app.use("/graphql", (req, res) => {
    const loaders = {
      usersByIds: new Dataloader(pgdb.getUsersByIds),
      usersByApiKeys: new Dataloader(pgdb.getUsersByAPIkeys),
      contestsByCreatedByUsers: new Dataloader(
        pgdb.getContestsByCreatedByUsers
      ),
      namesListByContestIds: new Dataloader(pgdb.getNamesListByContestIds),
      activitiesForUserIds: new Dataloader(pgdb.getActivitiesForUserIds),
      userTotalVotes: new Dataloader(pgdb.getusersTotalVotes),

      mdb: {
        usersbyUserId: new Dataloader(mdb(mPool).getUsersbyUserId)
      }
    };
    graphqlHTTP({
      schema: ncSchema,
      graphiql: true,
      context: { pgPool, mPool, loaders }
    })(req, res);
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`http server is running. listning port ${PORT}`);
    console.log(`Running in ${nodeEnv} mode...`);
  });
});
