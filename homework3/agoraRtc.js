let handlefail = function(err){
  console.log(err);
}

function addVideoStream(streamId){
  let remoteContainer = document.getElementById("remoteStream");
  let streamDiv = document.createElement("div");
  streamDiv.id = streamId;
  streamDiv.style.transform = "rotateY(180deg)";
  streamDiv.style.height = "250px";
  remoteContainer.appendChild(streamDiv);
  // TODOfigure out how to get name then append it to the participants
}

// finish writing client code