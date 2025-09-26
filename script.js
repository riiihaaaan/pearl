const messages = document.getElementById('messages');
const typingIndicator = document.getElementById('typing-indicator');
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');

const systemPrompt = "You are PEARL, an AI medical assistant. Answer in 2-3 sentences max. Use bullet points if needed. Bold key terms with **text**. Never diagnose. Always advise consulting a doctor. User question:";

function parseMarkdown(text) {
    // Bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Lists
    const lines = text.split('\n');
    let inList = false;
    let result = '';
    for (let line of lines) {
        if (line.trim().startsWith('* ')) {
            if (!inList) {
                result += '<ul>';
                inList = true;
            }
            result += '<li>' + line.trim().substring(2) + '</li>';
        } else {
            if (inList) {
                result += '</ul>';
                inList = false;
            }
            result += line + '\n';
        }
    }
    if (inList) result += '</ul>';
    return result.trim();
}

function addMessage(type, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    if (type === 'ai') {
        messageDiv.innerHTML = parseMarkdown(text);
    } else {
        messageDiv.textContent = text;
    }
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
                stream: false,
                options: {
                    temperature: 0.5,
                    num_predict: 100
                }
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
