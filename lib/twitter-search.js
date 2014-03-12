var Twit    = require('twit'),
    async   = require('async');

function TwitterSearch(keywords, twitterKeys) {
    var T = new Twit(twitterKeys);

    var parseTwitterData = function(data) {
        var parsedData = [];

        for(i=0;i<data.statuses.length;i++) {
            parsedData.push({
                tweetId:    data.statuses[i].id_str,
                keyword:    data.search_metadata.query,
                time:       Date.parse(data.statuses[i].created_at),
                type:       'twitter'
            });
        }


        return parsedData;
    };

    this.getTweets = function(addLinksCb, saveKeywordsCb, numPosts) {

        var fetchTweets = function(keywordObj, cb) {
            var request = {
                            q: keywordObj.keyword,
                            result_type: 'recent',
                            since_id: keywordObj.max_id
            };

            if(numPosts) {
                request.count = numPosts;
            }

            T.get('search/tweets', request, function(err, reply) {
                var links;

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