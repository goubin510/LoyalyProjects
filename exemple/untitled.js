var chatShown = false;
var chatRequest = "http://54.171.115.230:8080/api/v1/chats/pa";
if(localStorage.first){
  localStorage.first = true;
}
localStorage.user = 'user';

// open and close the chat windows
function chatCall() {
  if(chatShown) {
    userClick({message: 'chatClosing'});
    chatShown = false;
    chatHide();
  }else{
    userClick({message: 'chatOpening'});

    if(localStorage.first){
      localStorage.first = false;
      resetChat();
    }else{
      chatShown = true;
      chatShow();
    }

  }
}

// sending the user current page to the api
window.onload = function connection() {
  var data = {currentUrl: ''};
  data.currentUrl = window.location.href;
  if(localStorage.sessionId){
    data.sessionId = localStorage.sessionId;
    data.chatId = localStorage.chatId;
  }

  var chatApi = new XMLHttpRequest();
  chatApi.open("POST", chatRequest);
  chatApi.setRequestHeader("Content-Type", "application/json");
  chatApi.send(JSON.stringify(data));

  chatApi.onreadystatechange = function () {
    if (chatApi.readyState == 4 && chatApi.status == 200) {
      responseAnalyse(chatApi.responseText);
    }
  }
}

// open the chat windows
function chatShow() {
  document.getElementById('chat').innerHTML = "<div id='chatFenetre'><div id='nameDiv'></div><div id='conversation'></div><div id='inputArea'><input type='text' placeholder='message' id='message' onkeypress='chatListener(event)' autofocus><button class='messageSubmit' onclick='send()' id='chatBtn'>&#10148;</button></div></div>";

  document.getElementById('nameDiv').innerHTML = "<img class='titleAssistantPicture' src='http://cache.magazine-avantages.fr/data/photo/w670_h670_c1/3v/7dd91e1113f820425.jpg'><div id='assistantLegend'><p class='assistantName'>Alice<br/><thin>Digital Assistant</thin></p><div class='reduce'><button class='reducerButton logo' onclick='resetChat();'>&#8634;</button><button class='reducerButton' onclick='chatCall();'> close _</button></div></div>";

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
  var pseudo = prompt("What's your name ?" + localStorage.messageId);
  localStorage.user = pseudo;
  if(!localStorage.messageId)
    localStorage.messageId = 0;
}

//Show the chat messsages and images to the user into the chat window
function chatContentLoader(){
  for (var i = 1; i < parseInt(localStorage.messageId) + 1; i++) {
    if(localStorage.getItem(i + "author") != 'Alice'){
      document.getElementById('conversation').innerHTML += "<div class='userCorpus msg'><img class='chatProfilPicture' src='https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQqOY59Wk7dlgWX7ipKEDAA-JS8fNVAaz8pQJvQLg7kgCtYsU0g'><p id='" + i + "messageCorpus'></p></div>";

    }else{
      document.getElementById('conversation').innerHTML += "<div class='serverCorpus msg'><img class='chatProfilPicture' src='http://cache.magazine-avantages.fr/data/photo/w670_h670_c1/3v/7dd91e1113f820425.jpg'><p id='" + i + "messageCorpus'></p><div id='" + i + "info' class='proposition'></div></div>";
    }

    document.getElementById(i + 'messageCorpus').innerHTML +=  "<dt class='mainAuthor'>" + localStorage.getItem(i + "author") + "</dt>";
    document.getElementById(i + 'messageCorpus').innerHTML += "<dd class='mainComent'>" + localStorage.getItem(i + "message") + "</dd>";

    if(localStorage.getItem(i + "cat") == 'p'){
      document.getElementById(i + 'info').innerHTML += "<div id='" + i + "picturesCorpus' class='picturesCorpus'></div>";
      for (var j = 0; j < localStorage.getItem( i + 'nbEntities'); j++) {

        document.getElementById(i + 'picturesCorpus').innerHTML += "<div class='chatImgDiv'><img class='img-thumbnail' src='" + localStorage.getItem(i + 'imgUrl' + j) + "' id='chatImg' name='image' onclick='javascript:openModal(" + i + "," + j + ")'><p class='imgName'>" + localStorage.getItem(i + 'productName' + j) + "</p></div>";
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
        document.getElementById(i + 'questionCorpus').innerHTML += "<input type='file' onchange='changedPictures(" + i + ")' name='img' id='imgInput" + i + "'><button onclick='useCamera()'>Use your Camera</button><button id='uniqueBtn' onclick='sendPictures(" + i + ")' class='btn btn-success'>&#9658;</button>";

        //document.getElementById(i + 'questionCorpus').innerHTML += "<form id='" + i + "form'><input type='text' name='currentPage' value='" + window.location.href + "' placeholder='" + window.location.href + "' readonly='true' class='hidden'><input class='hidden' type='text' name='sessionId' value='" + localStorage.sessionId + "'><input class='hidden' type='text' name='chatId' value='" + localStorage.chatId + "'><input type='file' name='img' id='imgInput " + i + "'><button id='uniqueBtn' onclick='sendPictures(" + i + ")' class='btn btn-success'>&#9658;</button></form>";
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

function openModal(abc, def) {
  userClick({message: 'modalOpen'});
  displayModal(abc, def);
}

var extend = false;

function closeModal() {
  userClick({message: 'modalClose'});
  document.getElementById('myModal').style.display='none';
}

function displayModal(messageId, imgId){
  userClick({message: 'intoModal', productId: localStorage.getItem(messageId + "id" + imgId), name: localStorage.getItem(messageId + "productName" + imgId)});
  extend = false;

  document.getElementById('presentation').innerHTML = "<div class='close' onclick='closeModal()'>X</div><a class='prev' id='prev'>&#10094;</a><a class='next' id='next'>&#10095;</a><div id='modalContent'>plop</div>";
  document.getElementById('modalContent').innerHTML = "<div class='west'><img class='modalImage' id='img01'><div id='coment' onclick='toggleComentExtention()'><h2>DESCRIPTION</h2></div><div id='comentIndicator' onclick='toggleComentExtention()'>&#9663;</div></div> <div id='caption' class='east'>plop</div>";

  var modal = document.getElementById('presentation');
  var modalImg = document.getElementById('img01');

  modal.style.display = "block";
  modalImg.src = localStorage.getItem(messageId + "imgUrl" + imgId);
  document.getElementById('caption').innerHTML = "<h2><a target='c_blank' href='" + localStorage.getItem(messageId + "imgLink" + imgId) + "'>" + localStorage.getItem(messageId + 'productName' + imgId); + "</a></h2><br/>";
  document.getElementById('coment').innerHTML += "<p><strong>" + localStorage.getItem(messageId + "shortDesc" + imgId) + "</strong><br/>" + localStorage.getItem(messageId + "longDesc" + imgId) + "</p>";
  document.getElementById('caption').innerHTML += "<p id='tags'></p><hr><div id='palette'></div><p id='colorName'></p><p id='price'></p>";

  var tagsArray = JSON.parse(localStorage.getItem(messageId + "tags" + imgId));
  for (var i = 0; i < tagsArray.length; i++) {
    if(i < tagsArray.length - 1){
      document.getElementById('tags').innerHTML += tagsArray[i] + ", ";
    }else{
      document.getElementById('tags').innerHTML += tagsArray[i] + ". ";
    }
  }

  var colorsArray = JSON.parse(localStorage.getItem(messageId + "colors" + imgId));

  if(colorsArray.length){
    document.getElementById('palette').innerHTML = "<quote id='colorTitle'>Available Colors</quote><div id='selected'></div><div id='selector'></div>";
    for (var i = 0; i < colorsArray.length; i++) {
      var adr = 'http:' + colorsArray[i].imgSel;
      document.getElementById('selector').innerHTML += "<img class='imgSample' onclick='javascript:addToSelected(" + JSON.stringify(colorsArray[i]) + ")' src='" + adr + "' alt='" + colorsArray[i].code + "'>" 
    }
    addToSelected(colorsArray[0]);
  }else{
    document.getElementById('palette').innerHTML = "<quote id='colorTitle'>There is only one color available for the current product</quote><div id='selected'></div><div id='selector'></div>";

  }


  document.getElementById('price').innerHTML = "<quote>Price</quote>" + localStorage.getItem(messageId + "price" + imgId) + " €";

  var span = document.getElementsByClassName("close")[0];

  modalImg.onclick = function() {
    modal.style.display = "none";
    var nextImgId = (imgId + 1) % localStorage.getItem(messageId + "nbEntities");
    displayModal(messageId, nextImgId);
  }

  document.getElementById('next').onclick = function() {
    modal.style.display = "none";
    var nextImgId = (imgId + 1) % localStorage.getItem(messageId + "nbEntities");
    displayModal(messageId, nextImgId);
  }

  document.getElementById('prev').onclick = function() {
    modal.style.display = "none";
    var nextImgId = (imgId + 2*localStorage.getItem(messageId + "nbEntities") -1) % localStorage.getItem(messageId + "nbEntities");
    displayModal(messageId, nextImgId);
  }

  span.onclick = function() {
    userClick({message: 'modalClose'}); 
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      userClick({message: 'modalClose'});
      modal.style.display = "none";
    }
  }
}

function addToSelected(data) {
  document.getElementById('selected').innerHTML = "<img src='http:" + data.imgSel + "' style='height:80px'>";
  document.getElementById('colorName').innerHTML = data.code;
}

function toggleComentExtention() {
  if(extend){
    document.getElementById('coment').style.height = '100px';
    extend = false;
    document.getElementById('comentIndicator').innerHTML = '&#9663;';
  }else{
    document.getElementById('coment').style.height = '200px';
    extend = true;
    document.getElementById('comentIndicator').innerHTML = '';

  }
}

function conversationInput(messageId){
  answer = document.getElementById(messageId + 'input').value;
  localStorage.setItem(messageId + "answer", answer);

  var data = {name: '', code: '', sessionId: '', answer: ''};
  data.name = localStorage.user;
  data.code = localStorage.getItem(messageId + 'code' + localStorage.getItem(messageId + 'code'));
  if(localStorage.sessionId){
    data.sessionId = localStorage.sessionId;
    data.chatId = localStorage.chatId;
  }
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
  if(localStorage.sessionId){
    data.sessionId = localStorage.sessionId;
    data.chatId = localStorage.chatId;
  }

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

  if(document.getElementById('message').value != 'reset'){
    // preparing the data to send to the external API
    var data = {name: '', message: '', sessionId: ''};
    data.name = localStorage.user;
    data.message = document.getElementById('message').value;

    if(localStorage.sessionId){
      data.sessionId = localStorage.sessionId;
      data.chatId = localStorage.chatId;
    }

    var chatApi = new XMLHttpRequest();
    chatApi.open("POST", chatRequest);
    chatApi.setRequestHeader("Content-Type", "application/json");
    chatApi.send(JSON.stringify(data));

    chatApi.onreadystatechange = function () {
      if (chatApi.readyState == 4 && chatApi.status == 200) {
        responseAnalyse(chatApi.responseText);
      }
    }
  }
  chatShown = true;
  chatShow();
}

function useCamera(){
  userClick({message: 'usingWebcam'});

  document.getElementById('presentation').innerHTML = "<div class='close' onclick='closeModal()'>X</div><div id='modalContent'>plop</div>";
  document.getElementById('modalContent').innerHTML = "<pre id='preLog'>Chargement…</pre><video id='video' autoplay='autoplay'></video><input type='button' id='buttonSnap' value='take a picture' disabled='disabled' onclick='snapshot()' />";

  var modal = document.getElementById('presentation');
  modal.style.display = "block";

  var span = document.getElementsByClassName("close")[0];
  var video = document.getElementById('video');

  if ((typeof window === 'undefined') || (typeof navigator === 'undefined')) log('Cette page requiert un navigateur Web avec les objets window.* et navigator.* !');
  else if (!(video)) log('Erreur de contexte HTML !');
  else
  {
    log('Demande d’accès au flux vidéo…');
    if (navigator.getUserMedia) navigator.getUserMedia({video:true}, gotStream, noStream);
    else if (navigator.oGetUserMedia) navigator.oGetUserMedia({video:true}, gotStream, noStream);
    else if (navigator.mozGetUserMedia) navigator.mozGetUserMedia({video:true}, gotStream, noStream);
    else if (navigator.webkitGetUserMedia) navigator.webkitGetUserMedia({video:true}, gotStream, noStream);
    else if (navigator.msGetUserMedia) navigator.msGetUserMedia({video:true, audio:false}, gotStream, noStream);
    else log('getUserMedia() n’est pas disponible depuis votre navigateur !');
  }

  span.onclick = function() {
    userClick({message: 'modalClose'}); 
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      userClick({message: 'modalClose'});
      modal.style.display = "none";
    }
  }
}

function log(text)
{
  if (preLog) preLog.textContent += ('\n' + text);
  else alert(text);
}

function snapshot()
{
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
}

function noStream()
{
  log('L’accès à la caméra a été refusé !');
}

function stop()
{
  var myButton = document.getElementById('buttonStop');
  if (myButton) myButton.disabled = true;
  myButton = document.getElementById('buttonSnap');
  if (myButton) myButton.disabled = true;
  if (videoStream)
  {
    if (videoStream.stop) videoStream.stop();
    else if (videoStream.msStop) videoStream.msStop();
    videoStream.onended = null;
    videoStream = null;
  }
  if (video)
  {
    video.onerror = null;
    video.pause();
    if (video.mozSrcObject)
      video.mozSrcObject = null;
    video.src = "";
  }
  myButton = document.getElementById('buttonStart');
  if (myButton) myButton.disabled = false;
}

function gotStream(stream)
{
  var myButton = document.getElementById('buttonStart');
  if (myButton) myButton.disabled = true;
  videoStream = stream;
  log('Flux vidéo reçu.');
  video.onerror = function ()
  {
    log('video.onerror');
    if (video) stop();
  };
  stream.onended = noStream;
  if (window.webkitURL) video.src = window.webkitURL.createObjectURL(stream);
  else if (video.mozSrcObject !== undefined)
  {//FF18a
    video.mozSrcObject = stream;
    video.play();
  }
  else if (navigator.mozGetUserMedia)
  {//FF16a, 17a
    video.src = stream;
    video.play();
  }
  else if (window.URL) video.src = window.URL.createObjectURL(stream);
  else video.src = stream;
  myButton = document.getElementById('buttonSnap');
  if (myButton) myButton.disabled = false;
  myButton = document.getElementById('buttonStop');
  if (myButton) myButton.disabled = false;
}

function sendPictures(messageId) {
  var chatApi = new XMLHttpRequest();

  var profile = document.getElementById("imgInput" + messageId);
  
  if(profile.value != ""){
    var img = profile.files[0];
    console.log('plop');
  }
  
  var formData = new FormData();
  formData.append("sessionId", localStorage.sessionId);
  formData.append("chatId", localStorage.chatId);
  formData.append("img", img);

  chatApi.open("POST",chatRequest);

  chatApi.onreadystatechange = function(){
      if (chatApi.readyState==4 && chatApi.status==200){
        responseAnalyse(chatApi.responseText);
      }
  }
  chatApi.send(formData);
}

function changedPictures(messageId){
  var profile = document.getElementById("imgInput" + messageId);
}

//when the server give me an answer

function responseAnalyse(data){
  // alert(JSON.stringify(data));
  if(data != ''){

    var json = JSON.parse(data);
  }

  // alert(JSON.stringify(json));
  if(!parseInt(localStorage.messageId))
    localStorage.messageId = '0';
  var messageId = parseInt(localStorage.messageId) + 1;

  localStorage.messageId = messageId;
  localStorage.setItem(messageId + "message", json.text);
  localStorage.setItem(messageId + "author", "Alice");
  localStorage.sessionId = json.sessionId;
  localStorage.chatId = json.chatId;

  if(!json.isText){
    localStorage.setItem( messageId + "cat", json.options.cat);

    if(json.options.cat == 'w'){

}

if(json.options.cat == 'p'){
  localStorage.Json = json;
  localStorage.setItem( messageId + "nbEntities", json.options.values.length);
  for (var i = 0; i < json.options.values.length; i++) {
    localStorage.setItem( messageId + "imgUrl" + i, json.options.values[i].imgURL);
    localStorage.setItem( messageId + "imgLink" + i, json.options.values[i].imgLink);
    localStorage.setItem( messageId + "longDesc" + i, json.options.values[i].longDesc);
    localStorage.setItem( messageId + "shortDesc" + i, json.options.values[i].shortDesc);
    localStorage.setItem( messageId + "productName" + i, json.options.values[i].name);
    localStorage.setItem( messageId + "price" + i, json.options.values[i].price);
    localStorage.setItem( messageId + "id" + i, json.options.values[i]._id);
    localStorage.setItem( messageId + "tags" + i, JSON.stringify(json.options.values[i].tags));
    localStorage.setItem( messageId + "colors" + i, JSON.stringify(json.options.values[i].colors));
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
    var data = {};
    data.message = "/start";
    data.sessionId = localStorage.sessionId;
    data.chatId = localStorage.chatId;
    localStorage.clear();

    var chatApi = new XMLHttpRequest();
    chatApi.open("POST", chatRequest);
    chatApi.setRequestHeader("Content-Type", "application/json");
    chatApi.send(JSON.stringify(data));

    chatApi.onreadystatechange = function () {
      if (chatApi.readyState == 4 && chatApi.status == 200) {
        responseAnalyse(chatApi.responseText);
      }
    }

  }
}

function resetChat(){
    var pseudo = localStorage.user;
    var data = {};
    data.message = "/start";
    data.sessionId = localStorage.sessionId;
    data.chatId = localStorage.chatId;
    localStorage.clear();

    localStorage.user = pseudo;

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

function userClick(data) {
  data.sessionId = localStorage.sessionId;
  data.chatId = localStorage.chatId;

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