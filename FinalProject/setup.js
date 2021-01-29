let validInputs = function() {
  let user = document.getElementById("username");
  let room = document.getElementById("room");

  if(user.value != "") {
    user.className = "";
    if(room.value != "") {
      room.className = "";
      window.localStorage.setItem("userName", user.value);
      window.localStorage.setItem("roomName", room.value);
      return true;
    }
    else {
      room.className = "badInput";
      return false;
    }
  }
  else {
    user.className = "badInput";
    return false;
  }
};

let getName = function() {
  return window.localStorage.getItem("userName");
}

let getRoom = function() {
  return window.localStorage.getItem("roomName");
}