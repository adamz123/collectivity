var Collectivity = require('../lib/collectivity.js');

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


var recessionCollectivity = new Collectivity(keywords);

recessionCollectivity.aggregate(linksReturned, keywordsReturned);