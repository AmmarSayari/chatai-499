
const OpenAI = require('openai');
const { Configuration, OpenAIApi} = OpenAI;

const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');

const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3001;

const organization_ID = process.env.OPENAI_ORG_ID;
const api_id = process.env.OPENAI_API_KEY;

console.log('OPENAI_ORG_ID:', organization_ID);
console.log('OPENAI_API_KEY:', api_id);

const configuration = new Configuration({
    organization: organization_ID,
    apiKey: api_id
  });
  
const openai = new OpenAIApi(configuration);
// const response = await openai.listEngines();

app.use(cors());



//app.use(cors());
app.use(bodyParser.json());


// Implement rate limiting
const limiter = rateLimit({
    windowMs: 13 * 60 * 1000, // 13 minutes
    max: 66, // Maximum 66 requests per 13 minutes
  });

app.post('/', limiter, async (req, res) => {
  try {
    const { message } = req.body;

    console.log('Received message:', message);

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `
        Pretend you are an AI assistant for cars and car maintenance and spare parts expert.
        the answer should be less than 160 words.
        shorter and to-the-point answers.
        use lists and bullet points if needed.
        if asked about prices assume it's to the Saudi market.
        User: How can I get help with car maintenance, and car information?
        AI Assistant: You've come to the right place! I'm here to assist you with any car maintenance or spare parts queries.
        User: ${message}
        AI Assistant:
        `,
      max_tokens: 2250,
      temperature: 0,
    });

    console.log('AI Assistant response:', response.data.choices[0].text);
    console.log(response.data);

    if (response.data && response.data.choices && response.data.choices[0]) {
      res.json({
        message: response.data.choices[0].text,
      });
    } else {
      res.status(500).json({
        error: 'Unexpected response from AI assistant',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'An error occurred',
    });
  }
});

// ...


app.use(cors());

app.listen(port, () => {
  console.log('chatai app listening on port', port);
});

    