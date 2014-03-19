var xml2js  = require('xml2js'),
    https   = require('https'),
    url     = require('url'),
    cheerio = require('cheerio');

var googleNewsUrl = {
                        protocol:   'https',
                        host:       'news.google.com',
                        pathname:   '/news/feeds'
                    };

var buildNewsUrl = function(params) {
    params.output = 'rss';
    googleNewsUrl.query = params;

    return url.format(googleNewsUrl);
};

var formatNewsItem = function(newsItem) {
    var $           = cheerio.load(newsItem.description[0]),
        imageLink   = $('img').first().attr('src'),
        moreLink    = $('.lh a.p').attr('href'),
        description = $('.lh font').first().next().next().text(),
        source      = $('.lh font').first().text(),
        altLinks    = $('.lh font:has(nobr):has(a:not(.p)):not(.p)'),

        formattedItem = {
            title:          newsItem.title[0],
            link:           newsItem.link[0],
            date:           newsItem.pubDate[0],
            description:    description ? description : null,
            moreLink:       moreLink ? moreLink : null,
            imageLink:      imageLink ? imageLink : null,
            source:         source ? source : null,
            altLinks:       [],
            type:           'googleNews'
        };



    for(var i=0;i<altLinks.length;i++) {
        formattedItem.altLinks.push({
            title:  $(altLinks[i]).find('a').text(),
            link:   $(altLinks[i]).find('a').attr('href'),
            source: $(altLinks[i]).find('nobr').text()
        });
    }

    return formattedItem;
};

var extractItems = function(parsedRss, sinceTimestamp) {
    var searchedNewsItems   = [],
        newsItems           = parsedRss.rss.channel[0].item,
        sinceTimestamp      = sinceTimestamp ? sinceTimestamp : 0,
        formattedNewsItem;

    for(var i=0;i<newsItems.length;i++) {
        if(Date.parse(newsItems[i].pubDate[0]) > sinceTimestamp) {
            formattedNewsItem = formatNewsItem(newsItems[i]);
            searchedNewsItems.push(formattedNewsItem);
        }
    }

    return searchedNewsItems;
};

function GoogleNewsReader() {}

GoogleNewsReader.prototype.search = function(params, sinceTimestamp, callback) {
    var url         = buildNewsUrl(params),
        rssDataStr  = '';

    if(typeof sinceTimestamp === 'function') {
        callback = sinceTimestamp;
        sinceTimestamp = null;
    }

    https.get(url, function(res) {
        res.on('data', function(rssData) {
            rssDataStr += rssData.toString();
        });

        res.on('end', function() {
            xml2js.parseString(rssDataStr, function(err, parsedRss) {
                var results = extractItems(parsedRss, sinceTimestamp);
                
                callback(null, results);
            });
        });

    }).on('error', function(e){
        callback(e);
    });

};



module.exports = GoogleNewsReader;