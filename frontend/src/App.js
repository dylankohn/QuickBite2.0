import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!ingredients.trim()) {
      setError('Please enter some ingredients');
      return;
    }

    setLoading(true);
    setError('');
    setRecipes([]);

    try {
      // Split ingredients by comma and clean them up
      const ingredientList = ingredients
        .split(',')
        .map(ingredient => ingredient.trim())
        .filter(ingredient => ingredient.length > 0);

      const response = await axios.post('/api/recipes', {
        ingredients: ingredientList
      });

      setRecipes(response.data.recipes || []);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError(err.response?.data?.error || 'Failed to generate recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setIngredients(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header">
          <h1>🍽️ QuickBite</h1>
          <p>Enter your ingredients and get AI-generated recipes!</p>
        </div>

        <form onSubmit={handleSubmit} className="ingredient-form">
          <div className="form-group">
            <label htmlFor="ingredients">
              What ingredients do you have? (separate with commas)
            </label>
            <input
              type="text"
              id="ingredients"
              value={ingredients}
              onChange={handleInputChange}
              placeholder="e.g., chicken, rice, tomatoes, onions"
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Generating Recipes...' : 'Generate Recipes'}
          </button>
        </form>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {loading && (
          <div className="loading">
            <p>🤖 AI is cooking up some delicious recipes for you...</p>
          </div>
        )}

        {recipes.length > 0 && (
          <div className="recipes-container">
            {recipes.map((recipe, index) => (
              <div key={index} className="recipe-card">
                <h2 className="recipe-title">{recipe.name}</h2>
                
                <div className="recipe-section">
                  <h3>Ingredients</h3>
                  <ul className="ingredients-list">
                    {recipe.ingredients && recipe.ingredients.map((ingredient, i) => (
                      <li key={i}>
                        <span className="ingredient-name">{ingredient.item}</span>
                        <span className="ingredient-quantity">
                          {ingredient.quantity} {ingredient.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="recipe-section">
                  <h3>Instructions</h3>
                  <ol className="instructions-list">
                    {recipe.instructions && recipe.instructions.map((instruction, i) => (
                      <li key={i}>{instruction}</li>
                    ))}
                  </ol>
                </div>

                <div className="recipe-section">
                  <h3>Nutrition Facts (per serving)</h3>
                  <div className="nutrition-grid">
                    <div className="nutrition-item">
                      <span className="nutrition-value">{recipe.nutrition?.calories || 0}</span>
                      <span className="nutrition-label">Calories</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-value">{recipe.nutrition?.protein || '0g'}</span>
                      <span className="nutrition-label">Protein</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-value">{recipe.nutrition?.carbs || '0g'}</span>
                      <span className="nutrition-label">Carbs</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-value">{recipe.nutrition?.fat || '0g'}</span>
                      <span className="nutrition-label">Fat</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-value">{recipe.nutrition?.fiber || '0g'}</span>
                      <span className="nutrition-label">Fiber</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 