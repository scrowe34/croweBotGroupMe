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
    //contextGroupMe(request.group_id, request.text)
    botCall(request.text);
    //postMessage(request.group_id);
  }else if(request.text && request.text.startsWith("Crowebot2")){
    imageBot(request.text);
  }
}
//https://stackoverflow.com/questions/19539391/how-to-get-data-out-of-a-node-js-http-get-request
function contextGroupMe(groupId, message){
  postMessage(groupId);
  let data = '';
  options = 
  {
    hostname: 'api.groupme.com',
    path: '/v3/groups/'+groupId+'/messages',
    method: 'GET'
  };
  botReq = HTTPS.request(options, function(res) 
  {
    if(res.statusCode == 202) {
    } else {
      console.log('rejecting bad status code ' + res.statusCode);
    }
});
botReq.on('data', function (chunk) {
  data += chunk;
});
botReq.on('error', function(err)
  {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(postMessage(JSON.stringify(data)));
  


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
async function imageBot(text){
  const response = await openai.createImage({
    prompt: text.slice(10),
    n: 1,
    size: "1024x1024",
  });
  image_url = response.data.data[0].url;
  postMessage(image_url);

}
async function botCall(text) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: text.slice(9) + "?",
    max_tokens : 2500
  });
  postMessage(completion.data.choices[0].text.replace(/(\r\n|\n|\r)/gm, ""));
 }

exports.respond = respond;
