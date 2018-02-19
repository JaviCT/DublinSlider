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
var map;
var name;
var nameId;
var id = -1;
var lat;
var lng;
var prev = 'https://firebasestorage.googleapis.com/v0/b/dublinslider.appspot.com/o/belvedereschool%2Fbelvederehouse%20old.jpg?alt=media&token=3bece55b-41e6-4572-8319-a93c1afe4114';
var description;
var before;
var after;
var finalId;
var marker = [];
var currentInfoWindow = null;

function createMarker(){

  var query = firebase.database().ref("photos");
  query.orderByChild("id").once("value")
    .then(function(snapshot) {
      var i = 0;
      snapshot.forEach(function(childSnapshot) {
        name = childSnapshot.key;
        nameId = childSnapshot.val()['id'];
        lat = childSnapshot.val()['lat'];
        lng = childSnapshot.val()['lng'];
        prev = childSnapshot.val()['after'];
        console.log(prev);
        if (prev == 'undefined'){
          prev = 'https://firebasestorage.googleapis.com/v0/b/dublinslider.appspot.com/o/belvedereschool%2Fbelvederehouse%20old.jpg?alt=media&token=3bece55b-41e6-4572-8319-a93c1afe4114';
        }
        if (lat != null || lng != null || prev != null){
          var myIcon = {
            url: prev, // url
            scaledSize: new google.maps.Size(100, 70), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
          };
          var location = {lat: lat, lng: lng};
          marker[i] = new google.maps.Marker({id: i+1, position: location, map: map, icon: myIcon});

          var divisor = document.getElementById("divisor");
          var slider = document.getElementById("slider");
          var handle = document.getElementById("handle");

          var contentString = '<p id="id"></p><strong id="desc"></strong><div id="comparison"> '+
            '<figure id="myFigure">' +
              '<div id="divisor"></div>' +
            '</figure>' +
            '<input type="range" min="0" max="100" value="50" id="slider" oninput="moveDivisor()">' +
          '</div>';
          var infowindow1 = new google.maps.InfoWindow({
            content: contentString
          });

           google.maps.event.addListener(marker[i], 'click', function() {
            id = this.id;
            createClickable(id);
            if (currentInfoWindow != null) {
            currentInfoWindow.close();
            }
            infowindow1.open(map, this);
            currentInfoWindow = infowindow1;
            setTimeout(function() {
              var t = document.getElementById('myFigure');
              t.style.background = "url('"+after+"')";
              t.style.backgroundSize = "700px 500px";
              var z = document.getElementById('divisor');
              z.style.background = "url('"+before+"')";
              z.style.backgroundSize = "700px 500px";
              var y = document.getElementById('desc');
              y.innerHTML=description;
              var u = document.getElementById('id');
              u.innerHTML= id;
            }, 600);

          });
          console.log(i);
          i = i + 1;
        }
    });
    /*var styles = [
      [{
        url: 'https://googlemaps.github.io/js-marker-clusterer/images/people35.png',
        height: 35,
        width: 35,
        anchor: [16, 0],
        textColor: '#ff00ff',
        textSize: 10
      }, {
        url: 'https://googlemaps.github.io/js-marker-clusterer/images/people45.png',
        height: 45,
        width: 45,
        anchor: [24, 0],
        textColor: '#ff0000',
        textSize: 11
      }, {
        url: 'https://googlemaps.github.io/js-marker-clusterer/images/people55.png',
        height: 55,
        width: 55,
        anchor: [32, 0],
        textColor: '#ffffff',
        textSize: 12
      }],
      [{
        url: 'https://googlemaps.github.io/js-marker-clusterer/images/conv30.png',
        height: 27,
        width: 30,
        anchor: [3, 0],
        textColor: '#ff00ff',
        textSize: 10
      }, {
        url: 'https://googlemaps.github.io/js-marker-clusterer/images/conv40.png',
        height: 36,
        width: 40,
        anchor: [6, 0],
        textColor: '#ff0000',
        textSize: 11
      }, {
        url: 'https://googlemaps.github.io/js-marker-clusterer/images/conv50.png',
        width: 50,
        height: 45,
        anchor: [8, 0],
        textSize: 12
      }],
      [{
        url: 'https://googlemaps.github.io/js-marker-clusterer/images/heart30.png',
        height: 26,
        width: 30,
        anchor: [4, 0],
        textColor: '#ff00ff',
        textSize: 10
      }, {
        url: 'https://googlemaps.github.io/js-marker-clusterer/images/heart40.png',
        height: 35,
        width: 40,
        anchor: [8, 0],
        textColor: '#ff0000',
        textSize: 11
      }, {
        url: 'https://googlemaps.github.io/js-marker-clusterer/images/heart50.png',
        width: 50,
        height: 44,
        anchor: [12, 0],
        textSize: 12
      }],
      [{
        url: 'https://googlemaps.github.io/js-marker-clusterer/images/pin.png',
        height: 48,
        width: 30,
        anchor: [-18, 0],
        textColor: '#ffffff',
        textSize: 10,
        iconAnchor: [15, 48]
      }]
    ];

    markerClusterer = new MarkerClusterer(map, marker, {
      styles: styles[5]
    });*/
  });
}

function createClickable(numer){
  var query = firebase.database().ref("photos");
  query.orderByChild("id").once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        name = childSnapshot.key;
        nameId = childSnapshot.val()['id'];

        if (nameId == numer){
          finalId = id;
          console.log(finalId);
          description = childSnapshot.val()['description'];
          before = childSnapshot.val()['before'];
          after = childSnapshot.val()['after'];
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

  createMarker();
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
