const { orderedFor, slug } = require("./../lib/util");
const humps = require("humps");

module.exports = pgPool => {
  return {
    getUsersByAPIkeys(apiKeys) {
      return pgPool
        .query("Select * FROM users WHERE api_key=ANY($1)", [apiKeys])
        .then(res => {
          return orderedFor(res.rows, apiKeys, "apiKey");
        })
        .catch(err => {
          return { id: 667778, email: "somthing@went.wrong" };
        });
    },
    getusersTotalVotes(ids) {
      return pgPool
        .query("Select * FROM total_view_by_name WHERE name_id=ANY($1)", [ids])
        .then(res => {
          return orderedFor(res.rows, ids, "nameId");
        });
    },
    addNewContest({ apiKey, title, description }) {
      return pgPool
        .query(
          `
       INSERT INTO contests(code,title,description,created_by)
       values($1,$2,$3,(SELECT id from users WHERE api_key=$4))
       returning *
       `,
          [slug(title), title, description, apiKey]
        )
        .then(res => {
          return humps.camelizeKeys(res.rows[0]);
        });
    },

    addNewName({ apiKey, contestId, label, description }) {
      return pgPool
        .query(
          `
     INSERT INTO names(contest_id,label,normalized_label,description,created_by)
     values($1,$2,$3,$4,(SELECT id from users WHERE api_key=$5))
     returning *
     `,
          [contestId, label, slug(label), description, apiKey]
        )
        .then(res => {
          return pgPool
            .query(
              `INSERT INTO votes(name_id,up,created_by)values($1,$2,(SELECT id from users WHERE api_key=$3))returning *`,
              [res.rows[0]["id"], true, apiKey]
            )
            .then(res2 => {
              return humps.camelizeKeys(res.rows[0]);
            });
          //return humps.camelizeKeys(res.rows[0]);
        });
    },
    getUsersByIds(ids) {
      return pgPool
        .query("Select * FROM users WHERE id=ANY($1)", [ids])
        .then(res => {
          return orderedFor(res.rows, ids, "id");
        })
        .catch(err => {
          return { id: 667778, email: "somthing@went.wrong" };
        });
    },

    getContestsByCreatedByUsers(users) {
      return pgPool
        .query("Select * FROM contests WHERE created_by=ANY($1)", [users])
        .then(res => {
          return orderedFor(res.rows, users, "createdBy", false);
          // return humps.camelizeKeys(res.rows);
        })
        .catch(err => {
          return { id: 667778, email: "somthing@went.wrong" };
        });
    },
    getNamesListByContestIds(contestIds) {
      return pgPool
        .query("Select * FROM names WHERE contest_id=ANY($1)", [contestIds])
        .then(res => {
          return orderedFor(res.rows, contestIds, "contestId", false);
          //return humps.camelizeKeys(res.rows);
        })
        .catch(err => {
          return { id: 667778, email: "somthing@went.wrong" };
        });
    },
    getActivitiesForUserIds(ids) {
      return pgPool
        .query(
          `
        SELECT created_by, created_at, label,'' as title,'name' as activity_type
         FROM names WHERE created_by=ANY($1)
        UNION 
        SELECT  created_by, created_at, '' as label, title,'contest' as activity_type
        FROM contests WHERE created_by=ANY($1)
      `,
          [ids]
        )
        .then(res => {
          return orderedFor(res.rows, ids, "createdBy", false);
        });
    }
  };
};
