# 🍽️ QuickBite - AI Recipe Generator

Generate delicious recipes from your available ingredients using Llama 2.7! This app uses a locally hosted LLM to create recipes with ingredients, cooking instructions, and nutrition facts.

## Features

- 🤖 AI-powered recipe generation using Llama 2.7
- 📝 Complete recipe details: ingredients, instructions, and nutrition facts
- 🎨 Beautiful, responsive UI
- 🚀 No external APIs - everything runs locally
- ⚡ Fast and efficient

## Prerequisites

- Node.js (v16 or higher)
- [Ollama](https://ollama.ai/) installed and running
- Llama 2.7 model downloaded

## Setup Instructions

### 1. Install Ollama

First, install Ollama on your system:

**Windows:**
```bash
# Download from https://ollama.ai/download
# Or use winget:
winget install Ollama.Ollama
```

**macOS:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### 2. Download Llama 2.7 Model

After installing Ollama, download the Llama 2.7 model:

```bash
ollama pull llama2.2:7b
```

### 3. Start Ollama

Start the Ollama service:

```bash
ollama serve
```

### 4. Install Dependencies

Navigate to the project directory and install dependencies for both backend and frontend:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 5. Configure Environment

Create a `.env` file in the backend directory:

```bash
cd ../backend
cp env.example .env
```

Edit the `.env` file if needed:
```
PORT=5000
OLLAMA_URL=http://localhost:11434
MODEL_NAME=llama2.2:7b
```

### 6. Start the Application

**Terminal 1 - Start the backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Start the frontend:**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage

1. Open your browser and go to http://localhost:3000
2. Enter your available ingredients (separated by commas)
3. Click "Generate Recipes"
4. View your 3 AI-generated recipes with complete details!

## Example Input

```
chicken, rice, tomatoes, onions, garlic
```

## Project Structure

```
QuickBite/
├── backend/
│   ├── server.js          # Express server with API endpoints
│   ├── package.json       # Backend dependencies
│   └── env.example        # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Main styles
│   ├── public/
│   │   └── index.html     # HTML template
│   └── package.json       # Frontend dependencies
└── README.md              # This file
```

## API Endpoints

- `POST /api/recipes` - Generate recipes from ingredients
- `GET /api/health` - Health check endpoint

## Troubleshooting

### Ollama Issues
- Make sure Ollama is running: `ollama serve`
- Check if the model is downloaded: `ollama list`
- Verify the model name in your `.env` file matches the downloaded model

### Port Issues
- If port 5000 is in use, change the PORT in your `.env` file
- If port 3000 is in use, React will automatically suggest an alternative port

### Model Performance
- The 7B model provides a good balance of speed and quality
- For better results, you can try larger models (13B, 70B) but they require more RAM
- Adjust the `temperature` and `top_p` parameters in `server.js` for different creativity levels

## Customization

### Changing the LLM Model
1. Download a different model: `ollama pull <model-name>`
2. Update the `MODEL_NAME` in your `.env` file
3. Restart the backend server

### Modifying the Prompt
Edit the `generateRecipePrompt` function in `backend/server.js` to customize how recipes are generated.

### Styling
Modify `frontend/src/index.css` to customize the appearance of the application.

## License

MIT License - feel free to use this project for your own purposes!

## Contributing

Feel free to submit issues and enhancement requests! 