const express = require('express');
const { OpenAI } = require("openai");
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const port = 3000;

// Middleware pour parser le corps des requêtes JSON
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static('public'));
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
        const result = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt },
          ],
          max_tokens: 600,  // Limite des tokens pour la réponse
        });
        console.log(JSON.stringify(result));
        return result.choices[0].message.content;
    } catch (error) {
        console.error('Error fetching answer from OpenAI:', error);
        return 'An error occurred while fetching the answer. Please try again.';
    }
};

app.listen(port, () => {
    console.log(`L'application est en écoute sur http://localhost:${port}`);
});
