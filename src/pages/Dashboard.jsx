import { Link } from "react-router-dom";
import Categories from "../components/categories/Categories";
import { useCategories } from "../context/categoriesContext";
import { useState } from "react";
import AddSection from "../components/dashboard/Add Section/AddSection";

export default function Dashboard() {
  const { categories } = useCategories();
  const [addSectionOpen, setAddSectionOpen] = useState(false);

  return (
    <main className="text-white bg-primary pb-8">
      <div className="text-center pt-4">
        <h3 className="mx-auto text-3xl">Dashboard</h3>
        <Link to="/" className="text-secondary">
          Go Back
        </Link>
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => setAddSectionOpen(false)}
          className="bg-secondary text-primary px-4 py-2 rounded-xl"
        >
          Edit
        </button>
        <button
          onClick={() => setAddSectionOpen(true)}
          className="bg-secondary text-primary px-4 py-2 rounded-xl"
        >
          Add
        </button>
      </div>
      {addSectionOpen ? <AddSection /> : <Categories categories={categories} />}
    </main>
  );
}
