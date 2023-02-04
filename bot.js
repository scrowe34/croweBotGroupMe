var HTTPS = require('https');
var botID = process.env.BOT_ID;

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);



async function respond() 
{
  var request = JSON.parse(this.req.chunks[0]);
  if(request.text && request.text.startsWith("Crowebot"))
  {
    const response = await openai.createCompletion({
      model: "text-ada-001",
      prompt: request.text.slice(8)+"?",
      temperature: 0.7,
      max_tokens: 1000
    });
    this.res.writeHead(200);
    postMessage(response);
    this.res.end();
  } 
}

function postMessage(response) 
{
  var botResponse,options, body, botReq;

  botResponse = response

  options = 
  {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = 
  {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) 
  {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err)
  {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}

exports.respond = respond;
