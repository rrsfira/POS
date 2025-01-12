import React from "react";

const Modal = ({
  onClose,
  onSave,
  newCategory,
  handleInputChange,
  isEditMode,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded shadow-lg">
      <h3 className="text-lg font-semibold mb-4">
        {isEditMode ? "Edit Category" : "Add New Category"}
      </h3>
      <input
        type="text"
        name="category_code"
        value={newCategory.category_code || ""}
        onChange={handleInputChange}
        placeholder="Category Code"
        className="input input-bordered w-full mb-4 bg-gray-100 dark:bg-gray-700 dark:text-white"
      />
      <input
        type="text"
        name="category_name"
        value={newCategory.category_name || ""}
        onChange={handleInputChange}
        placeholder="Category Name"
        className="input input-bordered w-full mb-4 bg-gray-100 dark:bg-gray-700 dark:text-white"
      />
      <div className="flex justify-end space-x-4">
        <button onClick={onSave} className="btn btn-primary">
          Save
        </button>
        <button onClick={onClose} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default Modal;
