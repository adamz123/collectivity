var	TwitterSearch		= require('./twitter-search'),
	FacebookSearch		= require('./facebook-search'),
	GoogleNewsSearch	= require('./google-news-search.js');

function Collectivity(keywords) {
	this.aggregate = function(addLinksCb, saveKeywordsCb) {

		var twitterSearcher		= new TwitterSearch(keywords.twitter),
			facebookSearcher	= new FacebookSearch(keywords.facebook),
			googleNewsSearcher	= new GoogleNewsSearch(keywords.news);


		twitterSearcher.getTweets(addLinksCb, saveKeywordsCb);
		facebookSearcher.getFbResults(addLinksCb, saveKeywordsCb);
		googleNewsSearcher.getNews(addLinksCb, saveKeywordsCb);
	};
}

module.exports = Collectivity;