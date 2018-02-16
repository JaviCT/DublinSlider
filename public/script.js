// Initialize Firebase
var config = {
  apiKey: "AIzaSyBfAHRlmuP8bkagQqR_S7r3e7wAUydLt4E",
  authDomain: "dublinslider.firebaseapp.com",
  databaseURL: "https://dublinslider.firebaseio.com",
  projectId: "dublinslider",
  storageBucket: "dublinslider.appspot.com",
  messagingSenderId: "399862458831"
};
if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

var storage = firebase.storage();
var storageRef = storage.ref();
var spaceRef = storageRef.child('logo.png');
var path = spaceRef.fullPath;
var map;
var name;
var nameId;
var id = -1;
var lat;
var lng;
var description;
var before;
var after;
var finalId;
var marker = [];

function createMarker(icon){

  var query = firebase.database().ref("photos").orderByKey();
  query.once("value")
    .then(function(snapshot) {
      var i = 0;
      snapshot.forEach(function(childSnapshot) {
        name = childSnapshot.key;
        nameId = childSnapshot.val()['id'];
        lat = childSnapshot.val()['lat'];
        lng = childSnapshot.val()['lng'];
        description = childSnapshot.val()['description'];
        before = childSnapshot.val()['before'];
        after = childSnapshot.val()['after'];
        var location = {lat: lat, lng: lng};
        marker[i] = new google.maps.Marker({id: i+1, position: location, map: map, icon: icon});

        var divisor = document.getElementById("divisor");
        var slider = document.getElementById("slider");
        var handle = document.getElementById("handle");

        var contentString = '<div id="comparison">' +
          '<figure id="myFigure">' +
            '<div id="divisor"></div>' +
          '</figure>' +
          '<input type="range" min="0" max="100" value="50" id="slider" oninput="moveDivisor()">' +
        '</div>';
        var infowindow1 = new google.maps.InfoWindow({
          content: contentString
        });

        google.maps.event.addListener(marker[i], 'click', function () {
          id = 1;
          createClickable();
          infowindow1.open(map, marker[1]);
          var t = document.getElementById('myFigure');
          t.style.background = "url('"+before+"')";
          t.style.backgroundSize = "700px 500px";
          var z = document.getElementById('divisor');
          z.style.background = "url('"+after+"')";
          z.style.backgroundSize = "700px 500px";
        });

        i = i + 1;
    });
  });
}

function createClickable(){
  var query = firebase.database().ref("photos").orderByKey();
  query.once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        name = childSnapshot.key;
        nameId = childSnapshot.val()['id'];

        if (nameId == id){
          finalId = id;
        }
      });
    });
}

function initMap() {
  var dublin = {lat: 53.355924, lng: -6.329348};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: dublin
  });

  var icon = {
    url: path, // url
    scaledSize: new google.maps.Size(50, 50), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
  };

  createMarker(icon);
  /*setTimeout(function() {
    console.log(marker);
    console.log(marker.length);
    marker.forEach(function(elem) {
      elem.addEventListener('click', function() {
        id = elem.id;
        console.log(id);
        createClickable();
        infowindow1.open(map, elem);
        var t = document.getElementById('myFigure');
        t.style.background = "url('"+before+"')";
        t.style.backgroundSize = "700px 500px";
        var z = document.getElementById('divisor');
        z.style.background = "url('"+after+"')";
        z.style.backgroundSize = "700px 500px";
      });
    });
  }, 1000);*/

}

function moveDivisor() {
  divisor.style.width = slider.value+"%";
}
