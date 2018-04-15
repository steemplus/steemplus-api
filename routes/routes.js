let config=require("../config");
let sql=require("mssql");


var appRouter = function (app) {

  app.get("/", function(req, res) {
    res.status(200).send("Welcome to our restful API!");
  });

  app.get("/api/get-mentions/:username", function(req, res){
    console.log(config.config_api);
    sql.connect(config.config_api).then(pool => {
      console.log("connected");
      return pool.request()
      .input("username","@"+req.params.username)
      .query('SELECT TOP 10 created, permlink, title, author, LEFT(body,250) AS body,category, parent_author\
      FROM Comments (NOLOCK)\
      WHERE CONTAINS(body, @username)\
      ORDER BY created DESC\
      ')
    }).then(result => {
      res.status(200).send(result.recordsets[0]);
      sql.close();
    }).catch(error => {console.log(error);
      sql.close();});
});

app.get("/api/get-witness/:username", function(req, res){
  console.log(config.config_api);
  sql.connect(config.config_api).then(pool => {
    console.log("connected");
    return pool.request()
    .input("username",req.params.username)
    .query('SELECT B.timestamp as lastBlockTimestamp, rankedTable.*\
    FROM (SELECT ROW_NUMBER() OVER (ORDER BY (SELECT votes) DESC) AS rank, * FROM Witnesses (NOLOCK) WHERE signing_key != \'STM1111111111111111111111111111111114T1Anm\') AS rankedTable, Blocks B\
    WHERE B.block_num = rankedTable.last_confirmed_block_num\
    AND name = @username')
  }).then(result => {
    res.status(200).send(result.recordsets[0][0]);
    sql.close();
  }).catch(error => {console.log(error);
  sql.close();});
});

}

module.exports = appRouter;