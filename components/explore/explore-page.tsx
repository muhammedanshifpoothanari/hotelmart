"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Nav from "../nav/nav";
import Footer from "../footer/footer";
import { getCategoriesFromDatabase } from "@/lib/actions/user/category";
import { useRouter } from "next/navigation";

// Define the structure of your category and subcategory
interface Subcategory {
  name: string;
  imageUrl?: string; // Add other properties as needed
}

interface Category {
  categoryName: string;
  categoryImage: string;
  subcategories?: Subcategory[];
}

// Function to generate random background color
const generateRandomColor = () => {
  const colors = ["bg-red-100", "bg-green-100", "bg-blue-100", "bg-yellow-100", "bg-purple-100", "bg-orange-100"];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function Explore() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<(Category | Subcategory)[]>([]); // Updated to accept both Category and Subcategory
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null); // Use the Category type

  // Fetch categories from the database on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getCategoriesFromDatabase();
      if (result && result.success) {
        setCategories(result.data); // Assuming result.data is of type Category[]
        setFilteredCategories(result.data); // Set initially to all categories
      }
    };
    fetchCategories();
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    let filtered: (Category | Subcategory)[] = []; // Use union type for filtered
    if (!selectedCategory) {
      // Filter main categories based on the search term
      filtered = categories.filter((category) =>
        category.categoryName.toLowerCase().includes(value)
      );
    } else {
      // Filter subcategories based on the search term
      filtered = selectedCategory.subcategories?.filter((subcategory) =>
        subcategory.name.toLowerCase().includes(value)
      ) || []; // Ensure we default to an empty array
    }

    setFilteredCategories(filtered);
  };

  // Handle category click to display subcategories
  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setFilteredCategories(category.subcategories || []); // Show subcategories when a category is selected
    setSearchTerm(""); // Reset search term for subcategory view
  };

  return (
    <div className="flex flex-col h-screen">
      <Nav />
      <header className="p-4 bg-white">
        <h1 className="text-xl font-semibold mb-4">Explore</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange} // Update search term
            placeholder="Search Store"
            className="pl-10 pr-4 py-2 w-full rounded-full bg-gray-100"
          />
        </div>
      </header>

      <main className="flex-grow overflow-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {!selectedCategory ? (
            filteredCategories.length > 0 ? (
              filteredCategories.map((category, index) => (
                "categoryImage" in category && ( // Check if it's a category
                  <div
                    key={index}
                    onClick={() => handleCategoryClick(category as Category)}
                    className={`${generateRandomColor()} p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer`}
                  >
                    <img
                      src={`https://res.cloudinary.com/diwhddwig/image/upload/f_auto,q_auto/${category.categoryImage}` || "/placeholder.svg?height=80&width=80"}
                      alt={category?.categoryName}
                      className="w-20 h-20 object-cover mb-2"
                    />
                    <p className="text-center text-sm font-medium">{category?.categoryName}</p>
                  </div>
                )
              ))
            ) : (
              <p className="text-center text-gray-500">No categories found</p>
            )
          ) : (
            filteredCategories.length > 0 ? (
              filteredCategories.map((subcategory, index) => (
                "imageUrl" in subcategory && ( // Check if it's a subcategory
                  <div
                    key={index}
                    className={`${generateRandomColor()} p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer`}
                    onClick={() => router.push(`/explore/productList?subcategory=${subcategory.name}`)}
                  >
                    <img
                      src={`https://res.cloudinary.com/diwhddwig/image/upload/f_auto,q_auto/${subcategory?.imageUrl}` || "/placeholder.svg?height=80&width=80"}
                      alt={subcategory?.name}
                      className="w-20 h-20 object-cover mb-2"
                    />
                    <p className="text-center text-sm font-medium">{subcategory.name}</p>
                  </div>
                )
              ))
            ) : (
              <p className="text-center text-gray-500">No subcategories found</p>
            )
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
