var keysToTwit = require("./keys.js");
var request = require("request");
var Twitter = require("twitter");
var SpotifyWebApi = require('spotify-web-api-node');
var fs = require("fs");
var whatIwantToDo = process.argv[2];
var mediaTitle = "";
var nodeArgs = process.argv;

switch (whatIwantToDo) {
    case "my-tweets":
        twitterMe();
        break;

    case "spotify-this-song":
        spotifySearch(mediaTitle);
        break;

    case "movie-this":
        movieFind(mediaTitle);
        break;

    case "do-what-it-says":
        doThis();
        break;
}

///////////////////////////////////////////////////////////////////////
///////////////// FUNCTION TO GET LATEST TWEETS //////////////////////
/////////////////////////////////////////////////////////////////////

function twitterMe() {

    var client = new Twitter({

        consumer_key: keysToTwit.twitterKeys.consumer_key,
        consumer_secret: keysToTwit.twitterKeys.consumer_secret,
        access_token_key: keysToTwit.twitterKeys.access_token_key,
        access_token_secret: keysToTwit.twitterKeys.access_token_secret

    });

    var params = {
        screen_name: 'JessiTweettt'
    };

    client.get('statuses/home_timeline', params, function(error, tweets, response) {

        if (!error) {

            for (var i = 0; i < tweets.length; i++) {

                console.log("Here's a tweet:");
                console.log(" ");
                console.log(tweets[i].text);
                console.log(" ");
                console.log("Created on: " + tweets[i].created_at);
                console.log("-----------------");
                console.log(" ");

            }
        }

    });
}


///////////////////////////////////////////////////////////////////////
///////////// FUNCTION TO FIND SONG, USING TITLE /////////////////////
/////////////////////////////////////////////////////////////////////
function spotifySearch(mediaTitle) {

    //////FOR LOOP FOR MULTIPLE WORD TITLE (PARAMETER) //////
    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 3 && i < nodeArgs.length) {

            mediaTitle = mediaTitle + "+" + nodeArgs[i];

        } else {

            mediaTitle += nodeArgs[i];

        }
    }

    ////////// START OF REQUEST ///////////

    var Spotify = require('node-spotify-api');

    var spotify = new Spotify({

        id: keysToTwit.spotifyKeys.client_id,
        secret: keysToTwit.spotifyKeys.client_secret

    });

    if (mediaTitle === undefined) { // Returns Ace of Base's 'The Sign', if no song entered


        spotify.search({
            type: 'track',
            query: '"the sign"',
            limit: 1
        }, function(err, data) { 

            if (!err) {

                var strungSpot = JSON.stringify(data, null, 2);
                // console.log(strungSpot); 

                console.log("==============");
                console.log("CONGRATULATIONS!  You found the secret song!");
                console.log(" ");
                console.log("Artist: " + data.tracks.items[0].artists[0].name);
                console.log("Album: " + data.tracks.items[0].album.name);
                console.log("Song: " + data.tracks.items[0].name);
                console.log("Preview Link:");
                console.log(data.tracks.items[0].preview_url);
                console.log("==============");

            }
        });

    } else { // Returns track info for song entered

        spotify.search({
            type: 'track',
            query: mediaTitle,
            limit: 1
        }, function(err, data) {

            if (!err) {

                var strungSpot = JSON.stringify(data, null, 2);

                console.log("==============");
                console.log("Artist: " + data.tracks.items[0].artists[0].name);
                console.log("Album: " + data.tracks.items[0].album.name);
                console.log("Song: " + data.tracks.items[0].name);
                console.log("Preview Link:");
                console.log(data.tracks.items[0].preview_url);
                console.log("==============");

            }
        });

    }
}

///////////////////////////////////////////////////////////////////////
///////////// FUNCTION TO FIND MOVIE, USING TITLE ////////////////////
/////////////////////////////////////////////////////////////////////

function movieFind(mediaTitle) {

    //////FOR LOOP FOR MULTIPLE WORD TITLE (PARAMETER) //////
    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 3 && i < nodeArgs.length) {

            mediaTitle = mediaTitle + "+" + nodeArgs[i];

        } else {

            mediaTitle += nodeArgs[i];

        }
    }

    ////////// START OF REQUEST ///////////
    if (mediaTitle === undefined) { // If no movie title entered, finds 'Mr Nobody'

        request("http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=40e9cece", function(error, response, body) {

            if (!error && response.statusCode === 200) {

                var parsedImdb = JSON.parse(body);
                console.log("==============");
                console.log(parsedImdb.Title);
                console.log("Released: " + parsedImdb.Year);
                console.log("IMDB Rating: " + parsedImdb.imdbRating);
                console.log("Country: " + parsedImdb.Country);
                console.log("Language: " + parsedImdb.Language);
                console.log("Actors: " + parsedImdb.Actors);
                console.log("Plot:");
                console.log(parsedImdb.Plot);
                console.log(parsedImdb.Ratings[1].Source + "Rating: " + parsedImdb.Ratings[1].Value);
                console.log("==============");



            }
        });

    } else { // Finds info about entered movie title

        request("http://www.omdbapi.com/?t=" + mediaTitle + "&y=&plot=short&apikey=40e9cece", function(error, response, body) {


            if (!error && response.statusCode === 200) {

                var parsedImdb = JSON.parse(body);
                console.log("==============");
                console.log(parsedImdb.Title);
                console.log("Released: " + parsedImdb.Year);
                console.log("IMDB Rating: " + parsedImdb.imdbRating);
                console.log("Country: " + parsedImdb.Country);
                console.log("Language: " + parsedImdb.Language);
                console.log("Actors: " + parsedImdb.Actors);
                console.log("Plot:");
                console.log(parsedImdb.Plot);
                console.log(parsedImdb.Ratings[1].Source + " Rating: " + parsedImdb.Ratings[1].Value);
                console.log("==============");



            }
        });

    }
}

////////////////////////////////////////////////////////////////////////////////////
///////////// FUNCTION TO MAKE IT SPOTIFY 'I WANT IT THAT WAY' ////////////////////
//////////////////////////////////////////////////////////////////////////////////

function doThis() { 

    fs.readFile("random.txt", "utf8", function(err, data) {

        if (err) {
            return console.log(err);
        }

        var dataArr = data.split(",");

        spotifySearch(dataArr[1]);

    });

}