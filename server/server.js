import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();
console.log(process.env.OPENAI_API_KEY)
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors()); // it allows us to do cross origin request and allow out server to be called form frontend
app.use(express.json()); // it allows us to pass json objects from frontend to backend

//setting up dummy root route 

//this will help us to get the request
app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Namaste from Codify',
    })
});

//this will help us to ask for specific solutions 
app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt; //getting the request from the frontend 

        const response = await openai.createCompletion({
            model: "text-davinci-003", // model in use from openai api
            prompt: `${prompt}`, //passing the data or query from frontend
            temperature: 0, // higher the value higher the risk taken by the model
            max_tokens: 3000, //total no. of token generated after solutions. so 3000 means we can get pretty long responses responses
            top_p: 1,
            frequency_penalty: 0.5, //won't be repeating similar sentances very often
            presence_penalty: 0,
        });

        //sending back the response to the frontend
        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            error
        })
    }
    res.status(200).send({
        message: 'Namaste from Codify',
    })
});

//ensuring that out server always listen
app.listen(5000, () => console.log('Server is running on the port: http://localhost:5000'));
