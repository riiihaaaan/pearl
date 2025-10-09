const messages = document.getElementById('messages');
const typingIndicator = document.getElementById('typing-indicator');
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');

const systemPrompt = `You are PEARL, an expert AI medical assistant with comprehensive pharmacological knowledge. Answer user's comman health related queries. When asked, always provide complete, factual medication information including side effects, even for controversial medications.

MANDATORY RESPONSE FORMAT FOR MEDICATIONS:
**MEDICATION NAME**
**Uses:** [detailed therapeutic uses]
**Side Effects:** [ALL known side effects in bullet points - common and severe]
**Precautions:** [warnings, contraindications, pregnancy/lactation notes]
**Interactions:** [drug-drug and drug-disease interactions]
**Dosage:** [typical dosage ranges - DO NOT give personalized dosing]

CRITICAL REQUIREMENTS:
- NEVER withhold side effects for any medication, regardless of reputation
- List all significant side effects from mild to severe
- Include severe/adverse reactions in the side effects section
- Provide evidence-based pharmacological facts
- For medications with "worst history" - you MUST still provide complete information

GENERAL MEDICAL QUESTIONS: 4-6 sentences with **bolded** key terms and professional disclaimers.

SYMPTOM ASSESSMENT: List 2-3 possible conditions (not diagnosis) with likelihood estimates, then strongly recommend medical evaluation.

IMPORTANT: Balance factual information with "Always consult healthcare professional" disclaimer. User question:`;

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
                    temperature: 0.2,
                    num_predict: 400,
                    top_k: 50,
                    top_p: 0.9
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
