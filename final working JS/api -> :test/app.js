var chatShown = false;
var chatRequest = "http://54.171.115.230:8080/api/v1/chats/test";

// open and close the chat windows
function chatCall() {
  if(chatShown) {
    userClick({'text': 'chatClosing'});
    chatShown = false;
    chatHide();
  }else{
    userClick({text: 'chatOpening'});
    chatShown = true;
    chatShow();
  }
}

// sending the user current page to the api
window.onload = function connection() {
  var data = {currentUrl: ''};
  data.currentUrl = window.location.href;
  if(localStorage.sessionId)
    data.sessionId = localStorage.sessionId;

  var chatApi = new XMLHttpRequest();
  chatApi.open("POST", chatRequest);
  chatApi.setRequestHeader("Content-Type", "application/json");
  chatApi.send(JSON.stringify(data));
chatId
  chatApi.onreadystatechange = function () {
    if (chatApi.readyState == 4 && chatApi.status == 200) {
      responseAnalyse(chatApi.responseText);
    }
  }
}

// open the chat windows
function chatShow() {
  document.getElementById('chat').innerHTML = "<div id='chatFenetre'><div id='nameDiv'></div><div id='conversation'></div><div id='inputArea'><input type='text' placeholder='message' id='message' onkeypress='chatListener(event)' autofocus><button class='messageSubmit' onclick='send()' id='chatBtn'>&#10148;</button></div></div>";
  document.getElementById('nameDiv').innerHTML = "<img class='titleAssistantPicture' src='http://cache.magazine-avantages.fr/data/photo/w670_h670_c1/3v/7dd91e1113f820425.jpg'><div id='assistantLegend'><p class='assistantName'><strong>Alice</strong><br/>Digital Assistant</p><div class='reduce'><button class='reducerButton' onclick='chatCall();'> close _ </button></div></div>";

  //look for user name into the localStorage
  if(!localStorage.user){
    newUser();
  }else{
    chatContentLoader();
  }
}

function chatHide() {
  document.getElementById('chat').innerHTML = "";
}

// adding a new user to the localStorage will be use next in the chat
function newUser() {
  var pseudo = prompt("What's your name ?");
  localStorage.user = pseudo;
  localStorage.messageId = 0;
}

//Show the chat messsages and images to the user into the chat window
function chatContentLoader(){
  for (var i = 1; i < parseInt(localStorage.messageId) + 1; i++) {
    if(localStorage.getItem(i + "author") != 'Server'){
      document.getElementById('conversation').innerHTML += "<div class='userCorpus msg'><img class='chatProfilPicture' src='https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQqOY59Wk7dlgWX7ipKEDAA-JS8fNVAaz8pQJvQLg7kgCtYsU0g'><p id='" + i + "messageCorpus'></p></div>";

    }else{
      document.getElementById('conversation').innerHTML += "<div class='serverCorpus msg'><img class='chatProfilPicture' src='http://cache.magazine-avantages.fr/data/photo/w670_h670_c1/3v/7dd91e1113f820425.jpg'><p id='" + i + "messageCorpus'></p><div id='" + i + "info' class='proposition'></div></div>";
    }

    document.getElementById(i + 'messageCorpus').innerHTML +=  "<dt>" + localStorage.getItem(i + "author") + "</dt>";
    document.getElementById(i + 'messageCorpus').innerHTML += "<dd>" + localStorage.getItem(i + "message") + "</dd>";

    if(localStorage.getItem(i + "cat") == 'p'){
      document.getElementById(i + 'info').innerHTML += "<div id='" + i + "picturesCorpus' class='picturesCorpus'></div>";
      for (var j = 0; j < localStorage.getItem( i + 'nbEntities'); j++) {

        document.getElementById(i + 'picturesCorpus').innerHTML += "<div class='chatImgDiv'><img class='img-thumbnail' src='" + localStorage.getItem(i + 'imgUrl' + j) + "' id='chatImg' name='image' onclick='javascript:displayModal(" + i + "," + j + ")'><p class='imgName'>" + localStorage.getItem(i + 'productName' + j) + "</p></div>";
      }
    }

    if(localStorage.getItem(i + "cat") == 'm'){
      document.getElementById(i + 'info').innerHTML += "<div id='" + i + "multiCorpus' class='multiCorpus' ></div>";
      for (var j = 0; j < localStorage.getItem( i + 'nbEntities'); j++) {

        if(localStorage.getItem( i + 'choosed') == j){
          document.getElementById(i + 'multiCorpus').innerHTML += "<button type='button' class='btn btn-success'>" + localStorage.getItem(i + "name" + j) + "</button> ";

        }else if(localStorage.getItem( i + 'choosed') == '-1'){
          document.getElementById(i + 'multiCorpus').innerHTML += "<button type='button' class='btn btn-info' onclick='optionChoice(" + i + ", " + j + ")'>" + localStorage.getItem(i + "name" + j) + "</button> ";

        }else{
          document.getElementById(i + 'multiCorpus').innerHTML += "<button type='button' class='btn btn-default'>" + localStorage.getItem(i + "name" + j) + "</button> ";
        }
      }
    }

    if(localStorage.getItem(i + "cat") == 'q'){
      document.getElementById(i + 'info').innerHTML += "<div id='" + i + "questionCorpus' class='multiCorpus' ></div>";

      if(localStorage.getItem(i + 'code') == 'photo'){
        document.getElementById(i + 'questionCorpus').innerHTML += "<form taget='_blank' action='http://54.171.115.230:8080/api/v1/chats/test', method='POST', enctype='multipart/form-data' target='' ><input type='text' name='currentPage' value='" + window.location.href + "' placeholder='" + window.location.href + "' readonly='true' ><input type='file' name='img' id='inputImg'><button type='submit' class='btn btn-success'></button></form>";

      }else{

        if(!localStorage.getItem(i + 'answer')){
          document.getElementById(i + 'questionCorpus').innerHTML += "<input id='" + i + "inputCorpus' type='" + localStorage.getItem(i + 'sType') + " class='inputCorpus'> <button class='btn btn-info' onclick='javascript:conversationInput(" + i + ")'>Validate</button>";

        }else{
          document.getElementById(i + 'questionCorpus').innerHTML += "<p class='bg-success'>" + localStorage.getItem(i + 'answer') + "</p>";
        }
      }
    }

    if(localStorage.getItem(i + "cat") == 'v'){
      document.getElementById(i + 'info').innerHTML += "<div id='" + i + "videoCorpus' class='mediaCorpus' ></div>";
      document.getElementById(i + "videoCorpus").innerHTML = "<video width='300' height='auto' controls><source src='" + localStorage.getItem(i + 'url') + "' type='video/mp4'>Your browser does not support HTML5 video.</video>";
    }

    if(localStorage.getItem(i + "cat") == 'c'){
      document.getElementById(i + 'info').innerHTML += "<div id='" + i + "colorCorpus' class='colorCorpus' ></div>";
      for (var j = 0; j < localStorage.getItem( i + 'nbEntities'); j++) {

        if(localStorage.getItem(i + 'hex' + j)) {
          document.getElementById(i + 'colorCorpus').innerHTML += "<div id='" + i + "colorSample" + j + "' class='colorSample'></div> ";
          document.getElementById(i + "colorSample" + j).style.backgroundColor = localStorage.getItem(i + 'hex' + j);
        }

        if (localStorage.getItem(i + 'imgUrl' + j)) {
          document.getElementById(i + 'colorCorpus').innerHTML += "<img id='" + i + "colorSample" + j + "' class='colorSample'></img> ";
          document.getElementById(i + "colorSample" + j).src = localStorage.getItem(i + 'imgUrl' + j);
        }

      }
    }

  }
    element = document.getElementById('conversation');
  element.scrollTop = element.scrollHeight;
}

var extend = false;

function closeModal() {
  userClick({'text': 'modalClose'});
  document.getElementById('myModal').style.display='none';
}

function displayModal(messageId, imgId){
  userClick({'text': 'modalOpen', 'messageId': messageId, 'imgId': imgId});
  extend = false;

  document.getElementById('presentation').innerHTML = "<div class='close' onclick='closeModal()'>X</div><a class='prev' id='prev'>&#10094;</a><a class='next' id='next'>&#10095;</a><div id='modalContent'>plop</div>";
  document.getElementById('modalContent').innerHTML = "<div class='west'><img class='modalImage' id='img01'><div id='coment' onclick='toggleComentExtention()'></div><div id='comentIndicator' onclick='toggleComentExtention()'>v</div></div> <div id='caption' class='east'></div>";

  var modal = document.getElementById('presentation');
  var modalImg = document.getElementById('img01');

  modal.style.display = "block";
  modalImg.src = localStorage.getItem(messageId + "imgUrl" + imgId);
  document.getElementById('caption').innerHTML = "<h2><a target='c_blank' href='" + localStorage.getItem(messageId + "imgLink" + imgId) + "'>" + localStorage.getItem(messageId + 'productName' + imgId); + "</a></h2><br/>"
  document.getElementById('coment').innerHTML += "<p>" + localStorage.getItem(messageId + "shortDesc" + imgId) + "<br/>" + localStorage.getItem(messageId + "longDesc" + imgId) + "</p>";

  var span = document.getElementsByClassName("close")[0];

  modalImg.onclick = function() {
    userClick({'text': 'modalNext'});
    modal.style.display = "none";
    var nextImgId = (imgId + 1) % localStorage.getItem(messageId + "nbEntities");
    displayModal(messageId, nextImgId);
  }

  document.getElementById('next').onclick = function() {
    userClick({'text': 'modalNext'});
    modal.style.display = "none";
    var nextImgId = (imgId + 1) % localStorage.getItem(messageId + "nbEntities");
    displayModal(messageId, nextImgId);
  }

  document.getElementById('prev').onclick = function() {
    userClick({'text': 'modalPrev'});
    modal.style.display = "none";
    var nextImgId = (imgId + 2*localStorage.getItem(messageId + "nbEntities") -1) % localStorage.getItem(messageId + "nbEntities");
    displayModal(messageId, nextImgId);
  }

  span.onclick = function() {
    userClick({'text': 'modalClose'}); 
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      userClick({'text': 'modalClose'});
      modal.style.display = "none";
    }
  }
}

function toggleComentExtention() {
  if(extend){
    document.getElementById('coment').style.height = '100px';
    extend = false;
    document.getElementById('comentIndicator').innerHTML = 'v';
  }else{
    document.getElementById('coment').style.height = '200px';
    extend = true;
    document.getElementById('comentIndicator').innerHTML = '^';

  }
}

function conversationInput(messageId){
  answer = document.getElementById(messageId + 'input').value;
  localStorage.setItem(messageId + "answer", answer);

  var data = {name: '', code: '', sessionId: '', answer: ''};
  data.name = localStorage.user;
  data.code = localStorage.getItem(messageId + 'code' + localStorage.getItem(messageId + 'code'));
  if(localStorage.sessionId)
    data.sessionId = localStorage.sessionId;
  data.answer = answer;

  var chatApi = new XMLHttpRequest();
  chatApi.open("POST", chatRequest);
  chatApi.setRequestHeader("Content-Type", "application/json");
  chatApi.send(JSON.stringify(data));

  chatApi.onreadystatechange = function () {
    if (chatApi.readyState == 4 && chatApi.status == 200) {
      responseAnalyse(chatApi.responseText);
    }
  }
  chatShown = true;
  chatShow();
}

function optionChoice(messageId, UserChoice) {
  localStorage.setItem(messageId + "choosed", UserChoice);

  var data = {name: '', message: '', sessionId: ''};
  data.name = localStorage.user;
  data.message = localStorage.getItem(messageId + 'name' + UserChoice);
  if(localStorage.sessionId)
    data.sessionId = localStorage.sessionId;

  var chatApi = new XMLHttpRequest();
  chatApi.open("POST", chatRequest);
  chatApi.setRequestHeader("Content-Type", "application/json");
  chatApi.send(JSON.stringify(data));

  chatApi.onreadystatechange = function () {
    if (chatApi.readyState == 4 && chatApi.status == 200) {
      responseAnalyse(chatApi.responseText);
    }
  }
  chatShown = true;
  chatShow();
}

// when a message is sent from the client side
function send() {
  // stock of the message into the localStorage
  savingMessage();

  // preparing the data to send to the external API
  var data = {name: '', message: '', sessionId: '', giveMe: ''};
  data.name = localStorage.user;
  data.message = document.getElementById('message').value;
  if(localStorage.sessionId)
    data.sessionId = localStorage.sessionId;
  // give me
  // prod, quest, age, colors, text, multi, photo, price, timeout, video

  var chatApi = new XMLHttpRequest();
  chatApi.open("POST", chatRequest);
  chatApi.setRequestHeader("Content-Type", "application/json");
  chatApi.send(JSON.stringify(data));


  chatApi.onreadystatechange = function () {
    if (chatApi.readyState == 4 && chatApi.status == 200) {
      responseAnalyse(chatApi.responseText);
    }
  }
  chatShown = true;
  chatShow();
}

//when the server give me an answer

function responseAnalyse(data){
  // alert(JSON.stringify(data));
  var json = JSON.parse(data);

  messageId = parseInt(localStorage.messageId) + 1;
  localStorage.messageId = messageId;
  localStorage.setItem(messageId + "message", json.text);
  localStorage.setItem(messageId + "author", "Server");
  localStorage.sessionId = json.sessionId;

  if(!json.isText){
    localStorage.setItem( messageId + "cat", json.options.cat);

    if(json.options.cat == 'w'){

}

if(json.options.cat == 'p'){
  localStorage.setItem( messageId + "nbEntities", json.options.values.length);
  for (var i = 0; i < json.options.values.length; i++) {
    localStorage.setItem( messageId + "imgUrl" + i, json.options.values[i].imgURL);
    localStorage.setItem( messageId + "imgLink" + i, json.options.values[i].imgLink);
    localStorage.setItem( messageId + "longDesc" + i, json.options.values[i].longDesc);
    localStorage.setItem( messageId + "shortDesc" + i, json.options.values[i].shortDesc);
    localStorage.setItem( messageId + "productName" + i, json.options.values[i].name);
  }
}

if(json.options.cat == 'm'){
  localStorage.setItem(messageId + "nbEntities", json.options.values.length);
  localStorage.setItem( messageId + "choosed", "-1");
  for (var i = 0; i < json.options.values.length; i++) {
    localStorage.setItem(messageId + "name" + i, json.options.values[i].name);
    localStorage.setItem(messageId + "code" + i, json.options.values[i].code);
  }
}

if(json.options.cat == 'q'){
  localStorage.setItem(messageId + "nbEntities", "1");
  localStorage.setItem(messageId + "sType", json.options.sType);
  localStorage.setItem(messageId + "code", json.options.code);
}

if(json.options.cat == 'v'){
  localStorage.setItem(messageId + "nbEntities"," 1");
  localStorage.setItem(messageId + "url", json.options.url);
}

if(json.options.cat == 'c'){
  localStorage.setItem(messageId + "nbEntities", json.options.values.length);
  for (var i = 0; i < json.options.values.length; i++) {
  localStorage.setItem(messageId + "name" + i, json.options.values[i].name);
  localStorage.setItem(messageId + "link" + i, json.options.values[i].link);
    if(json.options.values[i].isHex){
  localStorage.setItem(messageId + "hex" + i, json.options.values[i].hex);
    }
    if(!json.options.values[i].isHex){
  localStorage.setItem(messageId + "imgUrl" + i, json.options.values[i].img);
    }
  }
}

}
chatShown = true;
chatShow();
}

// stock of the message into the localStorage
function savingMessage(){
  if(document.getElementById('message').value != "reset"){
    var messageId = parseInt(localStorage.messageId) + 1;
    localStorage.messageId = messageId;
    localStorage.setItem(messageId + "message", document.getElementById('message').value);
    localStorage.setItem(messageId + "author", localStorage.user);
  }else{
    localStorage.clear();
    chatShown = true;
    userClick({text: 'reset'});
    chatShow();
  }
}

function userClick(data) {

  var chatApi = new XMLHttpRequest();
  chatApi.open("POST", chatRequest);
  chatApi.setRequestHeader("Content-Type", "application/json");
  chatApi.send(JSON.stringify(data));

}

function chatListener(event) {
  if(event.charCode == 13){
    send();
  }
}
