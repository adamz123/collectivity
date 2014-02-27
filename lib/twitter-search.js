var Twit	= require('twit'),
	async	= require('async');

var T = new Twit({
	consumer_key:         'YOUR CONSUMER KEY',
	consumer_secret:      'YOUR CONSUMER SECRET',
	access_token:         'YOUR ACCESS TOKEN',
	access_token_secret:  'YOUR ACCESS TOKEN SECRET'
});

function TwitterSearch(keywords) {

	// var writeLastTweetId = function(keywordsRef, id, maxId) {
	//	keywordsRef.child(id).update({max_id: maxId});
	// }

	var parseTwitterData = function(data) {
		var parsedData = [];

		for(i=0;i<data.statuses.length;i++) {
			parsedData.push({
				tweetId:	data.statuses[i].id_str,
				keyword:	data.search_metadata.query,
				time:		Date.parse(data.statuses[i].created_at),
				type:		'twitter'
			});
		}


		return parsedData;
	};

	//TODO: REMOVE CONSOLE.LOG AND CHANGE COUNT LIMIT
	this.getTweets = function(addLinksCb, saveKeywordsCb) {
		var fetchTweets = function(keywordObj, cb) {
			var request = { 
							q: keywordObj.keyword,
							count: 10,
							result_type: 'recent',
							since_id: keywordObj.max_id 
			};

			T.get('search/tweets', request, function(err, reply) {
				var links;

				console.log(reply);
				keywordObj.max_id = reply.search_metadata.max_id_str;
				links = parseTwitterData(reply);
				addLinksCb(null, links);
				cb();
			});			
		};

		async.each(keywords, fetchTweets, function(err){
			saveKeywordsCb('twitter', keywords);
		});
	};
}


module.exports = TwitterSearch;