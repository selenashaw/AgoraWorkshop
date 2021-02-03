let appId = "8104cf00c083443fba6e201ea26d19fd";

let globalStream;
let isAudioMuted = false;
let isVideoMuted = false;
let isScreenShare = false;
let isChatOpen = false;
let channelName = "textChat";
let channel;

let myName = getName();

let rtm = AgoraRTM.createInstance(appId);

let client = AgoraRTC.createClient({
  mode: "live",
  codec: "h264"
});

let handlefail = function(err) {
  console.log(err);
};

let roomnameDiv = document.getElementById("roomText");
let roomSpan = document.createElement("span");
roomSpan.style.fontSize = "1.2rem";
roomSpan.textContent = getRoom();
roomnameDiv.appendChild(roomSpan);

client.init(appId, ()=> console.log("AgoraRTC Client Connected Successfully", handlefail));

rtm.login({uid:getName()}).then(() => {
  channel = rtm.createChannel(channelName);
  channel.join();
  console.log("Channel created and joined.");
}).catch(error => {handlefail});

if(channel !== undefined) {
  channel.onChannelTestMessage(function(message, id) {
    let chat = document.getElementById("chat");
    let messagespan = document.createElement("span");
    messagespan.textContent = message;
    let newline = document.createElement("br");
    chat.append(messagespan);
    chat.append(newline);
    console.log(message);
  });
}

let addVideoStream = function(streamId, isMyStream){
  let container = document.getElementById("myStream");
  let streamDiv = document.createElement("div");
  streamDiv.id = streamId;
  if (!isMyStream) {
    streamDiv.style.transform = "rotateY(180deg)";
  }
  streamDiv.style.height = "15vw";
  streamDiv.style.width= "20vw";
  streamDiv.style.textAlign="justify";
  streamDiv.style.marginRight = "5px";
  streamDiv.style.display = "inline-block";
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
      screen: false,
      screenAudio: false
    })
    localStream.init(function(evt) {
      addVideoStream(getName(), true);
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
  if(stream.params.streamId === "ScreenShare") {
    stream.play('centerScreen');
  }
  else {
    addVideoStream(stream.getId(), false);
    stream.play(stream.getId());
  }
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
  channel.leave();
  rtm.logout();
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

document.getElementById("screenshare").onclick = function() {
  let screenshare = AgoraRTC.createStream({
    streamId: "ScreenShare",
    video: false,
    audio: false,
    screen: true,
    screenAudio: true
  })
  if(!isScreenShare) {
    screenshare.init(function() {
      screenshare.play('centerScreen');
      client.publish(screenshare);
    }, handlefail());
    
    // let params = {
    //   videoDimensions: {
    //     // converting vh and vw to pixels
    //     width: (document.documentElement.clientWidth * 60) / 100,
    //     height: (document.documentElement.clientHeight * 75) / 100
    //   },
    //   frameRate: 15,
    //   captureMouseCursor: true
    // };

    // screenTrack.StartScreenCaptureByScreenRect(rect, rect, params);
  }
  else {
    //StopScreenCapture();
  }
  isScreenShare = !isScreenShare
}

document.getElementById("chatButton").onclick = function() {
  let chatbox = document.getElementById("chat");
  let msginput = document.getElementById("messageInput");
  if(!isChatOpen) {
    chatbox.style.display = "block";
    msginput.style.display = "block";
  } 
  else {
    chatbox.style.display = "none";
    msginput.style.display = "none";
  }
  isChatOpen = !isChatOpen;
}

document.getElementById("send").onclick = function() {
  let message = document.getElementById("message").value;
  message = myName + ": " + message;
  document.getElementById("message").value ="";
  channel.sendMessage({ text: message }).then(() => {
    let chat = document.getElementById("chat");
    let messagespan = document.createElement("span");
    messagespan.textContent = message;
    let newline = document.createElement("br");
    chat.append(messagespan);
    chat.append(newline);
    console.log("Message sent");
  }).catch(error => {handlefail});
}


