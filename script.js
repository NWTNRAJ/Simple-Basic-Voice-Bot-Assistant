    const GEMINI_API_KEY = 'YOUR API CODE'; 
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        const synth = window.speechSynthesis;
        const micIcon = document.getElementById('micIcon');
        const status = document.getElementById('status');
        const responseBox = document.getElementById('response');

        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        let isProcessing = false;
        let currentUtterance = null;

        recognition.start();

        recognition.onstart = () => {
            status.textContent = "Speak now - I'm listening";
            micIcon.style.background = '#4CAF50';
        };

        recognition.onresult = async (event) => {
            if (isProcessing) return;
            const transcript = event.results[event.results.length-1][0].transcript;
            status.textContent = "Processing your question...";
            responseBox.textContent = `You: ${transcript}`;
            isProcessing = true;
            try {
                const response = await Promise.race([
                    processQuery(transcript),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout')), 5000))
                ]);
                
                speakResponse(response);
            } catch (error) {
                handleError(error);
            }
        };

        async function processQuery(query) {
            try {
                const response = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
                    {
                        contents: [{
                            parts: [{
                                text: `Give a concise answer to: ${query}. Max 3 sentences.`
                            }]
                        }]
                    },
                    { timeout: 3000 }
                );

                return response.data.candidates[0].content.parts[0].text;
            } catch (error) {
                console.error('API Error:', error);
                return "Let me try that again. Could you please rephrase your question?";
            }
        }

        function speakResponse(text) {
            if (currentUtterance) {
                synth.cancel();
            }
            currentUtterance = new SpeechSynthesisUtterance(text);
            currentUtterance.voice = synth.getVoices().find(voice => voice.lang === 'en-US');
            currentUtterance.pitch = 1;
            currentUtterance.rate = 1.2; 

            currentUtterance.onstart = () => {
                status.textContent = "Answering...";
                responseBox.textContent = `AI: ${text}`;
            };
            currentUtterance.onend = () => {
                status.textContent = "Speak now - I'm listening";
                micIcon.style.background = '#4CAF50';
                isProcessing = false;
                recognition.start(); 
            };

            synth.speak(currentUtterance);
        }

        function handleError(error) {
            console.error('Error:', error);
            status.textContent = "Speak now - I'm listening";
            responseBox.textContent = "Let's try that again. Please ask your question.";
            micIcon.style.background = '#4CAF50';
            isProcessing = false;
            recognition.start();
        }

        recognition.onerror = (event) => {
            handleError(event.error);
        };

        recognition.onend = () => {
            if (!isProcessing) {
                recognition.start();
            }
        };
