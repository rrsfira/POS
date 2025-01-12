import React, { useState, useEffect } from "react";
import TitleCard from "../../../components/Cards/TitleCard"; // Menggunakan TitleCard yang sama
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const UnitPage = () => {
  const [units, setUnits] = useState([]);
  const [searchText, setSearchText] = useState(""); // Untuk pencarian
  const [selectedUnits, setSelectedUnits] = useState([]); // Untuk checkbox
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isEditMode, setIsEditMode] = useState(false); // Untuk membedakan Create/Edit
  const [editUnit, setEditUnit] = useState(null); // Data unit yang sedang diedit
  const [newUnit, setNewUnit] = useState({
    name: "",
    short_name: "",
    operator: "/",
    value: "",
  });
  const [unitToDelete, setUnitToDelete] = useState(null); // To hold the category being deleted
  const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false); // To control visibility of the delete confirmation popup

  // Ambil data unit dari backend
  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/units");
      const data = await response.json();
      setUnits(data);
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };

  // Menambahkan unit baru
  const handleAddUnit = async () => {
    if (!newUnit.name || !newUnit.short_name || !newUnit.value) {
      alert("Please fill all required fields!");
      return;
    }
  
    console.log("Sending data:", newUnit);
  
    try {
      const response = await fetch("http://localhost:5000/api/units", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUnit),
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Error response from server:", errorDetails);
        throw new Error(`Failed to add unit: ${errorDetails.message || 'Unknown error'}`);
      }
  
      const data = await response.json();
      console.log("Unit successfully added:", data);
      setUnits((prevUnits) => [...prevUnits, data]);
      setIsModalOpen(false);
      setNewUnit({
        name: "",
        short_name: "",
        operator: "/",
        value: "",
      });
    } catch (error) {
      console.error("Error adding unit:", error);
      alert(error.message);
    }
  };  
  
  const handleSaveUnit = async () => {
    if (!editUnit.name || !editUnit.short_name || !editUnit.value) {
      alert("Please fill all required fields!");
      return;
    }
  
    // Cek apakah data sudah benar
    console.log("Sending data:", editUnit);
  
    try {
      const response = await fetch(
        `http://localhost:5000/api/units/${editUnit.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editUnit),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to update unit");
      }
  
      const data = await response.json();
      console.log("Response data:", data);
      setUnits((prevUnits) =>
        prevUnits.map((unit) => (unit.id === data.id ? { ...data } : unit))
      );
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditUnit(null);
    } catch (error) {
      console.error("Error updating unit:", error);
      alert("Failed to update unit");
    }
  };  

  // Menghapus unit
  const handleDeleteUnit = async (unit) => {
    setUnitToDelete(unit);
    setIsDeletePopupVisible(true);
  };

  const confirmDeleteUnit = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/units/${unitToDelete.id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete unit");
      }
      setUnits((prevUnits) =>
        prevUnits.filter((unit) => unit.id !== unitToDelete.id)
      );
      setIsDeletePopupVisible(false);
      setUnitToDelete(null);
    } catch (error) {
      console.error("Error deleting unit:", error);
      alert("Failed to delete unit");
    }
  };

  const cancelDelete = () => {
    setIsDeletePopupVisible(false);
    setUnitToDelete(null);
  };

  const handleEditUnit = (unit) => {
    setIsEditMode(true); // Ensure edit mode is true
    setEditUnit(unit); // Set the unit to edit
    setIsModalOpen(true); // Open the modal
  };

    // Fungsi untuk menangani checkbox
    const handleCheckboxChange = (id) => {
      if (selectedUnits.includes(id)) {
        setSelectedUnits((prev) => prev.filter((unitId) => unitId !== id));
      } else {
        setSelectedUnits((prev) => [...prev, id]);
      }
    };
  
    // Fungsi untuk memilih semua checkbox
    const handleSelectAll = (isChecked) => {
      if (isChecked) {
        setSelectedUnits(units.map((unit) => unit.id));
      } else {
        setSelectedUnits([]);
      }
    };

  return (
    <TitleCard title="Unit" topMargin="mt-4">
      {/* Search Bar dan Create Button */}
      <div className="flex justify-between mb-4 items-center">
        <div className="w-full sm:w-1/2">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by Name or Short Name"
            className="input input-bordered w-full"
          />
        </div>

        {/* Create Button */}
        <div className="ml-4">
          <button
            className="btn btn-primary flex items-center"
            onClick={() => {
              setIsEditMode(false);
              setIsModalOpen(true);
              setNewUnit({
                name: "",
                short_name: "",
                operator: "/",
                value: "",
              });
            }}
          >
            <PlusIcon className="w-5 h-5 mr-1" />
            Create
          </button>
        </div>
      </div>

      {/* Tabel Unit */}
      <div className="mt-6 overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="px-4 py-2 text-left">
                <input
                  type="checkbox"
                  className="checkbox"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  checked={
                    units.length > 0 && selectedUnits.length === units.length
                  }
                />
              </th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Short Name</th>
              <th className="px-4 py-2 text-left">Operator</th>
              <th className="px-4 py-2 text-left">Operation Value</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {units
              .filter(
                (unit) =>
                  (unit.name &&
                    unit.name
                      .toLowerCase()
                      .includes(searchText.toLowerCase())) ||
                  (unit.short_name &&
                    unit.short_name
                      .toLowerCase()
                      .includes(searchText.toLowerCase()))
              )
              .map((unit) => (
                <tr
                  key={unit.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={selectedUnits.includes(unit.id)}
                      onChange={() => handleCheckboxChange(unit.id)}
                    />
                  </td>
                  <td className="px-4 py-2">{unit.name}</td>
                  <td className="px-4 py-2">{unit.short_name}</td>
                  <td className="px-4 py-2">{unit.operator}</td>
                  <td className="px-4 py-2">{unit.value}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => handleEditUnit(unit)}
                      className="btn btn-sm btn-warning flex items-center"
                    >
                      <PencilSquareIcon className="w-5 h-5 mr-1" />
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDeleteUnit(unit)}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 dark:text-gray-200 p-6 rounded-lg shadow-lg w-1/3">
            {/* Header Modal */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editUnit ? "Edit Unit" : "Create Unit"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditUnit(null); // Reset jika modal ditutup
                }}
                className="btn btn-sm btn-ghost text-gray-500"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Form untuk edit */}
            <div>
              <div className="mb-4">
                <label className="block">Unit Name</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={isEditMode ? editUnit.name : newUnit.name}
                  onChange={(e) => {
                    if (isEditMode) {
                      setEditUnit((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }));
                    } else {
                      setNewUnit((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }));
                    }
                  }}
                />
              </div>

              <div className="mb-4">
                <label className="block">Short Name</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={isEditMode ? editUnit.short_name : newUnit.short_name}
                  onChange={(e) => {
                    if (isEditMode) {
                      setEditUnit((prev) => ({
                        ...prev,
                        short_name: e.target.value,
                      }));
                    } else {
                      setNewUnit((prev) => ({
                        ...prev,
                        short_name: e.target.value,
                      }));
                    }
                  }}
                />
              </div>

              <div className="mb-4">
                <label className="block">Operator</label>
                <select
                  className="select select-bordered w-full"
                  value={isEditMode ? editUnit.operator : newUnit.operator}
                  onChange={(e) => {
                    if (isEditMode) {
                      setEditUnit((prev) => ({
                        ...prev,
                        operator: e.target.value,
                      }));
                    } else {
                      setNewUnit((prev) => ({
                        ...prev,
                        operator: e.target.value,
                      }));
                    }
                  }}
                >
                  <option value="/">/</option>
                  <option value="*">*</option>
                  <option value="+">+</option>
                  <option value="-">-</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block">Value</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={isEditMode ? editUnit.value : newUnit.value}
                  onChange={(e) => {
                    if (isEditMode) {
                      setEditUnit((prev) => ({
                        ...prev,
                        value: e.target.value,
                      }));
                    } else {
                      setNewUnit((prev) => ({
                        ...prev,
                        value: e.target.value,
                      }));
                    }
                  }}
                />
              </div>

              {/* Button Save */}
              <div className="flex justify-end">
                <button
                  onClick={isEditMode ? handleSaveUnit : handleAddUnit}
                  className="btn btn-primary"
                >
                  {isEditMode ? "Save" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup Hapus */}
      {isDeletePopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 dark:text-gray-200 p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-bold">Are you sure?</h3>
            <p>Are you sure you want to delete this unit?</p>
            <div className="flex justify-end mt-4">
              <button
                className="btn btn-ghost mr-2"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDeleteUnit}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </TitleCard>
  );
};

export default UnitPage;
