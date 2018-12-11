
const PremiumFeature = require("../../models/premiumFeature.js");
const SubscriptionPremium = require("../../models/subscriptionPremium.js");
const User = require("../../models/user.js");
const fs = require('fs');
const imgGen = require('js-image-generator');

exports.getFeatureList = async function() {
	return await PremiumFeature.find({}, {'name':1, 'price':1, 'description':1, '_id':0}, function (err, docs) {
		return docs;
	});
}

exports.getUserFeatures = async function(username) {
	return await User.findOne({"accountName": username}, {'activeSubscriptions':1 ,'_id':0})
		.populate({
			path: "activeSubscriptions", 
			select: "-_id -user -__v", 
			populate: {path: "premiumFeature", select: "-_id -__v"}
		})
}

// Create a pixel for user's post stats
exports.createPixel = async function(name) {
	imgGen.generateImage(1, 1, 1, function(err, image) {
	    fs.writeFileSync(`public/${name}.jpg`, image.data);
	});
}

exports.getPixel = async function(name, source) {
	console.log(source);
	return `${name}.jpg`;
}