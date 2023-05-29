
const OpenAI = require('openai');
const { Configuration, OpenAIApi} = OpenAI;

const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');

const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3001;


const configuration = new Configuration({
    organization: process.env.OPENAI_ORG_ID,
    apiKey: process.env.OPENAI_API_KEY,
  });
  
const openai = new OpenAIApi(configuration);
// const response = await openai.listEngines();

//app.use(cors());
app.use(bodyParser.json());


// Implement rate limiting
const limiter = rateLimit({
    windowMs: 13 * 60 * 1000, // 13 minutes
    max: 66, // Maximum 66 requests per 13 minutes
  });

app.post('/',limiter, async (req, res) => {

    const { message } = req.body;

    console.log('Received message:', message);

    const response = await openai.createCompletion({
    

        model: "text-davinci-003",
        prompt: `
        
        
        Pretend you are an AI assistant for cars and cars maintenance and spare parts expert.
    User: How can I get help with car maintenance?
    AI Assistant: You've come to the right place! I'm here to assist you with any car maintenance or spare parts queries.
    User: ${message}
    AI Assistant:
        `
        ,
        max_tokens: 66,
        temperature: 1.5
      });

      console.log('AI Assistant response:', response.data.choices[0].text)
      console.log(response.data)

      
        if(response.data){
            res.json({
                message: response.data.choices[0].text
            })
        }
      
});

app.use(cors());

app.listen(port, () => {
  console.log('chatai app listening on port', port);
});

    