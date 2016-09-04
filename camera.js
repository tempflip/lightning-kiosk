var camId = null;
var ltng = document.querySelector('#ltng');

initCam();



// event handlers
$("#startCamera").click(function() {
	startCamera();
});

$("#vid").click(function() {
	captureFrame();
});


function initCam() {
	// getting the camera id
	MediaStreamTrack.getSources(function(cams) {
		cams.forEach(function(e) {
			if (e.kind == 'video') camId = e.id;

		});
	});
}

function startCamera() {
	var vidSettings = {
	    video: {
	      optional: [{
	        sourceId: camId
	      }]
	    },
	    audio:false
	}

	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
	console.log(navigator.getUserMedia);

	navigator.getUserMedia(vidSettings, function(stream) {
		var videoElm = document.querySelector('video');
   		videoElm.src = URL.createObjectURL(stream);
  	}, function(e) {
    	console.error(e);
  	});
}


function captureFrame() {
	var frame = document.getElementById('vid');
	var canvas = document.createElement('canvas');
	canvas.width = frame.width;
	canvas.height = frame.height;
	var ctx = canvas.getContext('2d');
	ctx.drawImage(frame, 0, 0);

	var imgData = canvas.toDataURL();

	createShot(imgData);
	pushDataToLTNG(imgData);
}

function createShot(data) {
	var img = $("<img/>");
	img.attr("src", data);
	img.attr("width", 100);
	img.attr("height", 75);
	$('#shots').append(img);
}

function pushDataToLTNG(imgData) {
	myCode = "document.getElementById('imgData').value = '" + imgData + "';";

	ltng.executeScript({ code : myCode }, 
		function(x) {
			console.log('code pushed to LTNG');
		}
	);	
}