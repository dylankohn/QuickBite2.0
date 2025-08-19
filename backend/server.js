const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Graceful shutdown handler for production deployment
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL_NAME = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

// Recipe generation endpoint
app.post('/api/recipes', async (req, res) => {
  try {
    const { ingredients } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'Please provide a list of ingredients' });
    }

    const prompt = generateRecipePrompt(ingredients);
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 1000
    });

    const recipes = parseRecipesFromResponse(response.choices[0].message.content);
    
    res.json({ recipes });
  } catch (error) {
    console.error('Error generating recipes:', error);
    res.status(500).json({ error: 'Failed to generate recipes' });
  }
});

function generateRecipePrompt(ingredients) {
  const ingredientList = ingredients.join(', ');
  
  return `Generate exactly 3 different recipes using these ingredients: ${ingredientList}

You can suggest additional common ingredients if needed.

CRITICAL: Respond ONLY with valid JSON. NO text before or after. ALL values must be in quotes. Follow this EXACT format:

{
  "recipes": [
    {
      "name": "Recipe Name",
      "ingredients": [
        {"item": "ingredient name", "quantity": "amount", "unit": "unit of measurement"}
      ],
      "instructions": [
        "Step 1: Detailed first step",
        "Step 2: Second step with specifics",
        "Step 3: Third step...",
        "Add as many steps as needed for a complete recipe"
      ],
      "nutrition": {
        "calories": "300",
        "protein": "15g",
        "carbs": "45g", 
        "fat": "8g",
        "fiber": "6g"
      }
    }
  ]
}

Instructions should be detailed and include as many steps as necessary to properly complete the recipe. Don't limit yourself to just 3 steps - provide comprehensive cooking instructions.
Remember: ALL nutrition values must be strings in quotes, including calories!`;
}

function parseRecipesFromResponse(llmResponse) {
  try {
    console.log('Raw LLM Response:', llmResponse);
    
    // Try to find JSON starting with { and ending with }
    const jsonStart = llmResponse.indexOf('{');
    const jsonEnd = llmResponse.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      let jsonString = llmResponse.substring(jsonStart, jsonEnd + 1);
      
      // Fix common JSON issues from LLM responses
      // 1. Fix unquoted numbers in nutrition values (e.g., "fat": 12g -> "fat": "12g")
      jsonString = jsonString.replace(/("(?:calories|protein|carbs|fat|fiber)"\s*:\s*)(\d+[a-zA-Z]*)(,|\s*})/g, '$1"$2"$3');
      
      // 2. Fix missing quotes around numbers followed by letters
      jsonString = jsonString.replace(/:\s*(\d+[a-zA-Z]+)([,}\]])/g, ': "$1"$2');
      
      console.log('Cleaned JSON:', jsonString);
      
      const parsed = JSON.parse(jsonString);
      if (parsed.recipes && Array.isArray(parsed.recipes)) {
        console.log('Successfully parsed recipes:', parsed.recipes.length);
        return parsed.recipes;
      }
    }
    
    // Fallback: return a simple parsed version
    console.log('Using fallback parsing');
    return [{
      name: "Generated Recipe",
      ingredients: [],
      instructions: [llmResponse],
      nutrition: {
        calories: 0,
        protein: "0g",
        carbs: "0g",
        fat: "0g",
        fiber: "0g"
      }
    }];
  } catch (error) {
    console.error('Error parsing LLM response:', error);
    console.error('Response that failed to parse:', llmResponse);
    return [{
      name: "Generated Recipe",
      ingredients: [],
      instructions: [llmResponse],
      nutrition: {
        calories: 0,
        protein: "0g",
        carbs: "0g",
        fat: "0g",
        fiber: "0g"
      }
    }];
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'QuickBite backend is running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`OpenAI Model: ${MODEL_NAME}`);
  console.log(`OpenAI API Key: ${process.env.OPENAI_API_KEY ? 'Set' : 'Not set'}`);
}); 