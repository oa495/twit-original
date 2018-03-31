// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

/* twit setup */
var Twit = require('twit')
var config = {  
  twitter: {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
  }
}
var twitInstance = new Twit(config.twitter)


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/info", function (request, response) {
  response.send(info);
});

// could also use the POST body instead of query sprofile_image_urltring: http://expressjs.com/en/api.html#req.body
app.post("/info", function (request, response) {
  info.name = '';
  info.no_tweets = 0;
  info.originality = 0;
  info.users = [];
  // change the count if you want to return more posts!
  // go through all the posts on the user's timeline
  twitInstance.get('statuses/user_timeline',{ screen_name: request.query.username, count: 30 }, function(err, data) {
    let count = 0;
    const total = data.length;
    data.forEach((tweet) => {
      let user;
      // determine if it's a tweet or retweet
      let retweet = tweet.retweeted_status;
      if (retweet) {
        user = retweet.user;
      }
      else {
        count++;
        user = tweet.user;
      }
      info['users'].push({ username: user.screen_name, img_url: user.profile_image_url, isRT: !!retweet});
    });
    info.no_tweets = count;
    info.originality = (count/total)*100;
    info.name = data[0].user.name;
    response.sendStatus(200);
  });
});

// Simple in-memory store for now
var info = {
  name: '',
  originality: 0,
  no_tweets: 0,
  users: []
};

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
