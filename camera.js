var camId = null;
var ltng = document.querySelector('#ltng');
initCam();

ltng.addEventListener('consolemessage', function(e) {
	if(e.message == '### showCam') startCamera();
});

$(".cameraDiv").hide();


$("#vid, #captureButton").click(function() {
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
	$(".cameraDiv").show();
	$(".webviewDiv").hide();

	var vidSettings = {
	    video: {
	      mandatory: {
	      	minWidth: 640,
	      	minHeight: 600,
	      	maxWidth: 640,
	      	maxHeight: 600
	      },
	      optional: [{
	        sourceId: camId
	      }]
	    },
	    audio:false
	};

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
	canvas.width = 640;
	canvas.height = 600;
	var ctx = canvas.getContext('2d');
	ctx.drawImage(frame, 0, 0);
	var imgData = canvas.toDataURL();

	pushDataToLTNG(imgData);
}

function pushDataToLTNG(imgData) {
	myCode =  "document.getElementById('imgData').value = '" + imgData + "'; ";
	myCode += "document.getElementById('showCCformButton').click(); ";

	ltng.executeScript({ code : myCode }, 
		function(x) {
			console.log('code pushed to LTNG');
			$(".cameraDiv").hide();
			$(".webviewDiv").show();
		}
	);	
}