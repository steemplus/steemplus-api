const premium = require("../../controllers/api/premium.js");
const path = require('path')

const utils = require("../../utils.js");

const premiumFeatureRouter = function(app) {
  // @parameter permlink : permlink of the post
  // The post is select by {permlink, author} because permlink can be the same for different authors.
  app.get("/premium/pixel/:name", async function(req, res) {
    res
      .status(200)
      .send(await premium.createPixel(req.params.name));
  });

  app.get("/premium/pixel/:name", async function(req, res) {
    res
      .status(200)
      .sendFile(path.join(__dirname, '../../public',await premium.getPixel(req.params.name)));
  });
};

module.exports = premiumFeatureRouter;
