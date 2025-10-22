// Calculator
function factorial(n) {
    let f = 1;
    for (let i = 1; i <= n; i++) f *= i;
    return f;
}

function calculate() {
    let a = parseFloat(document.getElementById("num1").value);
    let b = parseFloat(document.getElementById("num2").value);
    let op = document.getElementById("operation").value;
    let res;
    switch (op) {
        case "add": res = a + b; break;
        case "sub": res = a - b; break;
        case "mul": res = a * b; break;
        case "div": res = b != 0 ? a / b : "Error"; break;
        case "pow": res = Math.pow(a, b); break;
        case "sqrt": res = Math.sqrt(a); break;
        case "fact": res = factorial(a); break;
        case "sin": res = Math.sin(a * Math.PI / 180); break;
        case "cos": res = Math.cos(a * Math.PI / 180); break;
        case "tan": res = Math.tan(a * Math.PI / 180); break;
    }
    document.getElementById("calc-result").innerText = "Result: " + res;
}

// Chat (static AI, ready for API integration)
function sendMessage() {
    let input = document.getElementById("user-input");
    if (!input.value) return;
    let msg = input.value;
    input.value = '';
    let container = document.getElementById("chat-container");
    container.innerHTML += `<div class="user-message">${msg}</div>`;
    container.scrollTop = container.scrollHeight;

    // Static AI reply (for now)
    setTimeout(() => {
        container.innerHTML += `<div class="ai-message">You said: ${msg}</div>`;
        container.scrollTop = container.scrollHeight;
    }, 500);
}

// Voice Recognition
function startVoiceRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-IN';
    recognition.onstart = () => document.getElementById("voice-status").innerText = "Listening...";
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById("user-input").value = transcript;
        sendMessage();
    };
    recognition.onerror = () => document.getElementById("voice-status").innerText = "Error occurred.";
    recognition.onend = () => document.getElementById("voice-status").innerText = "";
    recognition.start();
}

// Gemini AI Integration
async function getGeminiResponse(prompt) {
    const response = await fetch('https://api.genai.google.com/v1beta2/models/gemini-2.5-flash:generateText', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer YOUR_GEMINI_API_KEY',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: prompt })
    });
    const data = await response.json();
    return data.generatedText;
}

// OpenAI ChatGPT Integration
async function getChatGPTResponse(prompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer YOUR_OPENAI_API_KEY',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }]
        })
    });
    const data = await response.json();
    return data.choices[0].message.content;
}

// Unified AI Response Handler
async function handleAIResponse(prompt) {
    let geminiResponse = await getGeminiResponse(prompt);
    let chatGptResponse = await getChatGPTResponse(prompt);
    return `Gemini says: ${geminiResponse}\n\nChatGPT says: ${chatGptResponse}`;
}
