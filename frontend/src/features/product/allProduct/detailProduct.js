import { useState, useEffect } from "react";
import TitleCard from "../../../components/Cards/TitleCard"; // Import TitleCard
import { PrinterIcon } from "@heroicons/react/24/outline"; // Import Printer Icon
import axios from "axios";
import { useParams } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams(); // Ambil id dari URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        console.log(response.data);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Failed to load product details");
        setLoading(false);
      }
    };
    fetchProductDetail();
  }, [id]);

  // Fungsi untuk handle print
  const handlePrint = () => {
    window.print(); // Ini akan memicu print dialog pada browser
  };

  // Format angka menjadi IDR (Rupiah)
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);
  };

  // Jika sedang loading
  if (loading) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500">Loading product details...</p>
      </div>
    );
  }

  // Jika ada error
  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      <TitleCard
        title="Product Details"
        description="View and manage product details"
        topMargin="mt-2"
        padding="8"
      >
        {/* Tombol Print */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handlePrint}
            className="btn btn-primary flex items-center space-x-2"
          >
            <PrinterIcon className="h-5 w-5 text-white" />
            <span>Print</span>
          </button>
        </div>

        {/* Kontainer Gambar dan Tabel */}
        <div className="flex flex-wrap items-start space-x-6">
          {/* Gambar Produk */}
          <div className="w-1/3">
            <img
              src={`http://localhost:5000/uploads/product/${product?.product_image}`}
              alt={product?.product_name || "Product Image"}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>

          {/* Tabel Detail Produk */}
          <div className="w-2/3">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2 font-semibold">Name</td>
                  <td className="px-4 py-2">{product?.product_name || "N/A"}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 font-semibold">Category</td>
                  <td className="px-4 py-2">{product?.category_name || "N/A"}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 font-semibold">Brand</td>
                  <td className="px-4 py-2">{product?.brand_name || "N/A"}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 font-semibold">Cost</td>
                  <td className="px-4 py-2">
                    {formatCurrency(product?.cost) || "N/A"}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 font-semibold">Price</td>
                  <td className="px-4 py-2">
                    {formatCurrency(product?.unit_price) || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">Unit</td>
                  <td className="px-4 py-2">{product?.name || "N/A"}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 font-semibold">Stock Alert</td>
                  <td className="px-4 py-2">{product?.stockAlert || "N/A"}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 font-semibold">Warehouse</td>
                  <td className="px-4 py-2">{product?.warehouse || "N/A"}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 font-semibold">Quantity</td>
                  <td className="px-4 py-2">{product?.quantity || "N/A"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Barcode */}
        {product?.barcode && (
          <div className="mt-6 text-center">
            <img
              src={`https://api.barcodes4.me/barcode/c128b/${product?.barcode}.png`}
              alt="Barcode"
              className="mx-auto"
            />
          </div>
        )}
      </TitleCard>
    </>
  );
}

export default ProductDetail;
