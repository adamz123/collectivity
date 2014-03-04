var fbgraph = require('fbgraph'),
    async   = require('async');

function FacebookSearch(keywords, fbKeys) {
    var accessToken = fbKeys.appId + '|' + fbKeys.appSecret;

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

    this.getFbResults = function(addLinksCb, saveKeywordsCb, numPosts) {

        var fetchPosts = function(keywordObj, cb) {
            var searchParams = {
                q:              keywordObj.keyword,
                type:           'post',
                fields:         'id, created_time',
                since:          removeMilliseconds(keywordObj.lastChecked),
                access_token:   accessToken
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


        async.each(keywords, fetchPosts, function(err) {
            saveKeywordsCb('facebook', keywords);
        });
    };


}

module.exports = FacebookSearch;