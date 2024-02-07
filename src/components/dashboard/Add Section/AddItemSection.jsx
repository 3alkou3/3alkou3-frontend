import React, { useState } from "react";
import { useCategories } from "../../../context/categoriesContext";

const backend = process.env.REACT_APP_BACKEND;

const AddItemSection = () => {
  const { addItem } = useCategories();
  const { categories } = useCategories();
  const [isFetching, setIsFetching] = useState(false);
  const [itemData, setItemData] = useState({
    name: "",
    price: "",
    categoryId: categories[0].id,
    type: "menuItem",
    order: categories[0].items.length + 1,
    description: "",
  });

  const [errors, setErrors] = useState({});

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setItemData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "categoryId") {
      setItemData((prevData) => {
        const categoryId = Number(value);
        const selectedCategory = categories.find(
          (category) => category.id === categoryId
        );
        const order = selectedCategory ? selectedCategory.items.length + 1 : 1;

        return {
          ...prevData,
          order: order,
        };
      });
    }
    setErrors((prevErrs) => ({
      ...prevErrs,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validForm = true;

    if (itemData.type === "menuItem") {
      if (!itemData.name) {
        setErrors((prevErrs) => ({
          ...prevErrs,
          name: "Name is required",
        }));
        validForm = false;
      }
      if (!itemData.price) {
        setErrors((prevErrs) => ({
          ...prevErrs,
          price: "Price is required",
        }));
        validForm = false;
      }
    }

    if (!validForm) {
      return;
    }

    itemData.categoryId = Number(itemData.categoryId);
    try {
      // Send the form data to the server
      setIsFetching(true);
      const response = await fetch(backend + "/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });
      setIsFetching(false);

      if (response.ok) {
        const item = await response.json();
        addItem(item);
        setItemData((prevData) => ({
          name: "",
          price: "",
          categoryId: prevData.categoryId,
          type: "menuItem",
          description: "",
          order: prevData.order + 1,
        }));

        if (item.type === "menuItem") {
          alert("Successfully added item: " + item.name);
        } else {
          alert("Successfully added separator");
        }
      } else {
        console.error("Server error:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-4 p-8 text-black">
      <h2 className="-mt-2 mb-6 text-center text-2xl text-white">Add Item</h2>
      <div className="flex flex-col gap-4">
        {itemData.type === "menuItem" ? (
          <>
            {" "}
            <input
              className="border-primary max-w-[200px]"
              type="text"
              name="name"
              value={itemData.name}
              placeholder="Item Name"
              onChange={handleFormChange}
            />
            {errors.name && (
              <div className="text-sm text-red-500 -mt-1">{errors.name}</div>
            )}
            <input
              className="border-primary max-w-[200px]"
              type="text"
              name="price"
              value={itemData.price}
              placeholder="Item Price"
              onChange={handleFormChange}
            />
            {errors.price && (
              <div className="text-sm text-red-500 -mt-1">{errors.price}</div>
            )}
            <input
              className="border-primary max-w-[200px]"
              type="text"
              name="description"
              value={itemData.description}
              placeholder="Item Description"
              onChange={handleFormChange}
            />
            {errors.description && (
              <div className="text-sm text-red-500 -mt-1">
                {errors.description}
              </div>
            )}
          </>
        ) : (
          ""
        )}
        <select
          className="border-primary max-w-[200px]"
          name="categoryId"
          value={itemData.categoryId}
          onChange={handleFormChange}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <div className="text-sm text-red-500 -mt-1">{errors.categoryId}</div>
        )}
        <select
          className="border-primary max-w-[200px]"
          name="type"
          value={itemData.type}
          onChange={handleFormChange}
        >
          <option value="menuItem">Menu Item</option>
          <option value="separator">Separator</option>
        </select>
        <button
          type="submit"
          className="border-primary px-4 py-2 bg-secondary text-primary rounded"
          disabled={isFetching}
          style={{
            opacity: isFetching ? 0.7 : 1,
          }}
        >
          Add Item
        </button>
      </div>
    </form>
  );
};

export default AddItemSection;
