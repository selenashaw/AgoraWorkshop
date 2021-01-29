let appId = "8104cf00c083443fba6e201ea26d19fd";

let globalStream;
let isAudioMuted = false;
let isVideoMuted = false;

let client = AgoraRTC.createClient({
  mode: "live",
  codec: "h264"
});

let handlefail = function(err) {
  console.log(err);
};

let roomnameDiv = document.getElementById("roomText");
let roomSpan = document.createElement("span");
roomSpan.textContent = getRoom();
let newline = document.createElement("br");
roomnameDiv.appendChild(newline);
roomnameDiv.appendChild(roomSpan);

client.init(appId, ()=> console.log("AgoraRTC Client Connected Successfully", handlefail));

let addVideoStream = function(streamId){
  let container = document.getElementById("host");
  let streamDiv = document.createElement("div");
  streamDiv.id = streamId;
  streamDiv.style.transform = "rotateY(180deg)";
  streamDiv.style.height = "10vh";
  streamDiv.style.width = "10vw;"
  container.appendChild(streamDiv);
};

let removeMyVideoStream = function(){
  globalStream.stop();
  let remDiv = document.getElementById(globalStream.getId());
  remDiv.parentNode.removeChild(remDiv);
};

let removeVideoStream = function(evt){
  let stream = evt.stream;
  stream.stop();
  let remDiv = document.getElementById(stream.getId());
  remDiv.parentNode.removeChild(remDiv);
}


  client.join(
    null,
    getRoom(),
    getName(),
    () =>{
      var localStream = AgoraRTC.createStream({
        video: true,
        audio: true,
      })

      localStream.init(function(evt) {
        addVideoStream(getName());
        localStream.play(getName());
        console.log("App id: ${appId}\nChannel id: ${channelName}");
        client.publish(localStream);
      });
      globalStream = localStream;
    }
  );

  client.on("stream-added", function(evt){
    client.subscribe(evt.stream,handlefail);
  });

  client.on("stream-subscribed", function(evt){
    console.log("Subscribed Stream");
    let stream = evt.stream;
    addVideoStream(stream.getId());
    stream.play(stream.getId());
  });

  client.on("stream-removed", removeVideoStream);

  client.on("peer-leave", function(evt) {
    removeVideoStream(evt);
  });

document.getElementById("leave").onclick = function(){
  client.leave(function() {
    console.log("Left the Call");
  }, handlefail);
  removeMyVideoStream();
}

document.getElementById("video").onclick = function() {
  if(!isVideoMuted) {
    globalStream.muteVideo();
  }
  else {
    globalStream.unmuteVideo();
  }
  isVideoMuted = !isVideoMuted;
};

document.getElementById("audio").onclick = function() {
  if(!isAudioMuted) {
    globalStream.muteAudio();
  }
  else {
    globalStream.unmuteAudio();
  }
  isAudioMuted = !isAudioMuted;
};