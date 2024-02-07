import React, { createContext, useContext, useEffect, useState } from "react";

const categoriesContext = createContext();
const backend = process.env.REACT_APP_BACKEND;

export default function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState();
  function addCategory(category) {
    setCategories((prevCats) => [
      ...prevCats,
      {
        ...category,
        items: [],
      },
    ]);
  }
  function removeCategory(catId) {
    setCategories((prevCats) => prevCats.filter((cat) => cat.id !== catId));
  }
  function addItem(item) {
    setCategories((prevCats) =>
      prevCats.map((cat) => {
        if (cat.id === item.categoryId) {
          cat.items.push(item);
        }
        return cat;
      })
    );
  }
  function removeItem() {
   fetchData()
  }
 function updateItem() {
  fetchData()
 }

  function updateCategory(category) {
   fetchData()
  }

function fetchData() {
  setCategories();
  fetch(backend + "/api/data/all")
    .then((res) => res.json())
    .then((data) => {
      // Step 1: Sort categories by order
      data.categories.sort((a, b) => a.order - b.order);

      // Step 2: Use a Map to efficiently group items by 'categoryId'
      const itemsByCategory = new Map();

      data.items.forEach((item) => {
        if (!itemsByCategory.has(item.categoryId)) {
          itemsByCategory.set(item.categoryId, []);
        }
        itemsByCategory.get(item.categoryId).push(item);
      });

      // Step 3: Map each category to include an 'items' array, ordered by 'order'
      const categoriesWithItems = data.categories.map((category) => ({
        ...category,
        items: (itemsByCategory.get(category.id) || []).sort(
          (a, b) => a.order - b.order
        ),
      }));

      setCategories(categoriesWithItems);
    });
}

  useEffect(() => {
   fetchData()
  }, []);
  return (
    <categoriesContext.Provider
      value={{
        categories,
        addCategory,
        addItem,
        removeItem,
        removeCategory,
        updateItem,
        updateCategory,
      }}
    >
      {children}
    </categoriesContext.Provider>
  );
}

export const useCategories = () => {
  return useContext(categoriesContext);
};
