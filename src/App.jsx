import { useState } from "react";
import { Flex, useToast } from "@chakra-ui/react";

import { RecipesPage } from "./pages/RecipesPage";
import { RecipePage } from "./pages/RecipePage";

import { data } from "./utils/data";
let recipes = data.hits.map((hit) => {
  const newUrl = hit.recipe.image.slice(4);
  return {
    ...hit,
    recipe: {
      ...hit.recipe,
      image: newUrl,
    },
  };
});

/*
  Main Component
  State - 
    recipe - {object} or {null}
    filterTerm - {string}
    favourtieRecipes - {array}
  
  Conditionally renders RecipePage or RecipesPage depending on whether recipe has a value
*/
export const App = () => {
  const [recipe, useRecipe] = useState(null);
  const [filterTerm, useFilterTerm] = useState("All");
  const [favouriteRecipes, useFavouriteRecipes] = useState([]);
  const toast = useToast();

  if (filterTerm === "Vegetarian") {
    recipes = recipes.filter((recipe) =>
      recipe.recipe.healthLabels.includes("Vegetarian")
    );
  } else if (filterTerm === "Vegan") {
    recipes = recipes.filter((recipe) =>
      recipe.recipe.healthLabels.includes("Vegan")
    );
  } else if (filterTerm === "Favourites") {
    recipes = favouriteRecipes;
  }

  const toggleRecipeFavourite = (recipeToToggle) => {
    const index = favouriteRecipes.findIndex(
      (recipe) => recipe.recipe.label === recipeToToggle.label
    );
    if (index < 0) {
      recipeToToggle.favourited = true;
      toast({
        title: "Item added",
        description: `${recipeToToggle.label} added to favourites`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      useFavouriteRecipes((prevRecipies) => {
        return [...prevRecipies, { recipe: recipeToToggle }];
      });
    } else {
      recipeToToggle.favourited = false;
      toast({
        title: "Item removed",
        description: `${recipeToToggle.label} removed from favourites`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      useFavouriteRecipes((prevRecipies) => {
        return [
          ...prevRecipies.slice(0, index),
          ...prevRecipies.slice(index + 1),
        ];
      });
    }
  };

  return (
    <Flex minHeight="100vh" direction="column" bg="blue.900">
      {recipe ? (
        <RecipePage
          recipe={recipe}
          useRecipe={useRecipe}
          toggleRecipeFavourite={toggleRecipeFavourite}
        />
      ) : (
        <RecipesPage
          recipes={recipes}
          useRecipe={useRecipe}
          favouriteRecipes={favouriteRecipes}
          filterTerm={filterTerm}
          useFilterTerm={useFilterTerm}
        />
      )}
    </Flex>
  );
};
