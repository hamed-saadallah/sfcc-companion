const express = require('express');
const axios = require('axios');
const openai = require('openai');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const port = 3000;

// Middleware pour parser le corps des requêtes JSON
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static('public'));

openai.apiKey = process.env.OPENAI_API_KEY;

// Route pour recevoir les données
app.post('/speechToTextEndpoint', async (req, res) => {
    console.log('/speechToTextEndpoint', req.body); // Affiche les données reçues dans la console du serveur
    const response = await getAnswerFromOpenAI(req.body.transcriptionText);
    res.json({ status: 'Success', receivedText: req.body.transcriptionText, openAiResponse: response });
});

const getAnswerFromOpenAI = async (message) => {
    try {
        const prompt = `Answer the following question: ${message}`;
        console.log(prompt);
        const result = await axios.post(
            'https://api.openai.com/v1/completions',
            {
                prompt: prompt,
                max_tokens: 50,
                model: "text-davinci-003"
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openai.apiKey}`,
                },
            }
        ).then(function (response) {
            console.log(response.data);
        });
        console.log(result);
        return result.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error fetching answer from OpenAI:', error);
        return 'An error occurred while fetching the answer. Please try again.';
    }
};

app.listen(port, () => {
    console.log(`L'application est en écoute sur http://localhost:${port}`);
});
