const video = document.getElementById("video");

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/model'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/model'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/model'),
    faceapi.nets.faceExpressionNet.loadFromUri('/model'),    
]).then(startVideo)

function startVideo(){
    navigator.getUserMedia(
        { video:{} },
        stream => video.srcObject  = stream,
        err => console.log(err)
    )
}

video.addEventListener('play', ()=>{
    const canvans = faceapi.createCanvasFromMedia(video)
    document.body.append(canvans)
    const displaysize = { width:video.width, height:video.height }
    faceapi.matchDimensions(canvans,displaysize)
    setInterval( async()=>{
        const detections = await faceapi.detectAllFaces(video,new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks
        ().withFaceExpressions()
        console.log(detections);
        const resizceDetections = faceapi.resizeResults(detections,displaysize)
        canvans.getContext('2d').clearRect(0,0,canvans.width,canvans.height)
        faceapi.draw.drawDetections(canvans,resizceDetections)
        faceapi.draw.drawFaceLandmarks(canvans,resizceDetections)
        faceapi.draw.drawFaceExpressions(canvans,resizceDetections)

    },100)
})
