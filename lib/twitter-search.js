var Twit    = require('twit'),
    async   = require('async');

var parseTwitterData = function(data) {
    var parsedData = [];

    for(i=0;i<data.statuses.length;i++) {
        parsedData.push({
            tweetId:    data.statuses[i].id_str,
            tweetLink:  'https://twitter.com/' + data.statuses[i].user.screen_name + '/statuses/' + data.statuses[i].id_str,
            keyword:    data.search_metadata.query,
            time:       Date.parse(data.statuses[i].created_at),
            username:   data.statuses[i].user.screen_name,
            userId:     data.statuses[i].user.id_str,
            type:       'twitter'
        });
    }


    return parsedData;
};

function TwitterSearch(keywords, twitterKeys) {
    this.keywords = keywords;
    this.twitterKeys = twitterKeys;
    this.T = new Twit(this.twitterKeys);
}

TwitterSearch.prototype.getTweets = function(addLinksCb, saveKeywordsCb, numPosts) {
    var self = this;

    var fetchTweets = function(keywordObj, cb) {
        var request = {
                        q: keywordObj.keyword,
                        result_type: 'recent',
                        since_id: keywordObj.max_id
        };

        if(numPosts) {
            request.count = numPosts;
        }

        self.T.get('search/tweets', request, function(err, reply) {
            var links;

            keywordObj.max_id = reply.search_metadata.max_id_str;
            links = parseTwitterData(reply);
            addLinksCb(null, links);
            cb();
        });
    };

    async.each(this.keywords, fetchTweets, function(err){
        saveKeywordsCb('twitter', self.keywords);
    });
};

module.exports = TwitterSearch;