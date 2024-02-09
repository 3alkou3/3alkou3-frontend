import { useState } from "react";
import { useCategories } from "../../../context/categoriesContext";

const backend = process.env.REACT_APP_BACKEND;

const AddCategorySection = () => {
  const { categories } = useCategories();
  const [isFetching, setIsFetching] = useState(false);
  const { addCategory } = useCategories();

  const [categoryData, setCategoryData] = useState({
    name: "",
    type: "WithPrices",
    order: categories.length + 1,
    categoryImage: null,
  });

  const [errors, setErrors] = useState({});

  const handleFormChange = (e) => {
    const { name, value, type, files } = e.target;

    setCategoryData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryData.name || !categoryData.order) {
      setErrors({
        name: !categoryData.name ? "Name is required" : "",
        order: !categoryData.order ? "Order is required" : "",
      });
      return;
    }

    // Clear previous errors
    setErrors({});

    // Create FormData object to handle file upload
    const formData = new FormData();
    formData.append("name", categoryData.name);
    formData.append("type", categoryData.type);
    formData.append("order", categoryData.order);
    formData.append("categoryImage", categoryData.categoryImage);

    try {
      // Send the form data to the server
      setIsFetching(true);
      const response = await fetch(backend + "/api/categories", {
        method: "POST",
        body: formData,
      });
      setIsFetching(false);

      if (response.ok) {
        const category = await response.json();
        addCategory(category);
        setCategoryData(prevData => ({
          name: "",
          type: "WithPrices",
          order: prevData.order + 1,
          categoryImage: null,
        }));
        alert("Successfully added category: " + category.name);
      } else {
        // Handle server errors or display error messages
        console.error("Server error:", response.status, response.statusText);
      }
    } catch (error) {
      // Handle network errors
      console.error("Network error:", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-4 p-8">
      <h2 className="-mt-2 mb-6 text-center text-2xl">Add Category</h2>
      <div className="flex flex-col gap-4">
        <input
          className="border-primary max-w-[200px] text-black"
          type="text"
          name="name"
          value={categoryData.name}
          placeholder="Category Name"
          onChange={handleFormChange}
        />
        {errors.name && (
          <div className="text-sm text-red-500 -mt-1">{errors.name}</div>
        )}
        <select
          className="border-primary max-w-[200px] text-black"
          name="type"
          value={categoryData.type}
          onChange={handleFormChange}
        >
          <option value="WithPrices">Items With Prices</option>
          <option value="OnlyItems">Only Items</option>
        </select>
        <input
          className=" bg-white text-black max-w-[200px]"
          type="file"
          name="categoryImage"
          onChange={handleFormChange}
        />
        <button
          type="submit"
          className="border-primary px-4 py-2 bg-secondary text-primary rounded"
          disabled={isFetching}
          style={{
            opacity: isFetching ? 0.7 : 1,
          }}
        >
          Add Category
        </button>
      </div>
    </form>
  );
};

export default AddCategorySection;
