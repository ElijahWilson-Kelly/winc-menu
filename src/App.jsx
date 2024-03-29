import { useState } from "react";
import { Flex, useDisclosure, useToast } from "@chakra-ui/react";

import { RecipesPage } from "./pages/RecipesPage";
import { RecipePage } from "./pages/RecipePage";

import { data } from "./utils/data";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";
import { SearchModal } from "./modals/SearchModal";

const formatedData = data.hits.map((hit) => {
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
    searchTerm = {string}
  
  Conditionally renders RecipePage or RecipesPage depending on whether recipe has a value
*/
export const App = () => {
  const [recipe, setRecipe] = useState(null);
  const [filterTerm, setFilterTerm] = useState("");
  const [favouriteRecipes, setFavouriteRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    isOpen: isOpenSearchModal,
    onOpen: onOpenSearchModal,
    onClose: onCloseSearchModal,
  } = useDisclosure();

  const toast = useToast();
  let recipes = formatedData;

  if (filterTerm === "Vegetarian") {
    recipes = recipes.filter((recipe) =>
      recipe.recipe.healthLabels.includes("Vegetarian")
    );
  } else if (filterTerm === "Vegan") {
    recipes = recipes.filter((recipe) =>
      recipe.recipe.healthLabels.includes("Vegan")
    );
  } else if (filterTerm === "Favourite") {
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
      setFavouriteRecipes((prevRecipies) => {
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
      setFavouriteRecipes((prevRecipies) => {
        return [
          ...prevRecipies.slice(0, index),
          ...prevRecipies.slice(index + 1),
        ];
      });
    }
  };

  const handleFilterchange = (term) => {
    setRecipe(null);
    setFilterTerm(term);
  };

  const handleSearchChange = (term) => {
    setRecipe(null);
    setSearchTerm(term);
  };

  return (
    <Flex minHeight="100vh" direction="column" bg="white">
      <SearchModal
        isOpen={isOpenSearchModal}
        onClose={onCloseSearchModal}
        setSearchTerm={handleSearchChange}
      />

      <NavBar
        filterTerm={filterTerm}
        setFilterTerm={handleFilterchange}
        openSearchModal={onOpenSearchModal}
      />

      {recipe ? (
        <RecipePage
          recipe={recipe}
          setRecipe={setRecipe}
          toggleRecipeFavourite={toggleRecipeFavourite}
        />
      ) : (
        <RecipesPage
          recipes={recipes}
          setRecipe={setRecipe}
          favouriteRecipes={favouriteRecipes}
          filterTerm={filterTerm}
          searchTerm={searchTerm}
          setSearchTerm={handleSearchChange}
        />
      )}
      <Footer />
    </Flex>
  );
};
