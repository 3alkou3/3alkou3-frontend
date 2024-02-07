import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Categories from "../components/categories/Categories";
import { useCategories } from "../context/categoriesContext";

export default function Home() {
  const { authenticated } = useAuth();
  const { categories } = useCategories();

  return (
    <main className="bg-primary text-white pb-8">
      {authenticated ? (
        <div className="text-center pt-4">
          <h3 className="mx-auto text-3xl">Home</h3>
          <Link to="dashboard" className="text-secondary">
            Go To Dashboard
          </Link>
        </div>
      ) : (
        ""
      )}

      <Categories categories={categories} />
    </main>
  );
}
