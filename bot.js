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
  if(request.text && request.text.startsWith("Are"))
  {
    //postMessage("prompting" + request.text);
    botCall(request.text);
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

async function botCall(text) {
  postMessage("trying to prompt "+text);
  const completion = await openai.createCompletion({
    model: "text-ada-001",
    prompt: text,
  });
  postMessage(completion.data.choices[0].text);


  //  try {
  //    const response = await fetch("/api/generate", {
  //      method: "POST",
  //      headers: {
  //        "Content-Type": "application/json",
  //      },
  //      body: JSON.stringify({ ask: text }),
  //    });

  //    const data = await response.json();
  //    if (response.status !== 200) {
  //     //postMessage(data.error);
  //      throw data.error || new Error(`Request failed with status ${response.status}`);
  //    }
  
  //   postMessage(data.result);
  
  //  } catch(error) {
  //    // Consider implementing your own error handling logic here
  //    console.error(error);
  //    alert(error.message);
  //  }
 }

exports.respond = respond;
