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

var storage = firebase.storage().ref();
var map;
var name;
var nameId;
var id = -1;
var lat;
var lng;
var prev = 'https://firebasestorage.googleapis.com/v0/b/dublinslider.appspot.com/o/belvedereschool%2Fbelvederehouse%20old.jpg?alt=media&token=3bece55b-41e6-4572-8319-a93c1afe4114';
var description;
var before;
var dAfter;
var dBefore;
var after;
var finalId;
var marker = [];
var currentInfoWindow = null;
var query = firebase.database().ref("photos");
var slider2 = [];
var handle2 = [];
var z2= [];
var newLat;
var newLng;
var newId = 1;
var phone;
var contentStringAbout = '<label class="form15">After photo:</label><label>Year:</label><br><input id="photoAfter" name="after" class="form13" type="file"><input id ="daAfter" class="form14" name="daAfter" type="text"><br>' +
'<label class="form15">Before photo:</label><label>Year:</label><br><input id="photoBefore" class="form13" name="before" type="file"><input id ="daBefore" class="form14" name="daBefore" type="text"><br>' +
'<label>Description:</label><br><input id ="myDescription" class="form1" name="description" type="text"><br>' +
'<div class="form12"><label>Enter a direction, drag and set the marker:</label><br><input class="form11" id="address" name="location" type="text">' +
'<button class="btn btn-default" id="submit" name="submit" type="submit">Find</button></div>' +
'<div id="map2"></div>' +
'<button class="btn btn-default" id="send" name="submit" type="submit">Send</button>';

var contentStringAbout2 = '<div id="contenedor" style="background-color:white;"><label class="form15">After photo:</label><label>Year:</label><br><input id="photoAfter" name="after" class="form13" type="file"><input id ="daAfter" class="form14" name="daAfter" type="text"><br>' +
'<label class="form15">Before photo:</label><label>Year:</label><br><input id="photoBefore" class="form13" name="before" type="file"><input id ="daBefore" class="form14" name="daBefore" type="text"><br>' +
'<label>Description:</label><br><input id ="myDescription" class="form1" name="description" type="text"><br>' +
'<div class="form12"><label>Enter a direction, drag and set the marker:</label><br><input class="form11" id="address" name="location" type="text">' +
'<button class="btn btn-default" id="submit" name="submit" type="submit">Find</button></div>' +
'<div id="map2"></div>' +
'<button class="btn btn-default" id="send2" name="submit" type="submit">Send</button><button class="btn btn-default" id="cancel" name="submit" type="submit">cancel</button></div>';

var contentString2 = '<div id="comparison"> '+
  '<div class="textContainer"><div id="menu"><ul class="mainmenu">' +
      '<li><a id="options"><i class="fas fa-ellipsis-v"></i></a>' +
        '<ul class="submenu">' +
          '<li><a id="btn-modify" class="buttons">Modify</a></li>' +
          '<li><a id="btn-remove" class="buttons">Remove</a></li>' +
  '<ul></li></ul></div>' +
    '<strong id="desc"></strong><div id="close"><div class="orangeBox"><span id="x">X</span></div><span></span></a></div></div><figure id="myFigure">' +
    '<div class="dateContainer1"><strong id="datBefore"></strong></div>' +
    '<div class="dateContainer2"><strong id="datAfter"></strong></div>' +
    '<div id="handle"></div>' +
    '<div id="divisor"></div>' +
  '</figure>' +
  '<input type="range" min="0" max="100" value="50" id="slider" oninput="moveDivisor()">' +
'</div><strong class="dateAfter"></strong><strong class="dateBefore"></strong>';

function createMarker(){
  $("#content2").empty();
  query.orderByChild("id").once("value")
    .then(function(snapshot) {
      var i = 0;
      newId = 1;
      snapshot.forEach(function(childSnapshot) {
        name = childSnapshot.key;
        nameId = childSnapshot.val()['id'];
        lat = childSnapshot.val()['lat'];
        lng = childSnapshot.val()['lng'];
        prev = childSnapshot.val()['before'];

        while (nameId != newId){
          newId = newId + 1;
        }

        if (lat != null || lng != null || prev != null){
          var myIcon = {
            url: prev, // url
            scaledSize: new google.maps.Size(64, 64), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(0, 0)
          };
          var location = {lat: lat, lng: lng};
          marker[i] = new google.maps.Marker({id: newId, position: location, map: map, icon: myIcon});
          var myoverlay = new google.maps.OverlayView();
           myoverlay.draw = function () {
               this.getPanes().markerLayer.id='markerLayer';
           };
           myoverlay.setMap(map);

          var divisor = document.getElementById("divisor");
          var slider = document.getElementById("slider");
          var handle = document.getElementById("handle");

          var contentString = '<div id="container"><div id="comparison"> '+
            '<div class="textContainer"><div id="menu"><ul class="mainmenu">' +
                '<li><a id="options"><i class="fas fa-ellipsis-v"></i></a>' +
                  '<ul class="submenu">' +
                    '<li><a id="btn-modify" class="buttons">Modify</a></li>' +
                    '<li><a id="btn-remove" class="buttons">Remove</a></li>' +
            '<ul></li></ul></div>' +
              '<strong id="desc"></strong><div id="close"><div class="orangeBox"><span id="x">X</span></div><span></span></a></div></div><figure id="myFigure">' +
              '<div class="dateContainer1"><strong id="datBefore"></strong></div>' +
              '<div class="dateContainer2"><strong id="datAfter"></strong></div>' +
              '<div id="handle"></div>' +
              '<div id="divisor"></div>' +
            '</figure>' +
            '<input type="range" min="0" max="100" value="50" id="slider" oninput="moveDivisor()">' +
          '</div><strong class="dateAfter"></strong><strong class="dateBefore"></strong></div>';
          var contentStringBar = '<div class="container2"><div class="comparison2"> '+
            '<figure class="myFigure2">' +
              '<div class="textContainer2"><strong class="desc2"></strong></div>' +
              '<div class="dateContainer1"><strong class="dateBefore"></strong></div>' +
              '<div class="dateContainer2"><strong class="dateAfter"></strong></div>' +
              '<div class="handle2"></div>' +
              '<div class="divisor2"></div>' +
            '</figure>' +
            '<input type="range" min="0" max="100" value="50" class="slider2" oninput="moveDivisor2('+i+')">' +
          '</div></div>';
          document.getElementById("content2").innerHTML += contentStringBar;
          var infowindow1 = new google.maps.InfoWindow({
            content: contentString
          });

          $('#container2').on('click', function(e) {
              alert(1);
          });

          slider2 = document.getElementsByClassName("slider2");
          handle2 = document.getElementsByClassName("handle2");
          z2 = document.getElementsByClassName("divisor2");

          var t2 = document.getElementsByClassName("myFigure2");
          var u2 = document.getElementsByClassName("container2");
          var y2 = document.getElementsByClassName('desc2');

          var dateAfter = document.getElementsByClassName("dateAfter");
          var dateBefore = document.getElementsByClassName("dateBefore");

          dAfter = childSnapshot.val()['dateAfter'];
          dBefore = childSnapshot.val()['dateBefore'];
          description = childSnapshot.val()['description'];
          before = childSnapshot.val()['before'];
          after = childSnapshot.val()['after'];

          var img3 = new Image();
          var img4 = new Image();
          img3.src = after;
          img4.src = before;

          t2[i].style.background = "url('"+after+"')";
          z2[i].style.background = "url('"+before+"')";
          if (img3.width >= img3.height){
            t2[i].style.backgroundSize = "500px 300px";
            z2[i].style.backgroundSize = "500px 300px";
            u2[i].style.backgroundSize = "500px 300px";
          } else{
            t2[i].style.backgroundSize = "300px 500px";
            z2[i].style.backgroundSize = "300px 500px";
            u2[i].style.backgroundSize = "300px 500px";
          }
          y2[i].innerHTML= description;
          dateAfter[i].innerHTML = dAfter;
          dateBefore[i].innerHTML= dBefore;

          google.maps.event.addListener(infowindow1, 'domready', function() {
            var iwOuter = $('.gm-style-iw');
            var iwBackground = iwOuter.prev();

            iwBackground.children(':nth-child(2)').css({'display' : 'none'});
            iwBackground.children(':nth-child(4)').css({'display' : 'none'});
            var iwCloseBtn = iwOuter.next();

            iwCloseBtn.css({'display' : 'none'});

            if($('.iw-content').height() < 140){
              $('.iw-bottom-gradient').css({display: 'none'});
            }
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
              var img = new Image();
              var img2 = new Image();
              img.src = after;
              img2.src = before;
              var t = document.getElementById('myFigure');
              t.style.background = "url('"+after+"')";
              var z = document.getElementById('divisor');
              var u = document.getElementById('container');
              z.style.background = "url('"+before+"')";
              var element2 = document.getElementById("comparison");
              if (img.width >= img.height){
                if (phone){
                  element2.classList.add("comparisonP");
                  t.style.backgroundSize = "300px 300px";
                  z.style.backgroundSize = "300px 300px";
                  u.style.backgroundSize = "300px 300px";
                }else{
                  element2.classList.add("comparisonD");
                  t.style.backgroundSize = "700px 500px";
                  z.style.backgroundSize = "700px 500px";
                  u.style.backgroundSize = "700px 500px";
                }

              } else{
                if (phone){
                  element2.classList.add("comparisonP");
                  t.style.backgroundSize = "300px 300px";
                  z.style.backgroundSize = "300px 300px";
                  u.style.backgroundSize = "300px 300px";
                }else{
                  element2.classList.add("comparisonD");
                  t.style.backgroundSize = "700px 500px";
                  z.style.backgroundSize = "700px 500px";
                  u.style.backgroundSize = "700px 500px";
                }
              }
              var y = document.getElementById('desc');
              y.innerHTML = description;
              var datAfter = document.getElementById('datAfter');
              var datBefore = document.getElementById('datBefore');
              datAfter.innerHTML = dAfter;
              datBefore.innerHTML = dBefore;
            }, 800);
            $( "#close" ).click(function() {
              infowindow1.close();
            });

            $( "#btn-modify" ).click(function() {
              $("#container").empty();
              document.getElementById("container").innerHTML += contentStringAbout2;
              var dublin2 = {lat: 53.355924, lng: -6.329348};
              var map2 = new google.maps.Map(document.getElementById('map2'), {
                zoom: 12,
                center: dublin2
              });
              var directionsService = new google.maps.DirectionsService;
              var direction = new google.maps.DirectionsRenderer({
                draggable:true,
                map: map2
              })
              var geocoder = new google.maps.Geocoder();
              document.getElementById('submit').addEventListener('click', function() {
                geocodeAddress(geocoder, map2);
              });
              $("#cancel").click(function(){
                $("#container").empty();
                document.getElementById("container").innerHTML += contentString2;
                infowindow1.close();
              });
            });

            $( "#btn-remove" ).click(function() {
              infowindow1.close();
              query.orderByChild('id').equalTo(finalId)
                  .once('value').then(function(snapshot) {
                      snapshot.forEach(function(childSnapshot) {
                      //remove each child
                      query.child(childSnapshot.key).remove();
                  });
              });
            });

            $( "#send2" ).click(function() {
              var fileAfter = $('#photoAfter').get(0).files[0];
              var fileBefore =  $('#photoBefore').get(0).files[0];
              var bla = $('#myDescription').val();
              var daAfter = $('#daAfter').val();
              var daBefore = $('#daBefore').val();
              infowindow1.close();
              query.orderByChild('id').equalTo(finalId)
                  .once('value').then(function(snapshot) {
                      snapshot.forEach(function(childSnapshot) {
                      //remove each child
                      var key = query.push().key;
                      var update={};
                      if(fileAfter != null){
                        update[key]={
                          after : fileAfter
                        }
                      }
                      if(fileBefore != null){
                        update[key]={
                          before : fileBefore
                        }
                      }
                      if(bla != null){
                        update[key]={
                          description : bal
                        }
                      }
                      if(daAfter != null){
                        update[key]={
                          dateAfter : daAfter
                        }
                      }
                      if(daBefore != null){
                        update[key]={
                          dateBefore : daBefore
                        }
                      }
                  });
              });
            });

          });
          google.maps.event.addListener(map, 'click', function() {
            infowindow1.close();
          });
          i = i + 1;
          newId = newId + 1;
        }
    });

    var styles = [
      [{
        url: "https://firebasestorage.googleapis.com/v0/b/dublinslider.appspot.com/o/gpo2%2FGPO%202%20old.jpg?alt=media&token=d7bb30f2-f7bc-41df-bd50-1393a8971ad0",
        height: 64,
        width: 64,
        anchor: [16, 0],
        textColor: '#2E2EFE',
        textSize: 100,
        iconAnchor: [32, 0]
      }]
    ];

    var options = {
      cssClass: 'custom-pin',
      zoomOnClick: true,
      maxZoom: 40
    };
    /*var options = {
      imagePath: 'images/m'
    };*/

    markerClusterer = new MarkerClusterer(map, marker, options);
  });
}

function createClickable(numer){
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

function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('address').value;
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
      resultsMap.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        draggable:true,
        map: resultsMap,
        position: results[0].geometry.location
      });
      var position = results[0].geometry.location;
      newLat = parseFloat(position.lat().toFixed(6));
      newLng = parseFloat(position.lng().toFixed(6));
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function detectBrowser() {
  var useragent = navigator.userAgent;
  var mapdiv = document.getElementById("map");

  if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
    phone = true;
  } else {
    phone = false;
  }
}

function initMap() {



  detectBrowser();
  var element = document.getElementById("miLogo");
  if (phone){

    element.classList.add("logoP");
  }
  else {
    element.classList.add("logo");
  }
  var dublin = {lat: 53.352873, lng: -6.277350};
  var styleOptions = [
          {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
          {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
          {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
          {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{color: '#263c3f'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{color: '#6b9a76'}]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{color: '#38414e'}]
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{color: '#212a37'}]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{color: '#9ca5b3'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{color: '#746855'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{color: '#1f2835'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{color: '#f3d19c'}]
          },
          {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{color: '#2f3948'}]
          },
          {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{color: '#17263c'}]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{color: '#515c6d'}]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{color: '#17263c'}]
          },
          {
            featureType: "all",
            elementType: "labels",
            stylers: [
              { visibility: "off" }
            ]
          },
          {
            featureType: "road",
            elementType: "labels",
            stylers: [
              { visibility: "on" }
            ]
          }
        ];
  var styledMap = {
    name: 'Map'
  }
  var mapOptions= {
    zoom: 15,
    center: dublin,
    mapTypeControl: true,
    mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_CENTER,
        mapTypeIds: [google.maps.MapTypeId.SATELLITE, "custom_map"]
    },
    styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: "all",
              elementType: "labels",
              stylers: [
                { visibility: "off" }
              ]
            },
            {
              featureType: "road.satellite",
              elementType: "labels",
              stylers: [
                { visibility: "off" }
              ]
            }
          ],
    mapTypeId: "custom_map",
    fullscreenControl: true
  }
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  var customMap = new google.maps.StyledMapType(styleOptions, styledMap);
  map.mapTypes.set("custom_map", customMap);

  var nn = 19;
  google.maps.event.addListener(map, 'zoom_changed', function() {
    if (map.getZoom() > nn) {
      map.setZoom(nn);
    };
  });

  createMarker();

  $("#btn-about").on('click', firstClick)

  $('.myType').each(function() {
   var elem = $(this);

   // Save current value of element
   elem.data('oldVal', elem.val());

   // Look for changes in the value
   elem.bind("propertychange change click keyup input paste", function(event){
      // If value has changed...
      if (elem.data('oldVal') != elem.val()) {
       // Updated stored value
       elem.data('oldVal', elem.val());

       var esto = document.getElementById("new").value;
       $("#content2").empty();

       query.orderByChild("id").once("value")
         .then(function(snapshot) {
           var i = 0;
           snapshot.forEach(function(childSnapshot){
             description = childSnapshot.val()['description'];
             var comp = description.includes(esto);

             console.log(comp);
             if(comp == true){
               var contentStringBar = '<div class="container2"><p id="id"></p><div class="comparison2"> '+
                 '<figure class="myFigure2">' +
                   '<div class="textContainer2"><strong class="desc2"></strong></div>' +
                   '<div class="dateContainer1"><strong class="dateBefore"></strong></div>' +
                   '<div class="dateContainer2"><strong class="dateAfter"></strong></div>' +
                   '<div class="handle2"></div>' +
                   '<div class="divisor2"></div>' +
                 '</figure>' +
                 '<input type="range" min="0" max="100" value="50" class="slider2" oninput="moveDivisor2('+i+')">' +
               '</div></div>';
               document.getElementById("content2").innerHTML += contentStringBar;
               console.log(contentStringBar);

               slider2 = document.getElementsByClassName("slider2");
               handle2 = document.getElementsByClassName("handle2");
               z2 = document.getElementsByClassName("divisor2");

               var t2 = document.getElementsByClassName("myFigure2");
               var u2 = document.getElementsByClassName("container2");
               var y2 = document.getElementsByClassName('desc2');
               var dateAfter = document.getElementsByClassName("dateAfter");
               var dateBefore = document.getElementsByClassName("dateBefore");

               dAfter = childSnapshot.val()['dateAfter'];
               dBefore = childSnapshot.val()['dateBefore'];
               description = childSnapshot.val()['description'];
               before = childSnapshot.val()['before'];
               after = childSnapshot.val()['after'];

               var img3 = new Image();
               var img4 = new Image();
               img3.src = after;
               img4.src = before;

               t2[i].style.background = "url('"+after+"')";
               z2[i].style.background = "url('"+before+"')";
               if (img3.width >= img3.height){
                 t2[i].style.backgroundSize = "500px 300px";
                 z2[i].style.backgroundSize = "500px 300px";
                 u2[i].style.backgroundSize = "500px 300px";
               } else{
                 t2[i].style.backgroundSize = "300px 500px";
                 z2[i].style.backgroundSize = "300px 500px";
                 u2[i].style.backgroundSize = "300px 500px";
               }
               y2[i].innerHTML=description;
               dateAfter[i].innerHTML = dAfter;
               dateBefore[i].innerHTML= dBefore;
               i = i + 1;
             }
           });

         });
     }
   });
 });

 $(function(){
	var switches =
	{
		"hamburger": "arrow",
		"arrow": "hamburger"
	};

	$(".material-icon").on("click", function (argument)
	{
		icon = $(this).data("icon"),
		newIcon = switches[icon];
		if (newIcon)
		{
			$(this).removeClass(icon).addClass(newIcon).data("icon", newIcon);
		}
	});

	$(".menuToggle").on("click", function()
	{
		$(".searchCont").toggleClass('sidebar-active');
		$(".material-icon").toggleClass('menu-icon-sidebar');
	});
});
}

function writeUserData(after, before, dateAfter, dateBefore, description, id, lat, long) {
  firebase.database().ref('photos/' + description).set({
    after: after,
    before: before,
    dateAfter: dateAfter,
    dateBefore: dateBefore,
    description : description,
    id : id,
    lat : lat,
    lng : long
  });
}

function moveDivisor() {
  handle.style.left = slider.value+"%";
	divisor.style.width = slider.value+"%";
}

function moveDivisor2(i) {
  handle2[i].style.left = slider2[i].value+"%";
	z2[i].style.width = slider2[i].value+"%";
}

function firstClick() {
    $("#btn-about").off('click').on('click', secondClick)
    $("#content2").empty();

    document.getElementById("content2").innerHTML += contentStringAbout;
    var dublin2 = {lat: 53.355924, lng: -6.329348};
    var map2 = new google.maps.Map(document.getElementById('map2'), {
      zoom: 12,
      center: dublin2
    });
    var directionsService = new google.maps.DirectionsService;
    var direction = new google.maps.DirectionsRenderer({
      draggable:true,
      map: map2
    })
    var geocoder = new google.maps.Geocoder();
    document.getElementById('submit').addEventListener('click', function() {
      geocodeAddress(geocoder, map2);
    });

    $('#send').click(function(){
      var fileAfter = $('#photoAfter').get(0).files[0];
      var fileBefore =  $('#photoBefore').get(0).files[0];
      var bla = $('#myDescription').val();
      var daAfter = $('#daAfter').val();
      var daBefore = $('#daBefore').val();
      if(fileAfter == null || fileBefore == null){
        alert("You should enter image");
      } else{
        var nameAfter = fileAfter.name;
        var nameBefore = fileBefore.name;
        var metadataAfter = { contentType: fileAfter.type };
        var metadataBefore = { contentType: fileBefore.type };
        var taskAfter = storage.child(bla + "/" + nameAfter).put(fileAfter, metadataAfter);
        var taskBefore = storage.child(bla + "/" + nameBefore).put(fileBefore, metadataBefore);
        // Listen for state changes, errors, and completion of the upload.
        taskAfter.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          function(snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
          }, function(error) {

          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;

            case 'storage/canceled':
              // User canceled the upload
              break;

            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        }, function() {
          // Upload completed successfully, now we can get the download URL
          taskBefore.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function(snapshot) {
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                  console.log('Upload is paused');
                  break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                  console.log('Upload is running');
                  break;
              }
            }, function(error) {

            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;

              case 'storage/canceled':
                // User canceled the upload
                break;

              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
          }, function() {
            // Upload completed successfully, now we can get the download URL
            var urlBefore = taskBefore.snapshot.downloadURL;
            console.log(urlBefore);
            var urlAfter = taskAfter.snapshot.downloadURL;
            console.log(urlAfter);
            console.log(bla);
            console.log(newLat);
            console.log(newLng);
            console.log(newId);
            writeUserData(urlAfter, urlBefore, daAfter, daBefore, bla, newId, newLat, newLng);
            $("#content2").empty();
            createMarker();
            google.maps.event.trigger(map, 'resize');
            newId = newId + 1;
          });
        });
      }
    });
    $("#btn-about").text("");
    var node = document.createElement("i");
    var textnode = document.createTextNode("");
    node.appendChild(textnode);
    document.getElementById("btn-about").appendChild(node);
    $('i').addClass( "fas fa-arrow-left" );
}

function secondClick() {
    $("#btn-about").off('click').on('click', firstClick);
    createMarker();
    $("#btn-about").text("About");
}
