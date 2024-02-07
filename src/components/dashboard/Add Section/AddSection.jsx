import { useCategories } from "../../../context/categoriesContext";
import AddCategorySection from "./AddCategorySection";
import AddItemSection from "./AddItemSection";

export default function AddSection() {
  const { categories } = useCategories();
  return (
    <div className="flex flex-col items-center py-8 gap-8">
      <AddCategorySection />
      {categories.length > 0 ? <AddItemSection /> : ""}
    </div>
  );
}
