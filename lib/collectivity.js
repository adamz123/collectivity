var TwitterSearch       = require('./twitter-search'),
    FacebookSearch      = require('./facebook-search'),
    GoogleNewsSearch    = require('./google-news-search.js'),
    events              = require('events');


function Collectivity(keywords, fbKeys, twitterKeys) {
    this.keywords = keywords;
    this.fbKeys = fbKeys;
    this.twitterKeys = twitterKeys;

    events.EventEmitter.call(this);
}

require('util').inherits(Collectivity, events.EventEmitter);


Collectivity.prototype.aggregate = function(numPosts) {
    var searchesReturned    = 0,
        totalSearches       = 3,
        self                = this;

    var twitterSearcher     = new TwitterSearch(this.keywords.twitter, this.twitterKeys),
        facebookSearcher    = new FacebookSearch(this.keywords.facebook, this.fbKeys),
        googleNewsSearcher  = new GoogleNewsSearch(this.keywords.googleNews);

    var addLinksCb = function(err, links) {
        if(err) {
            self.emit('error', err);
        } else {
            self.emit('links', links);
        }
    };

    var saveKeywordsCb = function(type, keywords) {
        self.emit('keywords', type, keywords);
        searchesReturned++;

        if(searchesReturned == totalSearches) {
            self.emit('end');
        }
    };

    twitterSearcher.getTweets(addLinksCb, saveKeywordsCb, numPosts);
    facebookSearcher.getFbResults(addLinksCb, saveKeywordsCb, numPosts);
    googleNewsSearcher.getNews(addLinksCb, saveKeywordsCb, numPosts);
};

module.exports = Collectivity;