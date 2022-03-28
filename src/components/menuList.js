import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import { Card, Button } from 'react-bootstrap';

function Menu() {
  const [menus, setMenus] = useState([]);

  // This method fetches the records from the database.
  useEffect(() => {
    async function getMenus() {
    const response = await fetch(`http://localhost:5000/menus/`);

    if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
    }

    const menus = await response.json();
    if (menus.length <= 0) {
        alert("No Menus Found");
        //navigate("/");
    }
    setMenus(menus);
    }

    getMenus();

    return;
}, [menus.length]);

  return (
    <div class="container">
      <div class="row">
        {menus.map(menu => (     
          <div class="col">
            <Card style={{ width: '18rem' }}>
              <Card.Img variant="top" style={{ width: '12rem' }} src="Menu.png" />
              <Card.Body>
                <Card.Title>{menu.menuDay} {menu.menuMeal}</Card.Title>
                <Card.Text>
                  <ul>
                    {menu.recipeList.map(recipe => {
                      return <li>Serving {recipe.serving} plates of {recipe.recipeName}</li>;
                    })}
                  </ul>
                  <a href={'/editMenu/'+menu._id} class="btn btn-primary">Edit {menu.menuDay} {menu.menuMeal}</a>
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
        <div class="row">
          <div class="col">
            <Button href="/createMenu">➕ Add a new Menu</Button>
          </div>
        </div>
    </div>
  );
}

export default Menu;
