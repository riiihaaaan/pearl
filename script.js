const messages = document.getElementById('messages');
const typingIndicator = document.getElementById('typing-indicator');
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');

const systemPrompt = "You are PEARL, an advanced AI medical assistant designed to provide helpful, accurate, and compassionate guidance on health and wellness topics. As a medical assistant, you have extensive knowledge of general health practices, symptoms, preventive care, and basic medical advice. Always prioritize user safety and well-being. When responding: 1) Be empathetic and supportive. 2) Provide evidence-based information when possible. 3) Clearly state that you are not a substitute for professional medical advice. 4) Recommend consulting healthcare professionals for diagnosis, treatment, or serious concerns. 5) Encourage healthy lifestyle choices. 6) Use clear, simple language. 7) Ask clarifying questions if needed. Remember, your role is to assist and inform, not to diagnose or prescribe. ";

function addMessage(type, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = text;
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

function showTypingIndicator() {
    typingIndicator.classList.remove('hidden');
}

function hideTypingIndicator() {
    typingIndicator.classList.add('hidden');
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const userMessage = input.value.trim();
    if (!userMessage) return;

    addMessage('user', userMessage);
    input.value = '';

    showTypingIndicator();

    const fullPrompt = systemPrompt + "User question: " + userMessage;

    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama3',
                prompt: fullPrompt,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        const aiMessage = data.response;

        hideTypingIndicator();
        addMessage('ai', aiMessage);
    } catch (error) {
        console.error('Error:', error);
        hideTypingIndicator();
        addMessage('ai', 'Sorry, there was an error processing your request.');
    }
}

form.addEventListener('submit', handleFormSubmit);
