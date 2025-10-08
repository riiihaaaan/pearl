# PEARL: AI Medical Assistant

## Overview

PEARL is a web-based AI-powered medical assistant designed to provide helpful, preliminary medical information using advanced natural language processing. The application leverages the Llama 3 model via Ollama to answer user questions about health and wellness topics.

## Features

- **Conversational Interface**: Clean, user-friendly chat interface for natural interactions.
- **Real-time Responses**: Powered by Llama 3 model running locally for fast, secure responses.
- **Medical Focus**: Tailored responses for health-related queries with appropriate disclaimers.
- **Formatted Output**: Supports markdown formatting for better readability, including bold text and lists.
- **Cross-Platform**: Runs in any modern web browser on Windows, macOS, or Linux.

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **AI Backend**: Ollama with Meta's Llama 3 8B Instruct model
- **Local Execution**: No cloud dependencies; everything runs on your local machine
- **HTTP Server**: Python's built-in HTTP server for serving static files

## Architecture

The application consists of three main components:

1. **Web Interface** (`index.html`, `style.css`): Responsive frontend with chat UI
2. **Client Logic** (`script.js`): Handles user input, API calls to Ollama
3. **AI Backend** (Ollama): Local inference server running Llama 3 model

### Data Flow

```
User Input → Web Form → AJAX POST to localhost:11434 → Ollama → Llama 3 Model → Response → Formatted HTML → User Display
```

## Setup and Installation

### Prerequisites

1. **Python** (for serving the web app)
2. **Ollama** (for running AI models)
   - Download from: https://ollama.ai/download
3. **Node.js** (optional, for potential future enhancements)
4. **Modern web browser**

### Installing Dependencies

1. Install Ollama and pull the Llama 3 model:
   ```bash
   ollama pull llama3
   ```

2. Ensure Python is installed (version 3.6+ recommended)

### Running the Application

#### Automated Setup
Double-click `run.bat` or run in terminal:
```cmd
.\run.bat
```

#### Manual Setup
1. Start Ollama server:
   ```bash
   ollama serve
   ```

2. In another terminal, start HTTP server:
   ```bash
   python -m http.server 8000
   ```

3. Open browser and navigate to: `http://localhost:8000`

## Project Structure

```
pearl/
├── index.html          # Main HTML interface
├── style.css           # Styling for chat interface
├── script.js           # Client-side JavaScript logic
├── run.bat             # Windows batch file for easy startup
├── README.md           # Project documentation
└── .gitignore          # Git ignore rules
```

## Key Code Components

### HTML Structure (index.html)
- Simple, clean layout with header, messages container, and input form
- Includes OGG audio format for accessibility
- Links to external CSS and JavaScript files

### CSS Styling (style.css)
- Modern, medical-themed design with purple accents
- Responsive layout supporting various screen sizes
- Custom animations for typing indicator and message bubbles
- Distinguishable styling for user and AI messages

### JavaScript Logic (script.js)
- Handles form submission and user input processing
- Makes API calls to Ollama's generate endpoint
- Implements markdown parsing for rich text responses
- Manages typing indicator for better UX

#### Core Functions

1. **`parseMarkdown(text)`**: Converts markdown syntax to HTML elements
2. **`addMessage(type, text)`**: Appends formatted messages to chat
3. **`handleFormSubmit(event)`**: Processes user input and triggers AI response
4. **Typing Indicator**: Shows visual feedback during AI processing

## AI Model Configuration

The application uses Llama 3 8B Instruct model with the following parameters:
- **Model**: llama3:latest
- **Temperature**: 0.5 (balances creativity and accuracy)
- **Max Response Length**: 100 tokens
- **System Prompt**: Custom prompt defining PEARL's role as a medical assistant

## System Prompt Details

```
You are PEARL, an AI medical assistant. Answer in 2-3 sentences max. Use bullet points if needed. Bold key terms with **text**. Never diagnose. Always advise consulting a doctor.
```

This prompt ensures responsible, concise, and medically-appropriate responses.

## API Integration

The app communicates with Ollama via RESTful API:

```javascript
const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        model: 'llama3',
        prompt: fullPrompt,
        stream: false,
        options: { temperature: 0.5, num_predict: 100 }
    })
});
```

## Error Handling

- Network connectivity issues fall back to predefined error messages
- Invalid responses from the AI model are handled gracefully
- CORS issues resolved by running local HTTP server on same origin

## Security Considerations

- All processing occurs locally; no data sent to external servers
- Personal health information stays on user's device
- No user authentication required for local usage
- End-to-end local execution ensures privacy

## Performance Considerations

- **Model Size**: Llama 3 8B runs efficiently on modern hardware with GPU acceleration
- **Memory Usage**: ~5-6GB VRAM recommended for optimal performance
- **Response Time**: Average response time of 5-10 seconds on typical hardware
- **Resource Management**: Ollama handles model loading/unloading automatically

## Future Enhancements

Potential areas for improvement:
- Voice input/output capabilities
- Multi-language support
- Integration with medical databases
- User preference settings
- Chat history persistence
- Dark/light theme toggle

## Usage Guidelines

1. **Ask clear, specific questions** about health topics
2. **Use for general information only** - not medical diagnosis
3. **Consult healthcare professionals** for personal medical advice
4. **Respect privacy** - all conversations remain local

## Demo Questions

- What are the benefits of drinking enough water daily?
- What are some tips for maintaining good oral hygiene?
- What are signs that I need to see a doctor for a fever?
- Explain what antioxidants are and why they're important.
- What are basic exercises for heart health?

## Troubleshooting

### Common Issues

1. **"API request failed"**: Ensure Ollama is running (`ollama serve`)
2. **Connection refused**: Check if port 11434 is accessible
3. **Slow responses**: Verify GPU acceleration availability
4. **CORS errors**: Use local HTTP server instead of file:// protocol

### Debugging Steps

1. Check Ollama status: `ollama list`
2. Test API endpoint: `curl http://localhost:11434/api/tags`
3. Monitor logs: View Ollama output in terminal
4. Browser console: Check for JavaScript errors

## Contributing

Contributions welcome! Consider:
- UI/UX improvements
- New features implementation
- Performance optimizations
- Documentation updates

## License

This project is open-source. See LICENSE file for details.

## Acknowledgments

- Meta for Llama 3 model
- Ollama team for local AI inference platform
- Open-source community for various tools and libraries used
