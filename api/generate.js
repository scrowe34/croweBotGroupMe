import { Configuration, OpenAIApi } from "openai";
var openKey = process.env.OPENAI_API_KEY;

const configuration = new Configuration({
  apiKey: openKey,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const ask = req.body.ask || '';
  if (ask.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please ask something",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-ada-001",
      prompt: ask+ "?",
      temperature: 0.6,
      max_tokens: 500
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}