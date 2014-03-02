var GoogleNewsReader    = require('./google-news-reader'),
    async               = require('async');

var newsSearch = new GoogleNewsReader();


function GoogleNewsSearch(keywords) {

    this.getNews = function(addLinksCb, saveKeywordsCb) {
        var links = [];

        var makeRequest = function(keywordObj, cb) {
            var request = {
                q:          keywordObj.keyword,
                scoring:    'n',
                num:        '10'
            };

            var handleResults = function(err, results) {
                if(err) {
                    addLinksCb(err);
                } else {
                    keywordObj.lastChecked = Date.now();
                    addLinksCb(null, results);
                }
                cb();
            };

            newsSearch.search(request, keywordObj.lastChecked, handleResults);
        };

        async.each(keywords, makeRequest, function(err){
            saveKeywordsCb('googleNews', keywords);
        });
    };
}

module.exports = GoogleNewsSearch;