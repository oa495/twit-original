/* global html2canvas WebFont */

$(document).ready(function() {
  function toTitleCase(str) {
    return str.replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
    });
  }

  function drawCanvas(info) {
    const canvas = document.getElementById('canvas'); 
    const w = canvas.width = 600;
    const h = canvas.height = window.innerHeight/1.4;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f8f8f6';
    ctx.fillRect(0, 0, w, h);
    
    const users = info.users;
    const len = users.length;
    // draw image
    let tweet_retweet = new Image();
    tweet_retweet.setAttribute('crossOrigin', 'anonymous'); 
    tweet_retweet.src = info.originality > 50 ? 
      'https://cdn.glitch.com/d4397f7c-1d3b-434e-9e40-0f1c564cbd33%2Ftweeter.svg?1520543321274' :
      'https://cdn.glitch.com/d4397f7c-1d3b-434e-9e40-0f1c564cbd33%2Fretweeter.svg?1520543321374';
    
    const no_tweets = info.no_tweets; // number of tweets
    const no_retweets = len - no_tweets;
    
    function drawTweetGrid() {
      // for each tweet draw an image
      users.forEach(function(user, i) {
        const x = ((i % 5) * 50) + w/2 + 15;
        const y = (Math.floor(i / 5) * 50) + h/4;
        ctx.strokeStyle = '#F6F30F';
        ctx.lineWidth= 5;
        ctx.strokeRect(x+2, y+2, 42, 42);
        ctx.fillStyle = '#0000e8';
        ctx.fillRect(x+2, y+2, 42, 42);
        if (!user.isRT) { // if it's not a retweet
          let tweet = new Image();
          tweet.setAttribute('crossOrigin', 'anonymous'); 
          tweet.src = 'https://cdn.glitch.com/d4397f7c-1d3b-434e-9e40-0f1c564cbd33%2Ftweet.svg?1520542770224';
          tweet.onload = () => {
            ctx.drawImage(tweet, x+2, y+2, 42, 42);
          }
        }
        else {
          let retweet = new Image();
          retweet.setAttribute('crossOrigin', 'anonymous'); 
          retweet.src = 'https://cdn.glitch.com/d4397f7c-1d3b-434e-9e40-0f1c564cbd33%2Fretweet.svg?1520543111130';
          retweet.onload = () => {
            ctx.drawImage(retweet, x+3, y+3, 42, 42);
          }
        }
      });
    }
    // after the image finishes loading 
    tweet_retweet.onload = () => {
      ctx.drawImage(tweet_retweet, 20, canvas.height/2 - 400/2, 300, 400);
      ctx.font = '48px Shrikhand, Roboto';
      ctx.textAlign = 'center'; 
      ctx.fillStyle = '#0000e8';
      const name = toTitleCase(info.name);
      ctx.fillText(name, w / 2, 60);
      ctx.font = '18px Roboto';
      ctx.fillText(`From your last ${len} posts: ${no_tweets} tweets, ${no_retweets} retweets.`, w / 2, h - 20);
      drawTweetGrid();
      addLink();
    }
  }
  // add link to download image
  function addLink() {
    let link = document.getElementById('download');
    if (!link) {
      // create a link element
      link = document.createElement('a');
      link.id = 'download';
      const canvas = document.getElementById('canvas'); 
      link.innerHTML = 'Download!';
      // when it's clicked, download the image
      link.addEventListener('click', function() {
        link.href = canvas.toDataURL(); // this stores an image of the canvas
        link.download = 'twit-original.png';
      });
      $('.user-visual').append(link);
    }
  }
  
  function getInfo() {
    $.get('/info', function(info) {
      const users = info.users;
      info.originality > 50 ? 
        $('.tweet-retweet').attr('src', 'https://cdn.glitch.com/d4397f7c-1d3b-434e-9e40-0f1c564cbd33%2Fanimation_tweeter_transparent.gif?1520464562610') :
        $('.tweet-retweet').attr('src', 'https://cdn.glitch.com/d4397f7c-1d3b-434e-9e40-0f1c564cbd33%2Fanimation_retweeter_transparent.gif?1520464565872');
      drawCanvas(info);
      setTimeout(function() { 
        $('.user-visual').show('slow').css('display', 'flex');
      }, 3500); // delay for 3.5s
    });
  }

  $('form').submit(function(event) {
    event.preventDefault();
    const username = $('input').val();
    $.post('/info?' + $.param({username: username}))
    .done(function() {
      getInfo();
    });
  });
});

