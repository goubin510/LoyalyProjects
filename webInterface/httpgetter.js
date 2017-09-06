var http = require("http");
var bodyParser = require('body-parser');
var options = {
  host: 'www.kikocosmetics.com',
  port: 80,
  path: '/fr-fr/maquillage/levres/rouges-a-levres/Velvet-Passion-Matte-Lipstick/p-KM00201020'
};
var req = http.request(options, function(res) {
  var finalBODY = ''
  //console.log('STATUS: ' + res.statusCode);
  //console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    //console.log('BODY: ' + chunk);
    finalBODY += chunk;
    //var jsonObject = JSON.parse(chunk);
    //console.log(jsonObject)
  });
  
  res.on('end', () => {
    console.log('No more data in response.');
    console.log(finalBODY)
  });
});
req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});
// write data to request body
req.write('data\n');
req.write('data\n');
req.end();