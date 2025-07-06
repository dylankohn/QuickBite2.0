const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ollama configuration
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const MODEL_NAME = process.env.MODEL_NAME || 'llama3.2:3b';

// Recipe generation endpoint
app.post('/api/recipes', async (req, res) => {
  try {
    const { ingredients } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'Please provide a list of ingredients' });
    }

    const prompt = generateRecipePrompt(ingredients);
    
    // Call Ollama API
    const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
      model: MODEL_NAME,
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.5,
        top_p: 0.9,
        max_tokens: 1000
      }
    });

    const recipes = parseRecipesFromResponse(response.data.response);
    
    res.json({ recipes });
  } catch (error) {
    console.error('Error generating recipes:', error);
    res.status(500).json({ error: 'Failed to generate recipes' });
  }
});

function generateRecipePrompt(ingredients) {
  const ingredientList = ingredients.join(', ');
  
  return `You are a professional chef and nutritionist. Given these ingredients: ${ingredientList}

Please generate exactly 3 different recipes that can be made using these ingredients (you can suggest additional common ingredients if needed). 

For each recipe, provide:
1. Recipe name
2. Complete ingredient list with quantities
3. Step-by-step cooking instructions
4. Estimated nutrition facts per serving (calories, protein, carbs, fat, fiber)

Format your response as JSON with this exact structure:
{
  "recipes": [
    {
      "name": "Recipe Name",
      "ingredients": [
        {"item": "ingredient name", "quantity": "amount", "unit": "unit of measurement"}
      ],
      "instructions": [
        "Step 1 instruction",
        "Step 2 instruction",
        "Step 3 instruction"
      ],
      "nutrition": {
        "calories": 300,
        "protein": "15g",
        "carbs": "45g", 
        "fat": "8g",
        "fiber": "6g"
      }
    }
  ]
}

Make sure the recipes are practical, delicious, and use the provided ingredients as the main components.`;
}

function parseRecipesFromResponse(llmResponse) {
  try {
    // Try to extract JSON from the response
    const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.recipes && Array.isArray(parsed.recipes)) {
        return parsed.recipes;
      }
    }
    
    // Fallback: return a simple parsed version
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Ollama URL: ${OLLAMA_URL}`);
  console.log(`Model: ${MODEL_NAME}`);
}); 