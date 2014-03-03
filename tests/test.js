var Collectivity = require('../lib/collectivity.js');

var fbKeys = {
    appId:      'YOUR APP ID',
    appSecret:  'YOUR APP SECRET'
};

var twitterKeys = {
    consumer_key:         'YOUR CONSUMER KEY',
    consumer_secret:      'YOUR CONSUMER SECRET',
    access_token:         'YOUR ACCESS TOKEN',
    access_token_secret:  'YOUR ACCESS TOKEN SECRET'
};

var keywords = {
    facebook:   [{keyword: 'recession', lastChecked: '1388099510000'}],
    news:       [{keyword: 'recession', lastChecked: '1388099510000'}],
    twitter:    [{keyword: 'recession', max_id: '0'}]
};


var linksReturned = function(err, links) {
    if(err){
        console.log('An error occurred:');
        console.log(err);
    } else {
        console.log('The following links were returned:');
        console.log(links);
    }
};


var keywordsReturned = function(type, keywords) {
    console.log('The following ' + type + ' keyword dictionary was returned:');
    console.log(keywords);
};


var recessionCollectivity = new Collectivity(keywords, fbKeys, twitterKeys);

recessionCollectivity.aggregate(linksReturned, keywordsReturned, 10);