import React, { useState, useEffect } from "react";
import TitleCard from "../../../components/Cards/TitleCard";
import Modal from "../../../components/Modal";
import axios from "axios";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

function CategoryPage() {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState({
    id: "",
    category_name: "",
    category_code: "",
  });

  const handleCheckboxChange = (id) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(id)) {
        // Jika ID sudah ada dalam daftar, hapus ID tersebut
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        // Jika ID belum ada dalam daftar, tambahkan ID tersebut
        return [...prevSelected, id];
      }
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const openModal = (type, category = null) => {
    setModalType(type);
    if (category) {
      setCurrentCategory(category); // Only set category if it's provided
    } else {
      setCurrentCategory({ id: "", category_name: "" }); // Ensure default empty category
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCategory({ id: "", category_name: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory((prev) => ({ ...prev, [name]: value }));
  };

  const saveCategory = async () => {
    if (
      !currentCategory.category_code.trim() ||
      !currentCategory.category_name.trim()
    ) {
      alert("Both Category Code and Name are required.");
      return;
    }

    try {
      if (modalType === "create") {
        const response = await axios.post(
          "http://localhost:5000/api/categories",
          currentCategory
        );
        setCategories((prev) => [...prev, response.data]);
      } else if (modalType === "edit" && currentCategory.id) {
        const response = await axios.put(
          `http://localhost:5000/api/categories/${currentCategory.id}`,
          currentCategory
        );
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === currentCategory.id ? response.data : cat
          )
        );
      }
      closeModal();
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const filteredCategories = categories.filter(
    (cat) =>
      (cat.id &&
        cat.id.toString().toLowerCase().includes(searchText.toLowerCase())) || // Mengubah cat.id menjadi string terlebih dahulu
      cat.category_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCategories.length / rowsPerPage);

  const changePage = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
  };

  return (
    <TitleCard title="Category" topMargin="mt-4">
      <div className="flex justify-between mb-4 items-center">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by Code or Name"
          className="input input-bordered w-full sm:w-1/2"
        />
        <button
          className="btn btn-primary flex items-center ml-4"
          onClick={() => openModal("create")}
        >
          <PlusIcon className="w-5 h-5 mr-1" /> Create
        </button>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">
                <input
                  type="checkbox"
                  className="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategories(
                        currentItems.map((item) => item.id)
                      );
                    } else {
                      setSelectedCategories([]); // Deselect all
                    }
                  }}
                  checked={
                    selectedCategories.length === currentItems.length &&
                    currentItems.length > 0
                  }
                />
              </th>
              <th className="px-4 py-2">Category Code</th>
              <th className="px-4 py-2">Category Name</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-100">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(item.id)}
                    onChange={() => handleCheckboxChange(item.id)}
                    className="checkbox"
                  />
                </td>
                <td className="px-4 py-2 text-sm text-center text-gray-700 dark:text-gray-300">
                  {item.category_code}
                </td>
                <td className="px-4 py-2 text-sm text-center text-gray-700 dark:text-gray-300">
                  {item.category_name}
                </td>
                <td className="px-4 py-2 flex justify-center items-center space-x-2 h-auto leading-none">
                  <button
                    onClick={() => openModal("edit", item)}
                    className="btn btn-sm btn-warning flex items-center h-8"
                  >
                    <PencilSquareIcon className="w-5 h-5 mr-1" />
                  </button>
                  <button
                    className="btn btn-sm btn-error flex items-center h-8"
                    onClick={() => deleteCategory(item.id)}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Section */}
      <div className="mt-4 flex justify-between items-center">
        {/* Rows Per Page Selection */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Rows Per Page:
          </label>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="select select-bordered"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => changePage(currentPage - 1)}
            className="btn btn-neutral btn-sm"
            disabled={currentPage === 1}
          >
            {"<"}
          </button>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {(currentPage - 1) * rowsPerPage + 1} -{" "}
            {currentPage * rowsPerPage > filteredCategories.length
              ? filteredCategories.length
              : currentPage * rowsPerPage}{" "}
            of {filteredCategories.length}
          </p>

          <button
            onClick={() => changePage(currentPage + 1)}
            className="btn btn-neutral btn-sm"
            disabled={currentPage === totalPages}
          >
            {">"}
          </button>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          title={modalType === "create" ? "Add New Category" : "Edit Category"}
          onClose={closeModal}
          onSave={saveCategory}
          newCategory={currentCategory} // Send currentCategory to Modal
          handleInputChange={handleInputChange} // Pass handleInputChange to Modal
          isEditMode={modalType === "edit"} // Pass isEditMode flag
        />
      )}
    </TitleCard>
  );
}

export default CategoryPage;
