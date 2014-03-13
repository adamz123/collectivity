var TwitterSearch       = require('./twitter-search'),
    FacebookSearch      = require('./facebook-search'),
    GoogleNewsSearch    = require('./google-news-search.js'),
    events              = require('events');


function Collectivity(keywords, fbKeys, twitterKeys) {
    this.keywords = keywords;
    this.fbKeys = fbKeys;
    this.twitterKeys = twitterKeys;

    require('util').inherits(Collectivity, events.EventEmitter);
}

Collectivity.prototype.aggregate = function(numPosts) {

    var twitterSearcher     = new TwitterSearch(this.keywords.twitter, this.twitterKeys),
        facebookSearcher    = new FacebookSearch(this.keywords.facebook, this.fbKeys),
        googleNewsSearcher  = new GoogleNewsSearch(this.keywords.googleNews);

    var addLinksCb = function(err, links) {
        if(err) {
            this.emit('error', err);
        } else {
            this.emit('links', links);
        }
    };

    var saveKeywordsCb = function(type, keywords) {
        this.emit('keywords', type, keywords);
    };

    twitterSearcher.getTweets(addLinksCb, saveKeywordsCb, numPosts);
    facebookSearcher.getFbResults(addLinksCb, saveKeywordsCb, numPosts);
    googleNewsSearcher.getNews(addLinksCb, saveKeywordsCb, numPosts);


};


module.exports = Collectivity;