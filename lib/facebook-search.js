var fbgraph = require('fbgraph'),
    async   = require('async');

var removeMilliseconds = function(timestampNum) {
    var timestamp = timestampNum.toString();
    var charsToReturn = timestamp.length - 3;

    return timestamp.substr(0, charsToReturn);
};

var parseFacebookData = function(data, keyword, callback) {
    var parsedData = [];

    var processData = function(postObj, cb) {
        var userPostIds = postObj.id.split('_'),
            userId = userPostIds[0],
            postId = userPostIds[1];

        fbgraph.get(userId, {fields: 'username'}, function(err, reply){
            if(!err) {
                parsedData.push({
                    userId:     userId,
                    postId:     postId,
                    postLink:   'http://www.facebook.com/' + reply.username + '/posts/' + postId,
                    time:       Date.parse(postObj.created_time),
                    keyword:    keyword,
                    type:       'facebook'
                });
            }
            cb();
        });

    };

    async.each(data, processData, function(err) {
        callback(parsedData);
    });
};

function FacebookSearch(keywords, fbKeys) {
    this.keywords = keywords;
    this.accessToken = fbKeys.appId + '|' + fbKeys.appSecret;
}

FacebookSearch.prototype.getFbResults = function(addLinksCb, saveKeywordsCb, numPosts) {
    var self = this;

    var fetchPosts = function(keywordObj, cb) {
        var searchParams = {
            q:              keywordObj.keyword,
            type:           'post',
            fields:         'id, created_time',
            since:          removeMilliseconds(keywordObj.lastChecked),
            access_token:   self.accessToken
        };

        if(numPosts) {
            searchParams.limit = numPosts;
        }

        fbgraph.search(searchParams, function(err, reply) {
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
    };


    async.each(this.keywords, fetchPosts, function(err) {
        saveKeywordsCb('facebook', self.keywords);
    });
};

module.exports = FacebookSearch;