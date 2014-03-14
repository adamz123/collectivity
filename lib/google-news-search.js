var GoogleNewsReader    = require('./google-news-reader'),
    async               = require('async');

function GoogleNewsSearch(keywords) {
    this.keywords = keywords;
    this.newsSearch = new GoogleNewsReader();
}

GoogleNewsSearch.prototype.getNews = function(addLinksCb, saveKeywordsCb, numPosts) {
    var links   = [],
        self    = this;

    var makeRequest = function(keywordObj, cb) {
        var request = {
            q:          keywordObj.keyword,
            scoring:    'n',
        };

        if(numPosts) {
            request.num = numPosts;
        }

        var handleResults = function(err, results) {
            if(err) {
                addLinksCb(err);
            } else {
                keywordObj.lastChecked = Date.now();
                addLinksCb(null, results);
            }
            cb();
        };

        self.newsSearch.search(request, keywordObj.lastChecked, handleResults);
    };

    async.each(this.keywords, makeRequest, function(err){
        saveKeywordsCb('googleNews', self.keywords);
    });
};


module.exports = GoogleNewsSearch;