document.addEventListener('DOMContentLoaded', () => {

    const applyModal = document.getElementById('apply-modal');
    const applyButton = document.getElementById('apply-now-button');
    const cancelButton = document.getElementById('cancel-button');
    const modalOverlay = document.getElementById('modal-overlay');

    const openModal = () => applyModal.classList.remove('modal-hidden');
    const closeModal = () => applyModal.classList.add('modal-hidden');

    if (applyButton) applyButton.addEventListener('click', openModal);
    if (cancelButton) cancelButton.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    const generateButton = document.getElementById('generate-cover-letter');
    const coverLetterTextarea = document.getElementById('cover-letter');
    const aiIcon = document.getElementById('ai-icon');
    const aiLoader = document.getElementById('ai-loader');
    const aiButtonText = document.getElementById('ai-button-text');

    async function generateCoverLetter() {
        const jobTitle = document.getElementById('job-title').innerText;
        const jobDescription = document.getElementById('job-description').innerText;

        const prompt = `Write a professional and enthusiastic cover letter for the role of "${jobTitle}". Use the following job description as a reference for the key responsibilities and qualifications. Keep it concise and impactful, around 3 paragraphs. \n\nJob Description:\n${jobDescription}`;

        aiIcon.classList.add('hidden');
        aiLoader.classList.remove('hidden');
        aiButtonText.innerText = 'Generating...';
        generateButton.disabled = true;
        coverLetterTextarea.value = 'Generating your cover letter, please wait...';

        try {
            const apiUrl = '/api/generate';

            const payload = { prompt: prompt };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0) {
                const generatedText = result.candidates[0].content.parts[0].text;
                coverLetterTextarea.value = generatedText;
            } else {
                console.error("API response didn't contain candidates:", result);
                coverLetterTextarea.value = "Sorry, we couldn't generate a cover letter at this time. Please check the server logs.";
            }

        } catch (error) {
            console.error('Error calling backend proxy:', error);
            coverLetterTextarea.value = "An error occurred. Make sure your server is running and check the console for details.";
        } finally {
            aiIcon.classList.remove('hidden');
            aiLoader.classList.add('hidden');
            aiButtonText.innerText = 'Generate with AI';
            generateButton.disabled = false;
        }
    }
    if (generateButton) generateButton.addEventListener('click', generateCoverLetter);

    const applicationForm = document.getElementById('application-form');
    if (applicationForm) {
        applicationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your application! (This is a demo)');
            closeModal();
            applicationForm.reset();
        });
    }
});
