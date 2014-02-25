var fbgraph = require('fbgraph'),
	async 	= require('async');

var fbKeys = {
    appId:      'YOUR APP ID'
  , appSecret:  'YOUR APP SECRET'
};

var accessToken = fbKeys.appId + '|' + fbKeys.appSecret;

function FacebookSearch(keywords) {

	var removeMilliseconds = function(timestampNum) {
		var timestamp = timestampNum.toString();
		var charsToReturn = timestamp.length - 3;

		return timestamp.substr(0, charsToReturn);
	}

	var parseFacebookData = function(data, keyword, callback) {
		var parsedData = [];

		var processData = function(postObj, cb) {
			var userPostIds = postObj.id.split('_'),
				userId = userPostIds[0],
				postId = userPostIds[1];

			fbgraph.get(userId, {fields: 'username'}, function(err, reply){
				if(!err) {
					parsedData.push({
						userId: 	userId,
						postId: 	postId,
						postLink: 	'http://www.facebook.com/' + reply.username + '/posts/' + postId,
						time: 		Date.parse(postObj.created_time),
						keyword: 	keyword,
						type: 		'facebook'
					});
				}
				cb();
			});

		}

		async.each(data, processData, function(err) {
			callback(parsedData);
		});
	}

	//TODO: REMOVE CONSOLE.LOG AND CHANGE COUNT LIMIT	
	//TODO: FOR NPM MODULE PUT THIS ON AN ASYNC EACH AND CALLBACK ONCE
	this.getFbResults = function(addLinksCb, saveKeywordsCb) {
		var fetchPosts = function(keywordObj, cb) {
			var searchParams = {
				q: 				keywordObj.keyword,
				type: 			'post',
				limit: 			10,
				fields: 		'id, created_time',
				since: 			removeMilliseconds(keywordObj.lastChecked),
				access_token: 	accessToken 
			};

			console.log(searchParams);
			fbgraph.search(searchParams, function(err, reply) {
				console.log(err);
				console.log('reply: %j', reply);

				if(err) {
					addLinksCb(err);
					cb();
					return;
				}

				parseFacebookData(reply.data, keywordObj.keyword, function(links){
					keywordObj.lastChecked = Date.now();
					addLinksCb(null, links);
					cb();
				});
			});
		}


		async.each(keywords, fetchPosts, function(err) {
			saveKeywordsCb('facebook', keywords);
		});
	}


}

module.exports = FacebookSearch;