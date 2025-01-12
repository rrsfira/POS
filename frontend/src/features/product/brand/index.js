import React, { useState, useEffect } from "react";
import TitleCard from "../../../components/Cards/TitleCard";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

const BrandPage = () => {
  const [brands, setBrands] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newBrand, setNewBrand] = useState({
    brand_code: "",
    brand_name: "",
    brand_description: "",
    brand_image: null,
  });
  const [editBrand, setEditBrand] = useState(null);
  const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewBrand, setViewBrand] = useState(null);

  const apiUrl = "http://localhost:5000/api/brands";

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const handleAddBrand = async () => {
    if (!newBrand.brand_code || !newBrand.brand_name) {
      alert("Kode dan nama merek diperlukan!");
      return;
    }

    const formData = new FormData();
    formData.append("brand_code", newBrand.brand_code);
    formData.append("brand_name", newBrand.brand_name);
    formData.append("brand_description", newBrand.brand_description);
    if (newBrand.brand_image) {
      formData.append("brand_image", newBrand.brand_image);
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setBrands((prev) => [...prev, data]);
      setIsModalOpen(false);
      setNewBrand({
        brand_code: "",
        brand_name: "",
        brand_description: "",
        brand_image: null,
      });
    } catch (error) {
      console.error("Error adding brand:", error);
    }
  };

  const handleEditSave = async () => {
    if (!editBrand.brand_code || !editBrand.brand_name) {
      alert("Kode dan nama merek diperlukan!");
      return;
    }

    const formData = new FormData();
    formData.append("brand_code", editBrand.brand_code);
    formData.append("brand_name", editBrand.brand_name);
    formData.append("brand_description", editBrand.brand_description);
    if (editBrand.brand_image) {
      formData.append("brand_image", editBrand.brand_image);
    }

    try {
      const response = await fetch(`${apiUrl}/${editBrand.id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await response.json();
      setBrands((prev) =>
        prev.map((brand) => (brand.id === data.id ? data : brand))
      );
      setIsEditModalOpen(false);
      setEditBrand(null);
    } catch (error) {
      console.error("Error updating brand:", error);
    }
  };

  const handleDeleteBrand = async () => {
    try {
      await fetch(`${apiUrl}/${brandToDelete.id}`, {
        method: "DELETE",
      });
      setBrands((prev) =>
        prev.filter((brand) => brand.id !== brandToDelete.id)
      );
      setIsDeletePopupVisible(false);
      setBrandToDelete(null);
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  };

  const filteredBrands = brands.filter(
    (brand) =>
      brand.brand_name.toLowerCase().includes(searchText.toLowerCase()) ||
      brand.brand_description.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleFileChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (isEdit) {
      setEditBrand((prev) => ({ ...prev, brand_image: file }));
    } else {
      setNewBrand((prev) => ({ ...prev, brand_image: file }));
    }
  };

  const [selectedBrands, setSelectedBrands] = useState([]);
  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedBrands(filteredBrands.map((brand) => brand.id));
    } else {
      setSelectedBrands([]);
    }
  };

  const handleSelectBrand = (brandId) => {
    setSelectedBrands((prevSelected) =>
      prevSelected.includes(brandId)
        ? prevSelected.filter((id) => id !== brandId)
        : [...prevSelected, brandId]
    );
  };

  return (
    <TitleCard title="Brand" topMargin="mt-4">
      <div className="flex justify-between mb-4 items-center">
        <div className="w-full sm:w-1/2">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by Name or Description"
            className="input input-bordered w-full"
          />
        </div>
        <div className="ml-4">
          <button
            className="btn btn-primary flex items-center"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            <PlusIcon className="w-5 h-5 mr-1" />
            Create
          </button>
        </div>
      </div>

      {/* Tabel Brand */}
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
                    filteredBrands.length > 0 &&
                    selectedBrands.length === filteredBrands.length
                  }
                />
              </th>
              <th className="px-4 py-2 text-left">Brand Code</th>
              <th className="px-4 py-2 text-left">Brand Name</th>
              <th className="px-4 py-2 text-left">Brand Description</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.map((brand) => (
              <tr
                key={brand.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedBrands.includes(brand.id)}
                    onChange={() => handleSelectBrand(brand.id)}
                  />
                </td>
                <td className="px-4 py-2">{brand.brand_code}</td>
                <td className="px-4 py-2">{brand.brand_name}</td>
                <td className="px-4 py-2">{brand.brand_description}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    onClick={() => {
                      setViewBrand(brand);
                      setIsViewModalOpen(true);
                    }}
                    className="btn btn-sm btn-info flex items-center"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setEditBrand(brand);
                      setIsEditModalOpen(true);
                    }}
                    className="btn btn-sm btn-warning flex items-center"
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => {
                      setBrandToDelete(brand);
                      setIsDeletePopupVisible(true);
                    }}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add Brand</h3>
            <input
              type="text"
              placeholder="Brand Code"
              className="input input-bordered w-full my-2"
              value={newBrand.brand_code}
              onChange={(e) =>
                setNewBrand((prev) => ({ ...prev, brand_code: e.target.value }))
              }
            />
            <input
              type="text"
              placeholder="Brand Name"
              className="input input-bordered w-full my-2"
              value={newBrand.brand_name}
              onChange={(e) =>
                setNewBrand((prev) => ({ ...prev, brand_name: e.target.value }))
              }
            />
            <textarea
              placeholder="Description"
              className="textarea textarea-bordered w-full my-2"
              value={newBrand.brand_description}
              onChange={(e) =>
                setNewBrand((prev) => ({
                  ...prev,
                  brand_description: e.target.value,
                }))
              }
            />
            <input
              type="file"
              className="file-input file-input-bordered w-full my-2"
              onChange={(e) => handleFileChange(e)}
            />
            <div className="modal-action">
              <button className="btn btn-primary" onClick={handleAddBrand}>
                Save
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && editBrand && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Edit Brand</h3>
            <input
              type="text"
              className="input input-bordered w-full my-2"
              value={editBrand.brand_code}
              onChange={(e) =>
                setEditBrand((prev) => ({
                  ...prev,
                  brand_code: e.target.value,
                }))
              }
            />
            <input
              type="text"
              className="input input-bordered w-full my-2"
              value={editBrand.brand_name}
              onChange={(e) =>
                setEditBrand((prev) => ({
                  ...prev,
                  brand_name: e.target.value,
                }))
              }
            />
            <textarea
              className="textarea textarea-bordered w-full my-2"
              value={editBrand.brand_description}
              onChange={(e) =>
                setEditBrand((prev) => ({
                  ...prev,
                  brand_description: e.target.value,
                }))
              }
            />
            <input
              type="file"
              className="file-input file-input-bordered w-full my-2"
              onChange={(e) => handleFileChange(e, true)}
            />
            <div className="modal-action">
              <button className="btn btn-primary" onClick={handleEditSave}>
                Save Changes
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isViewModalOpen && viewBrand && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Brand Details</h3>
            <div className="flex flex-col items-center">
              {viewBrand.brand_image && (
                <img
                src={`http://localhost:5000/uploads/brand/${viewBrand.brand_image}`}
                alt={viewBrand.brand_name}
                className="w-32 h-32 object-cover mb-4"
                onError={(e) => e.target.src = '/path/to/fallback-image.jpg'} // Gambar fallback jika gagal
              />              
              )}
              <p>
                <strong>Brand Code:</strong> {viewBrand.brand_code}
              </p>
              <p>
                <strong>Brand Name:</strong> {viewBrand.brand_name}
              </p>
            </div>
            <div className="modal-action">
              <button
                className="btn btn-secondary"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeletePopupVisible && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Delete Confirmation</h3>
            <p>
              Are you sure you want to delete brand{" "}
              <strong>{brandToDelete.brand_name}</strong>?
            </p>
            <div className="modal-action">
              <button className="btn btn-error" onClick={handleDeleteBrand}>
                Yes, Delete
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setIsDeletePopupVisible(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </TitleCard>
  );
};

export default BrandPage;
