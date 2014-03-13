var TwitterSearch       = require('./twitter-search'),
    FacebookSearch      = require('./facebook-search'),
    GoogleNewsSearch    = require('./google-news-search.js');


function Collectivity(keywords, fbKeys, twitterKeys) {
    this.keywords = keywords;
    this.fbKeys = fbKeys;
    this.twitterKeys = twitterKeys;
}

Collectivity.prototype.aggregate = function(addLinksCb, saveKeywordsCb, numPosts) {

    var twitterSearcher     = new TwitterSearch(this.keywords.twitter, this.twitterKeys),
        facebookSearcher    = new FacebookSearch(this.keywords.facebook, this.fbKeys),
        googleNewsSearcher  = new GoogleNewsSearch(this.keywords.googleNews);


    twitterSearcher.getTweets(addLinksCb, saveKeywordsCb, numPosts);
    facebookSearcher.getFbResults(addLinksCb, saveKeywordsCb, numPosts);
    googleNewsSearcher.getNews(addLinksCb, saveKeywordsCb, numPosts);
};


module.exports = Collectivity;