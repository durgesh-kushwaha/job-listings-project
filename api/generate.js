
const fetch = require('node-fetch');

module.exports = async (req, res) => {

    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is missing.' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: prompt }] }]
        };

        const response = await fetch(googleApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json(errorData);
        }

        const data = await response.json();
        
        res.status(200).json(data);

    } catch (error) {
        console.error("Error in serverless function:", error);
        res.status(500).json({ error: "Something went wrong." });
    }
};