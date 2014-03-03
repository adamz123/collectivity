var TwitterSearch       = require('./twitter-search'),
    FacebookSearch      = require('./facebook-search'),
    GoogleNewsSearch    = require('./google-news-search.js');

function Collectivity(keywords, fbKeys, twitterKeys) {

    this.aggregate = function(addLinksCb, saveKeywordsCb, numPosts) {

        var twitterSearcher     = new TwitterSearch(keywords.twitter, twitterKeys),
            facebookSearcher    = new FacebookSearch(keywords.facebook, fbKeys),
            googleNewsSearcher  = new GoogleNewsSearch(keywords.news);


        twitterSearcher.getTweets(addLinksCb, saveKeywordsCb, numPosts);
        facebookSearcher.getFbResults(addLinksCb, saveKeywordsCb, numPosts);
        googleNewsSearcher.getNews(addLinksCb, saveKeywordsCb, numPosts);
    };
}

module.exports = Collectivity;