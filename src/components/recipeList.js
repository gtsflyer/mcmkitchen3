import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button } from 'react-bootstrap';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import IngredientList from "./ingredientList.json";

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getRecipes() {
    const response = await fetch(`http://localhost:5000/recipes/`);

    if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
    }

    const recipes = await response.json();
    if (recipes.length <= 0) {
        alert("No Recipes Found. You can't create a menu with out first creating some recipes!");
        navigate("/");
    }
    setRecipes(recipes);
    }

    getRecipes();
    
    return;
}, [recipes.length]);

  return (
    <>
      <div class="container">
        <div class="row">
          {recipes.map(recipe => (     
            <div class="col">
              <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" style={{ width: '12rem' }} src="Recipe.png" />
                <Card.Body>
                  <Card.Title>{recipe.recipeName}</Card.Title>
                  <Card.Text>
                    <ul>
                      {recipe.ingredientList.map(ingredient => {
                        const ingredientName = IngredientList.filter(obj => obj.id === ingredient.id)[0].name;
                        const ingredientQuantityType = IngredientList.filter(obj => obj.id === ingredient.id)[0].quantityType;
                        return <li>{ingredient.quantity} {ingredientQuantityType} of {ingredientName} </li>;
                      })}
                    </ul>
                    Serves: {recipe.servings}<br />
                    <a href={'/editRecipe/'+recipe._id} class="btn btn-primary stretched-link">Edit {recipe.recipeName}</a>
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
        <div class="row">
          <div class="col">
            <Button href="/createRecipe">➕ Add a new Recipe</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Recipes;
