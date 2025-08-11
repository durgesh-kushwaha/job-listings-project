
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();


const app = express();
const port = 3000; 

app.use(cors()); 
app.use(express.json()); 

app.post('/api/generate', async (req, res) => {
    console.log('Received request at /api/generate');

    try {
        // Get the 'prompt' that your frontend sent in the request body.
        const { prompt } = req.body;

        // Check if a prompt was provided.
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is missing from the request.' });
        }

        // Get your secret API key from the server's environment variables.
        // This is safe because it's never exposed to the browser.
        const apiKey = process.env.GEMINI_API_KEY;
        const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        // Prepare the payload to send to Google's API.
        const payload = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        };

        // Make the secure call from your server to Google's API.
        const response = await fetch(googleApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // If Google's API returns an error, forward it.
            const errorData = await response.json();
            console.error('Error from Google API:', errorData);
            return res.status(response.status).json(errorData);
        }

        const data = await response.json();

        res.json(data);

    } catch (error) {
        console.error("Error in server proxy:", error);
        res.status(500).json({ error: "Something went wrong on the server." });
    }
});

app.listen(port, () => {
    console.log(`Server is running securely at http://localhost:${port}`);
    console.log('Waiting for requests from the frontend...');
});
