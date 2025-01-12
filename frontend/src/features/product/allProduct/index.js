import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FunnelIcon,
  DocumentArrowDownIcon,
  DocumentTextIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import TitleCard from "../../../components/Cards/TitleCard";
import FilterAllP from "../../filter";
import TableComponent from "../../../components/Table/TableComponent";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import axios from "axios";

function AllProducts() {
  const [searchText, setSearchText] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const totalItems = 100;
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data dari backend
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        // Format data agar sesuai dengan tabel
        const formattedData = response.data.map((product) => ({
          id: product.id,
          image: `http://localhost:5000/uploads/product/${product.product_image}`, // Path gambar
          name: product.product_name,
          code: product.barcode,
          brand: product.brand_name, // Gunakan nama brand
          category: product.category_name, // Gunakan nama category
          cost: product.cost,
          price: product.unit_price,
          quantity: `${product.stockAlert} ${product.short_name}`,
        }));
        setData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProduct = data.filter(
    (product) =>
      product.name.toLowerCase().includes(searchText.toLowerCase()) ||
      product.code.toLowerCase().includes(searchText.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchText.toLowerCase()) || // Filter berdasarkan nama brand
      product.category.toLowerCase().includes(searchText.toLowerCase()) // Filter berdasarkan nama category
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(data.map((item) => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleViewDetails = (id) => {
    navigate(`/app/product-allProduct/detailProduct/${id}`);
  };

  const handleEditProduct = (id) => {
    navigate(`/app/product-allProduct/editProduct/${id}`);
  };

  const cancelDelete = () => {
    setIsDeletePopupVisible(false);
    setProductToDelete(null);
  };

  const handleDeleteProduct = async (item) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${item.id}`);
      setData(data.filter((product) => product.id !== item.id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);
  };

  const columns = [
    {
      label: (
        <input
          type="checkbox"
          className="checkbox"
          onChange={handleSelectAll}
        />
      ),
      render: (item) => (
        <input
          type="checkbox"
          className="checkbox"
          checked={selectedRows.includes(item.id)}
          onChange={() => handleCheckboxChange(item.id)}
        />
      ),
      className: "text-center",
    },
    {
      label: "Image",
      render: (item) => (
        <img src={item.image} alt={item.name} className="w-10 h-10 rounded" />
      ),
      className: "text-center",
    },
    { label: "Name", accessor: "name" },
    { label: "Code", accessor: "code" },
    { label: "Brand", accessor: "brand" }, // Menampilkan nama brand
    { label: "Category", accessor: "category" }, // Menampilkan nama category
    {
      label: "Cost",
      accessor: "cost",
      className: "text-right",
      render: (item) => formatCurrency(item.cost),
    },
    {
      label: "Price",
      accessor: "price",
      className: "text-right",
      render: (item) => formatCurrency(item.price),
    },
    { label: "Stock Alert", accessor: "quantity", className: "text-right" },
    {
      label: "Actions",
      render: (item) => (
        <div className="flex space-x-2 justify-center">
          <button
            onClick={() => handleViewDetails(item.id)}
            className="btn btn-sm btn-info"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleEditProduct(item.id)}
            className="btn btn-sm btn-warning"
          >
            <PencilSquareIcon className="w-5 h-5" />
          </button>
          <button
            className="btn btn-sm btn-error"
            onClick={() => handleDeleteProduct(item)}
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      ),
      className: "text-center",
    },
  ];

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  const handleCreateProduct = () => {
    navigate("/app/product-createProduct");
  };

    const handleExportExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(filteredProduct.map((item) => ({
        ...item,
        cost: formatCurrency(item.cost),
        price: formatCurrency(item.price),
      }))
    );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
      XLSX.writeFile(workbook, "All Products.xlsx");
    };

  const handleExportPDF = () => {
      const doc = new jsPDF();
      doc.text("List Product", 14, 10);
      const tableColumn = ["Name", "Code", "Brand", "Category", "Cost", "Price", "Stock Allert"];
      const tableRows = data.map((item) => [
        item.name || "N/A",
        item.code || "N/A",
        item.brand || "N/A",
        item.category || "N/A",
        formatCurrency(item.cost || "N/A"),
        formatCurrency(item.price || "N/A"),
        item.quantity || "N/A",
      ]);
      doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
      doc.save("All Product.pdf");
    };

  return (
    <TitleCard title="All Products" topMargin="mt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
        <div className="relative">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by Name or Code"
            className="input input-bordered w-full"
          />
        </div>

        <div className="absolute right-6 flex space-x-2">
          {/*<button
            className="btn btn-outline btn-primary flex items-center text-sm h-10"
            onClick={() => setIsFilterVisible(true)}
          >
            <FunnelIcon className="w-5 h-5 mr-1" />
            Filter
          </button>*/}
          <button
            className="btn btn-outline btn-success flex items-center"
            onClick={handleExportExcel}
          >
            <DocumentArrowDownIcon className="w-5 h-5 mr-1" />
            Export Excel
          </button>
          <button
            className="btn btn-outline btn-error flex items-center"
            onClick={handleExportPDF}
          >
            <DocumentTextIcon className="w-5 h-5 mr-1" />
            Export PDF
          </button>

          <button
            className="btn btn-primary flex items-center"
            onClick={handleCreateProduct}
          >
            <PlusIcon className="w-5 h-5 mr-1" />
            Create
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mt-6">
        <TableComponent
          columns={columns}
          data={filteredProduct}
          selectedRows={selectedRows}
          onRowSelect={handleCheckboxChange}
          onSelectAll={handleSelectAll}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
        />
      </div>

      {isFilterVisible && <FilterAllP isVisible={isFilterVisible} />}
      {isDeletePopupVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Delete Confirmation
            </h3>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Are you sure you want to delete{" "}
              <strong className="text-black dark:text-white">
                {productToDelete?.name}
              </strong>
              ?
            </p>
            <div className="flex justify-end mt-6 space-x-2">
              <button
                className="btn btn-outline btn-secondary dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="btn btn-outline btn-error dark:text-red-400 dark:border-red-600 dark:hover:bg-red-700"
                onClick={handleDeleteProduct}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </TitleCard>
  );
}

export default AllProducts;
