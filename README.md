# Simple-Basic-Voice-Bot-Assistant using Gemini API
This project demonstrates the creation of a basic voice assistant that listens to user input, processes it using the Gemini API for generating intelligent responses, and then speaks the response back to the user. The voice assistant is built using HTML, JavaScript, and the Web Speech API.

**1.Understanding the Gemini API**
The Gemini API you're using is part of Google's generative language models that can generate natural, human-like responses to text input. It helps create chatbots or voice assistants that respond intelligently to user queries. To interact with Gemini's API, you need to:

**Get API access:** You’ll need to have a Google Cloud account and access to the Gemini API (which may be in beta or require specific setup).

**Obtain an API key:** After enabling the Gemini API, you'll need to create an API key from the Google Cloud Console and use it in your requests.

**Send requests:** In the script, the processQuery function sends POST requests to Gemini’s API endpoint with the user's speech input (converted to text), asking for a concise response.

**2. Setting Up the Project**
Follow these steps to build the voice assistant.

**Step 1:** Create a Google Cloud Project
Sign in to the Google Cloud Console: https://console.cloud.google.com/.
Create a new project.
Enable the Gemini API by searching for it in the API Library.
Create credentials: Generate an API key that you will use to authenticate your app's requests to the Gemini API.

**Step 2:** Implement Speech Recognition
In the code, the Web Speech API is used for speech recognition. This allows users to speak into their microphone, and the browser will automatically transcribe the speech to text.

The SpeechRecognition API (webkitSpeechRecognition for compatibility) listens for voice input.
It continuously listens until you stop it or process a response. After detecting speech, it triggers the onresult event, which converts the speech to text.
The transcription is then sent to the Gemini API for processing.

**Step 3:** Requesting Gemini API
The processQuery function sends the transcribed query to the Gemini API endpoint.
Axios is used for making the HTTP request, sending the user’s query to Gemini and requesting a concise response.
API Request Example:

javascript :

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



You send the question to the endpoint, which returns a concise answer that is read aloud by the assistant.

**Step 4:** Speech Synthesis (Text-to-Speech)
The speechSynthesis API is used to convert text (the response from Gemini) into speech. Once a response is returned from the Gemini API, it is read aloud to the user.
The response is passed to SpeechSynthesisUtterance, which speaks the answer.

javascript :

    const utterance = new SpeechSynthesisUtterance(response);
    utterance.voice = synth.getVoices().find(voice => voice.lang === 'en-US');
    synth.speak(utterance);


**Step 5:** Handling Errors and Timeout
Error handling is implemented in case there’s an issue with speech recognition or API requests. If there is an error in the response, the user is prompted to try again.

**Step 6:** Auto-Restart the Speech Recognition
If the speech recognition stops or encounters an error, it is automatically restarted, ensuring the voice assistant is always listening for new input.

**3. How to Use the Code**
To use this code, follow these steps:
1.Set up the HTML file: Copy and paste the HTML structure with the embedded JavaScript into your project.
2.Add the Gemini API key: Replace the GEMINI_API_KEY variable with your actual API key from Google Cloud.
3.Test the application: Open the HTML file in a browser that supports Web Speech API (like Google Chrome). It will automatically start listening for voice input as soon as the page loads.
4.Deployment: You can deploy this project on any basic web server or static hosting service like GitHub Pages, Netlify, or Vercel.

**4. Possible Enhancements**
Add additional features: Enhance the bot with more functionality such as dynamic responses based on specific keywords or actions.
Improve UI/UX: Design a better user interface with additional feedback mechanisms like showing a loading spinner while the response is being generated.
Add error handling for network issues: Handle situations where the API request fails due to network connectivity issues.


**This simple voice assistant leverages Gemini API for text generation and Web Speech API for voice input and output, creating an interactive and responsive experience. The core of the application involves handling speech input, sending it to the Gemini API for processing, and speaking the response back to the user. By following the steps above and using the provided code, you can build your own voice-powered assistant and expand on it with more features and improvements.**




