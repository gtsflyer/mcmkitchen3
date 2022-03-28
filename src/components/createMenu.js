import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Form } from 'react-bootstrap';
import Select, { createFilter } from "react-select";
import CustomOption from "./customOption";
import CustomMenuList from "./CustomMenuList";
import "./customOptions.css";
 
export default function CreateMenu() {
    const [recipes, setRecipes] = useState([]);

    const menuDayList = [
        {"value": "Tuesday", "label": "Tuesday, June 28th"},
        {"value": "Wednesday", "label": "Wednesday, June 29th"},
        {"value": "Thursday", "label": "Thursday, June 30th"},
        {"value": "Friday", "label": "Friday, July 1st"},
        {"value": "Saturday", "label": "Saturday, July 2nd"},
        {"value": "Sunday", "label": "Sunday, July 3rd"}
    ];

    const menuMealList = [
        {"value": "Breakfast", "label": "Breakfast"},
        {"value": "Lunch", "label": "Lunch"},
        {"value": "Dinner", "label": "Dinner"}
    ];

    // This method fetches the records from the database.
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

    const [form, setForm] = useState({
    menuDay: "",
    menuMeal: "",
    recipeList: [{ recipeName: "", serving : ""}]
    });
    const navigate = useNavigate();
    
    // These methods will update the state properties.
    function updateForm(value) {
    return setForm((prev) => {
        return { ...prev, ...value };
    });
    }

    function addFormFields() {
    let newRecipeList = form.recipeList.push({ recipeName: "", serving : ""});
    updateForm(newRecipeList);
    }

    function removeFormFields(i) {
        let newRecipeList = [...form.recipeList];
        newRecipeList.splice(i, 1);
        updateForm({recipeList: newRecipeList})
    }

    let updateRecipe = (i, e) => {
        let newRecipeList = [...form.recipeList];
        newRecipeList[i][e.target.name] = e.target.value;
        updateForm({recipeList: newRecipeList});
    }

    let updateSelectbox = (i, e) => {
        let newRecipeList = [...form.recipeList];
        newRecipeList[i]["recipeName"] = e.value;
        updateForm({recipeList: newRecipeList});
      }
    
    // This function will handle the submission.
    async function onSubmit(e) {
    e.preventDefault();
    
    // When a post request is sent to the create url, we'll add a new record to the database.
    const newMenu = { ...form };

    await fetch("http://localhost:5000/menus/add", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(newMenu),
    })
    .catch(error => {
        window.alert(error);
        return;
    });
    
    setForm({ menuDay: "", menuMeal: "", recipeList: [{ recipeName: "", serving : ""}]});
    navigate("/menuList");
    }

    const recipeSearchList = recipes.map(recipeItem => {
        return{ 
            value: `${recipeItem.recipeName}`,
            label: `${recipeItem.recipeName}` 
        }
    });
    
    // This following section will display the form that takes the input from the user.
    return (
        <div class="container">
        <div class="row">
          <div class="col">
          <form onSubmit={onSubmit}>
        <h3>Create Menu <input
              type="submit"
              value="💾 Save"
              className="btn btn-primary"
            /></h3>
        <div className="form-group">
            <label htmlFor="menuDay">Menu Day</label>
            <Select
                placeholder={form.menuDay ? `${form.menuDay}` : "Select Day..."}
                name="menuDay"
                value={form.menuDay}
                onChange={(e) => updateForm({ menuDay: e.value })}
                filterOption={createFilter({ ignoreAccents: false })}
                captureMenuScroll={false}
                classNamePrefix="custom-select"
                components={{ Option: CustomOption, MenuList: CustomMenuList }}
                options={menuDayList}
            >
            </Select>
        </div>
        <div className="form-group">
            <label htmlFor="menuMeal">Menu Meal</label>
            <Select 
                placeholder={form.menuMeal ? `${form.menuMeal}` : "Select Meal..."}
                name="menuMeal"
                value={form.menuMeal}
                onChange={(e) => updateForm({ menuMeal: e.value })}
                filterOption={createFilter({ ignoreAccents: false })}
                captureMenuScroll={false}
                classNamePrefix="custom-select"
                components={{ Option: CustomOption, MenuList: CustomMenuList }}
                options={menuMealList}
                >
            </Select>
        </div>
        {form.recipeList.map((recipe, index) => (
            <div className="form-group" key={index}>
            <label htmlFor="recipe">Select Recipe #{index+1}{
                 index ? 
                 <input
                   type="button"
                   value="⛔ Remove Recipe"
                   className="btn btn-primary"
                   onClick={() => removeFormFields(index)}
                 />
                 : null
               }</label>
      
            <Select
                isSearchable="true"
                placeholder={form.recipeList[index].recipeName ? form.recipeList[index].recipeName : "Select Recipe..."}
                onChange={(e) => updateSelectbox(index, e)}
                filterOption={createFilter({ ignoreAccents: false })}
                captureMenuScroll={false}
                classNamePrefix="custom-select"
                components={{ Option: CustomOption, MenuList: CustomMenuList }}
                options={recipeSearchList}
                />

                <label htmlFor="serving" className="form-check-label">Input planned servings</label>
                <input
                type="number"
                className="form-control"
                name="serving"
                value={recipe.serving}
                onChange={(e) => updateRecipe(index, e)}
                />
            </div>
        ))}
        <div className="form-group" style={{
          borderStyle: 'dashed',
          borderWidth: 1,
          borderRadius: 1,
          color: '#AAAAAA',
          padding: 10,
        }}>
            <input
            type="button"
            value="Additional Recipe"
            className="btn btn-primary"
            onClick={() => addFormFields()}
            />
          </div>
        </form>
      </div>
      </div>
          </div>
    );
}




 /*       
    <div>
        <h3>Create New Menu</h3>
        <form onSubmit={onSubmit}>
        <div className="form-group">
            <label htmlFor="menuDay">Menu Day</label>
            <Form.Control as="select" name="menuDay" onChange={(e) => updateForm({ menuDay: e.target.value })}>
                <option disabled selected value> -- select a date -- </option>
                <option value="Tuesday">Tuesday, June 28th</option>
                <option value="Wednesday">Wednesday, June 29th</option>
                <option value="Thursday">Thursday, June 30th</option>
                <option value="Friday">Friday, July 1st</option>
                <option value="Saturday">Saturday, July 2nd</option>
                <option value="Sunday">Sunday, July 3rd</option>
            </Form.Control>
        </div>
        <div className="form-group">
            <label htmlFor="menuMeal">Menu Meal</label>
            <Form.Control as="select" name="menuMeal" onChange={(e) => updateForm({ menuMeal: e.target.value })}>
                <option disabled selected value> -- select a meal -- </option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
            </Form.Control>
        </div>
        {form.recipeList.map((recipe, index) => (
            <div className="form-group" key={index}>
            <label htmlFor="recipe">Select Recipe #{index+1}</label>
            <div className="form-check form-check-inline">
            <Form.Control as="select" name="recipeName" onChange={(e) => updateRecipe(index, e)}>
                <option disabled selected value> -- select a recipe -- </option>
                {recipes.map(recipeItem => {
                    return <option value={recipeItem.recipeName}>{recipeItem.recipeName}</option>;
                })}
                </Form.Control>
                <label htmlFor="serving" className="form-check-label">Input planned servings</label>
                <input
                type="number"
                className="form-control"
                name="serving"
                value={recipe.serving}
                onChange={(e) => updateRecipe(index, e)}
                />
            </div>
            <div className="form-check form-check-inline">
                {
                index ? 
                <input
                    type="button"
                    value="Remove Recipe"
                    className="btn btn-primary"
                    onClick={() => removeFormFields(index)}
                />
                : null
                }
            </div>
            </div>
        ))}
        <div className="form-group">
            <input
            type="button"
            value="Additional Recipe"
            className="btn btn-primary"
            onClick={() => addFormFields()}
            />
        </div>
        <div className="form-group">
            <input
            type="submit"
            value="Save Menu"
            className="btn btn-primary"
            />
        </div>
        </form>
    </div>
    */