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
    googleNews: [{keyword: 'recession', lastChecked: '1388099510000'}],
    twitter:    [{keyword: 'recession', max_id: '0'}]
};


var linksReturned = function(links) {
    console.log('The following links were returned:');
    console.log(links);
};


var keywordsReturned = function(type, keywords) {
    console.log('The following ' + type + ' keyword dictionary was returned:');
    console.log(keywords);
};

var handleError = function(err) {
    console.log(err);
};

var collectivityCompleted = function() {
    console.log('Process Complete');
    process.exit();
};

var recessionCollectivity = new Collectivity(keywords, fbKeys, twitterKeys);

recessionCollectivity.aggregate(10);

recessionCollectivity.on('links', linksReturned);
recessionCollectivity.on('keywords', keywordsReturned);
recessionCollectivity.on('error', handleError);
recessionCollectivity.on('end', collectivityCompleted);