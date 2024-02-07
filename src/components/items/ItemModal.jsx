import { useState } from "react";
import Modal from "../modal";
import { useCategories } from "../../context/categoriesContext";
import ConfirmationModal from "../ConfirmationModal";

const backend = process.env.REACT_APP_BACKEND;

export default function ItemModal({ item, isOpen, onClose }) {
  const { removeItem, updateItem, categories } = useCategories();
  const maxOrder = categories.filter(
    (category) => category.id === Number(item.categoryId)
  )[0].items.length;

  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState(false);
  const [inputs, setInputs] = useState({
    name: item.name,
    price: item.price,
    order: item.order,
    description: item.description,
  });

  const [errors, setErrors] = useState({});

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
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
    if (!inputs.price) {
      setErrors((prevErrs) => ({
        ...prevErrs,
        price: "Price is required",
      }));
      validForm = false;
    }
    if (!inputs.order) {
      setErrors((prevErrs) => ({
        ...prevErrs,
        order: "Order is required",
      }));
      validForm = false;
    }
    if (inputs.order < 1 || inputs.order > maxOrder) {
       setErrors((prevErrs) => ({
         ...prevErrs,
         order: "Order should be between 1 and " + maxOrder,
       }));
       validForm = false;
    }

    if (!validForm) {
      return;
    }

    try {
      // Send the form data to the server
      const response = await fetch(backend + "/api/items/" + item.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...inputs,
          order: Number(inputs.order),
        }),
      });

      if (response.ok) {
        const item = await response.json();
        updateItem(item);
        alert("Updated item " + item.name);
        onClose();
      } else {
        alert("Failed to update item");
        console.error("Server error:", response.status, response.statusText);
      }
    } catch (error) {
      alert("Failed to update item");
      console.error("Network error:", error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {item.type === "separator" ? (
          ""
        ) : (
          <>
            <div className="relative max-w-[200px]">
              <input
                className="border-primary max-w-[200px]"
                type="text"
                name="name"
                value={inputs.name}
                placeholder="Item Name"
                onChange={handleFormChange}
              />
              <span className="bg-white absolute left-2 text-xs -top-2">
                Item Name
              </span>
            </div>

            {errors.name ? (
              <div className="text-sm text-red-500 -mt-1">{errors.name}</div>
            ) : (
              ""
            )}
            <div className="relative max-w-[200px]">
              <input
                className="border-primary max-w-[200px]"
                type="text"
                name="price"
                value={inputs.price}
                placeholder="Item Price"
                onChange={handleFormChange}
              />
              <span className="bg-white absolute left-2 text-xs -top-2">
                Item Price
              </span>
            </div>

            {errors.price ? (
              <div className="text-sm text-red-500 -mt-1">{errors.price}</div>
            ) : (
              ""
            )}
            <div className="relative max-w-[200px]">
              <input
                className="border-primary max-w-[200px]"
                name="description"
                value={inputs.description}
                placeholder="Item Description"
                onChange={handleFormChange}
              />
              <span className="bg-white absolute left-2 text-xs -top-2">
                Item Description
              </span>
              {errors.description ? (
                <div className="text-sm text-red-500 -mt-1">
                  {errors.description}
                </div>
              ) : (
                ""
              )}
            </div>
          </>
        )}
        <div className="relative max-w-[200px] min-w-[150px]">
          <input
            className="border-primary w-full"
            type="number"
            name="order"
            value={inputs.order}
            placeholder="Item Order"
            onChange={handleFormChange}
            min={1}
            max={maxOrder}
          />
          <span className="bg-white absolute left-2 text-xs -top-2">
            Item Order
          </span>
        </div>
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
          className="bg-red-600 text-white rounded-xl py-2"
          onClick={() => {
            setDeleteConfirmationModalOpen(true);
          }}
        >
          Delete
        </button>
      </div>
      <ConfirmationModal
        isOpen={deleteConfirmationModalOpen}
        message={"Are you sure you want to delete " + item.name}
        onClose={() => setDeleteConfirmationModalOpen(false)}
        onConfirm={async () => {
          try {
            const response = await fetch(backend + "/api/items/" + item.id, {
              method: "DELETE",
            });
            if (response.ok) {
              const Item = await response.json();
              removeItem(Item.id, item.categoryId);
              alert("Item Deleted: " + Item.name);
            }
          } catch (error) {
            console.error(error);
            alert("Failed to delete Item");
          }
        }}
      />
    </Modal>
  );
}
