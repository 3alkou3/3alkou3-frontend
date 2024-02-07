import { useState } from "react";
import ConfirmationModal from "../ConfirmationModal";
import Modal from "../modal";
import { useCategories } from "../../context/categoriesContext";

const backend = process.env.REACT_APP_BACKEND;

export default function CategoryModal({ category, isOpen, onClose }) {
  const { removeCategory, updateCategory, categories } = useCategories();
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState(false);
  const [inputs, setInputs] = useState({
    name: category.name,
    order: category.order,
    image: category.icon,
  });

  const [errors, setErrors] = useState({});

  const handleFormChange = (e) => {
    const { name, value, type, files } = e.target;

    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: type === "file" ? files[0] : value,
    }));
     setErrors((prevErrs) => ({
       ...prevErrs,
       [name]: "",
     }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validForm = true;

    if (!inputs.name) {
      setErrors((prevErrs) => ({
        ...prevErrs,
        name: "Name is required",
      }));
      validForm = false;
    }
    if (!inputs.order) {
      setErrors((prevErrs) => ({
        ...prevErrs,
        order: "Order is required",
      }));
      validForm = false;
    } else if (inputs.order < 1 || inputs.order > categories.length) {
      setErrors((prevErrs) => ({
        ...prevErrs,
        order: "Order should be between 0 and " + categories.length,
      }));
      validForm = false;
    }
    

    if (!validForm) {
      return;
    }

    // Create FormData object to handle file upload
    const formData = new FormData();
    formData.append("name", inputs.name);
    formData.append("order", Number(inputs.order));
    formData.append("icon", inputs.image);

    try {
      // Send the form data to the server
      const response = await fetch(backend + "/api/categories/" + category.id, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        const category = await response.json();
        updateCategory(category);
        alert("Updated category " + category.name);
        onClose();
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <input
          className="border-primary max-w-[200px]"
          type="text"
          name="name"
          value={inputs.name}
          placeholder="Category Name"
          onChange={handleFormChange}
        />
        {errors.name ? (
          <div className="text-sm text-red-500 -mt-1">{errors.name}</div>
        ) : (
          ""
        )}
        <input
          className="border-primary max-w-[200px]"
          type="number"
          name="order"
          value={inputs.order}
          min={1}
          max={categories.length}
          placeholder="Category Order"
          onChange={handleFormChange}
        />
        {errors.order ? (
          <div className="text-sm text-red-500 -mt-1">{errors.order}</div>
        ) : (
          ""
        )}

        <button
          className="bg-secondary text-white rounded-xl py-2"
          onClick={handleSubmit}
        >
          Update
        </button>
        <button
          onClick={() => setDeleteConfirmationModalOpen(true)}
          className="bg-red-600 text-white rounded-xl py-2"
        >
          Delete
        </button>
      </div>
      <ConfirmationModal
        isOpen={deleteConfirmationModalOpen}
        message={"Are you sure you want to delete " + category.name}
        onClose={() => setDeleteConfirmationModalOpen(false)}
        onConfirm={async () => {
          try {
            const response = await fetch(
              backend + "/api/categories/" + category.id,
              { method: "DELETE" }
            );
            if (response.ok) {
              const Category = await response.json();
              removeCategory(Category.id);
              alert("Category Deleted: " + Category.name);
            }
          } catch (error) {
            console.error(error);
            alert("Failed to delete Category");
          }
        }}
      />
    </Modal>
  );
}
