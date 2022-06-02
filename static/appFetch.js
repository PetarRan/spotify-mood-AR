const redirect_uri = "http://127.0.0.1:5000"

const happy = ["party", "37i9dQZF1DX0BcQWzuB7ZO", "20HGQoLejdQz5Lv55acgWe", "5cwIrjOMWTiGCYB5Z9oQix"]
const sad = ["happy", "20HGQoLejdQz5Lv55acgWe", "37i9dQZF1DXbYM3nMM0oPk", "37i9dQZF1DX7qK8ma5wgG1"]
const angry = ["calm", "6QAVsGp118XZLQrBe38r5O", "7JabddFr3Q6JPsND4v9Swf", "37i9dQZF1DWTvNyxOwkztu"]
const disgust = ["nature", "20HGQoLejdQz5Lv55acgWe", "37i9dQZF1DWTvNyxOwkztu", "37i9dQZF1DWWQRwui0ExPn"]
const fear = ["calm", "6QAVsGp118XZLQrBe38r5O", "7JabddFr3Q6JPsND4v9Swf", "37i9dQZF1DWWQRwui0ExPn"]
const surprise = ["party", "5cwIrjOMWTiGCYB5Z9oQix", "1Anm3140fyp1gH95Qgo3Id", "7xY34kpisIxOv8WMnNN8wg"]
const neutral = ["chill", "6QAVsGp118XZLQrBe38r5O", "1Anm3140fyp1gH95Qgo3Id", "37i9dQZF1DWTvNyxOwkztu"]

var clientID = "56f882c5e3344098ba39ad26fbea91f2"
var secretID = "382f7cf705fc455a8783ed71fad474b4"
var access_token = "BQBqOY90vRT9o0dbg-Fyd3SBppdEX3dXRck6biQqPvEoEtRn111SFqfC_cEiy4EN2sTL81m67alNjoc3S--zT87I7RycE_5JD9v3VHsX10Tl38LhO81JKlmXMU8EJih7tHaItccHQhbgupD-dmRGihrj4laoc3Gsax3c1tZRjFFEehC4HEh0qA";
var refresh_token = "AQDivpdyP-VTIy4ZilSQ6P45h9C2RPWXgp-jXB1WBgk3JHZYgpm9hI50VO7F1kUlrNB2ptjmYoKuabIOFuV1MtO304HWzj-VRhhRaNcRk3z0YvqyK16s4WosZJCFPGnYZ5A";

const PLAY = "https://api.spotify.com/v1/me/player/play";
const GETSONG = "https://api.spotify.com/v1/tracks/"
const GETPLAYLIST = "https://api.spotify.com/v1/playlists/"
const GETbyKEYWORD = "https://api.spotify.com/v1/search?"
const GETbyALBUM = "https://api.spotify.com/v1/albums/"


$(document).ready(function () {

    $('#emotion-detect').on('DOMSubtreeModified', function(){
        let currentEmotion = $("#emotion-detect").html()
        let emotionBefore = ''
        if(currentEmotion == 'stop'){
            alert('skip song')
            getPlaylistNew(emotionBefore)
        } else {
            emotionBefore = currentEmotion
            getPlaylistNew(currentEmotion)
        }
    });
});

function auth(){

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };
    
      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
    
          var access_token = body.access_token,
              refresh_token = body.refresh_token;
    
          var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          };
    
          // use the access token to access the Spotify Web API
          request.get(options, function(error, response, body) {
            console.log(body);
          });
    
        }})

}




function getPlaylistNew(emotion) {
    let index = getRandomInt(5)
    if(index == 0){
        fetch(`${GETbyKEYWORD}q=${emotion[index]}&type=playlist&include_external=audio`, {
           method: 'get',
           headers: new Headers({
               'Authorization' : 'Basic ' + access_token,
           }) 
        })
        .then(p => {
            p.json().then(data => {
                console.log(data)
                //FURTHER FUNCTION
            });
        });
    } else {
        fetch(`${GETPLAYLIST}${emotion[index]}`, {
            method: 'get',
            headers: new Headers({
                'Authorization' : 'Basic ' + access_token,
            })
        })
        .then(p => {
            p.json().then(data => {
                console.log(data)
                //FURTHER FUNCTION
            });
        });
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

function refreshAccessToken(){
    refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id;
    callAuthorizationApi(body);
}

function callApi(method, url, body, callback){
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.send(body);
    xhr.onload = callback;
}

function play(){
    let playlist_id = ""
    let body = {};
    if ( album.length > 0 ){
        body.context_uri = album;
    }
    else{
        body.context_uri = "spotify:playlist:" + playlist_id;
    }
    body.offset = {};
    body.offset.position = trackindex.length > 0 ? Number(trackindex) : 0;
    body.offset.position_ms = 0;
    callApi( "PUT", PLAY + "?device_id=" + deviceId(), JSON.stringify(body), handleApiResponse );
}