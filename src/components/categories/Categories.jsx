import { useState } from "react";
import { useAuth } from "../../context/authContext";
import Items from "../items/Items";
import CategoryModal from "./CategoryModal";

export default function Categories({ categories }) {
  if (categories) {
    return (
      <div>
        {categories.map((category) => (
          <Category key={category.id} category={category} />
        ))}
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}

function Category({ category }) {
  const { authenticated } = useAuth();
  const [modalOpen, setIsModalOpen] = useState(false);

  if (authenticated && window.location.pathname === "/dashboard") {
    return (
      <div className="flex flex-col p-4 min-w-[200px] max-w-[400px] mx-auto">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-fit mb-2 ml-4 hover:cursor-pointer flex items-end gap-4"
        >
          <h2 className="text-2xl uppercase category-title">{category.name}</h2>
          {category.icon ? (
            <img className="w-[50px]" src={category.icon} alt="" />
          ) : (
            ""
          )}
        </button>
        <CategoryModal
          category={category}
          isOpen={modalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        <Items items={category.items} />
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 min-w-[200px] max-w-[400px] mx-auto">
      <div className="mb-2 ml-6 w-fit flex items-end gap-4">
        <h2 className="text-2xl uppercase category-title">{category.name}</h2>
        <img className="w-[50px]" src={category.icon} alt="" />
      </div>
      <Items items={category.items} type={category.type} />
    </div>
  );
}