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
    contextGroupMe(request.group_id, request.text)
    //botCall(request.text);
    //postMessage(request.group_id);
  } 
}

function contextGroupMe(groupId, message){
  postMessage(groupId);
  options = 
  {
    hostname: 'api.groupme.com',
    path: '/v3/groups/'+groupId+'/messages',
    method: 'GET'
  };
  botReq = HTTPS.request(options, function(res) 
  { 
    let data = '';
    res.on('data', (chunk) => {
        data = data + chunk.toString();
    });
  
    res.on('end', () => {
        const body = JSON.parse(data);
        postMessage("body");
    });

    // postMessage(JSON.stringify(res));
    //   if(res.statusCode == 202) {
    //     // let messages = res.response.messages;
    //     // messages.reverse();
    //     // let context ='';
    //     // for (var i = 0; i < messages.length; i++) {
    //     //   context += messages[i].text + " ";
    //     // }
        
    //     //postMessage(JSON.stringify(res));
    //   } else {
    //     console.log('rejecting bad status code ' + res.statusCode);
    //   }
  });


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

async function botCall(text) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: text.slice(9) + "?",
    max_tokens : 2500
  });
  postMessage(completion.data.choices[0].text.replace(/(\r\n|\n|\r)/gm, ""));
 }

exports.respond = respond;
