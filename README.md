collectivity
============

Node.js library to aggregate tweets, Facebook posts and Google News links that pertain to a list of keywords


Collectivity searches social media and the news for the keywords of your choosing.  You specify a list of keywords (as well as "since times") and collectivity scours the media realm and returns tweets, posts and news articles containing your keywords and have appeared since the time you specified.

Right now this is all the documentation I have.  To see an example of it in use, check out tests/test.js.

Both lib/twitter-search.js and lib/facebook-search.js require Twitter and Facebook app keys respectively in order to function.


Things to do
------------

* Create NPM module
* Remove console.logs
* Add more documentation
  1. regarding the objects returned by collectivity
  2. regardging how to use it
  3. regarding the keyword input object