import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import InputText from "../../../components/Input/InputText";
import TextAreaInput from "../../../components/Input/TextAreaInput";
import TitleCard from "../../../components/Cards/TitleCard";
import { showNotification } from "../../common/headerSlice";
import BarcodeScannerComponent from "react-qr-barcode-scanner"; // Impor Barcode Scanner

function CreateProduct() {
  const [form, setForm] = useState({
    name: "",
    barcode: "",
    barcodeSymbology: "",
    category: "",
    brand: "",
    description: "",
    price: "",
    cost: "",
    stockAlert: "",
    unit: "",
    order_tax: "",
    stock: "",
    image: null,
    categoryOptions: [],
    brandOptions: [],
    unitOptions: [],
  });

  const [scanning, setScanning] = useState(false); // Status untuk scanner

  const updateFormValue = ({ updateType, value }) => {
    if (updateType === "order_tax" && (isNaN(value) || value < 0)) {
      alert("Order Tax must be a positive number.");
      return;
    }
    setForm({ ...form, [updateType]: value });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    // Validasi tipe file
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only .jpg, .jpeg, or .png files are allowed!");
      return;
    }

    setForm({ ...form, image: file });
  };

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [units, setUnits] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    const fetchBrands = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/brands");
        const data = await response.json();
        setBrands(data);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      }
    };

    const fetchUnits = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/units");
        const data = await response.json();
        setUnits(data);
      } catch (error) {
        console.error("Failed to fetch units:", error);
      }
    };

    fetchCategories();
    fetchBrands();
    fetchUnits();
  }, []);

  const handleBarcodeScan = (data) => {
    if (data) {
      updateFormValue({ updateType: "barcode", value: data.text });
      setScanning(false);
    }
  };

  const dispatch = useDispatch();
  const resetForm = () => {
    setForm({
      name: "",
      barcode: "",
      barcodeSymbology: "",
      category: "",
      brand: "",
      description: "",
      price: "",
      cost: "",
      stockAlert: "",
      unit: "",
      order_tax: "",
      stock: "",
      image: null,
    });
  };

  const createProduct = async () => {
    if (!form.category || isNaN(Number(form.category))) {
      alert("Please select a valid category.");
      return;
    }
    if (!form.brand || isNaN(Number(form.brand))) {
      alert("Please select a valid brand.");
      return;
    }

    const formData = new FormData();
    formData.append("product_name", form.name);
    formData.append("product_description", form.description);
    formData.append("unit_price", form.price);
    formData.append("category_id", Number(form.category));
    formData.append("brand_id", Number(form.brand));
    formData.append("barcode", form.barcode);
    formData.append("barcodeSymbology", form.barcodeSymbology);
    formData.append("cost", form.cost);
    formData.append("order_tax", form.order_tax);
    formData.append("stockAlert", form.stockAlert);
    formData.append("stock", form.stock);
    formData.append("unit_id", form.unit);
    if (form.image) {
      formData.append("product_image", form.image);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/products",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 201) {
        dispatch(
          showNotification({
            message: "Product Created Successfully",
            status: 1, // Status sukses
          })
        );
        resetForm(); // Reset form setelah sukses
      } else {
        dispatch(
          showNotification({
            message: "Product creation failed",
            status: 0, // Status gagal
          })
        );
      }
    } catch (error) {
      console.error("Failed to create product:", error.response?.data || error);
      dispatch(
        showNotification({
          message: "An error occurred while creating the product",
          status: 0, // Status gagal
        })
      );
    }
  };

  const toggleScanner = () => {
    setScanning(!scanning);
  };

  return (
    <>
      <TitleCard title="Create Product" topMargin="mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <InputText
            labelTitle="Name"
            updateType="name"
            defaultValue=""
            value={form.name}
            updateFormValue={updateFormValue}
          />

          {/* Product Image */}
          <div className="flex flex-col">
            <label htmlFor="productImage" className="label">
              Product Image
            </label>
            <input
              type="file"
              id="productImage"
              onChange={handleImageUpload}
              className="input input-bordered"
            />
            <span>{form.image ? form.image.name : " "}</span>
          </div>

          {/* Barcode Symbology */}
          <InputText
            labelTitle="Barcode Symbology"
            updateType="barcodeSymbology"
            value={form.barcodeSymbology}
            updateFormValue={updateFormValue}
          />

          {/* Barcode Input and Scanner */}
          <div className="flex flex-col">
            <label htmlFor="barcode" className="label">
              Barcode
            </label>
            <div className="flex items-center gap-x-2">
              <input
                type="text"
                id="barcode"
                placeholder="Scan or Enter Barcode"
                value={form.barcode}
                onChange={(e) =>
                  updateFormValue({
                    updateType: "barcode",
                    value: e.target.value,
                  })
                }
                className="input input-bordered w-full h-12"
              />
              <button
                type="button"
                onClick={toggleScanner}
                className="btn btn-primary h-12 px-4"
              >
                Scan
              </button>
            </div>
          </div>

          {/* Scanner Camera */}
          {scanning && (
            <div className="mt-4">
              <BarcodeScannerComponent
                onUpdate={(err, result) => {
                  if (result) handleBarcodeScan(result);
                }}
                width={300}
                height={300}
              />
              <button
                type="button"
                onClick={toggleScanner}
                className="btn btn-secondary mt-2"
              >
                Close Scanner
              </button>
            </div>
          )}

          {/* Category Dropdown */}
          <InputText
            labelTitle="Category"
            updateType="category"
            isDropdown={true}
            options={[
              { label: "Choose Category", value: "" },
              ...categories.map((category) => ({
                label: category.category_name,
                value: category.id,
              })),
            ]}
            updateFormValue={updateFormValue}
          />

          {/* Brand Dropdown */}
          <InputText
            labelTitle="Brand"
            updateType="brand"
            updateFormValue={updateFormValue}
            isDropdown={true}
            options={[
              { label: "Choose Brand", value: "" },
              ...brands.map((brand) => ({
                label: brand.brand_name,
                value: brand.id,
              })),
            ]}
          />

          <div className="flex flex-col space-y-4">
            <div className="relative flex-grow">
              <InputText
                labelTitle="Order Tax"
                updateType="order_tax"
                value={form.order_tax}
                updateFormValue={updateFormValue}
              />
              <span className="absolute right-3 top-2/3 transform -translate-y-1/2 text-xl">
                %
              </span>
            </div>

            {/* Description */}
            <TextAreaInput
              labelTitle="Description"
              updateType="description"
              value={form.description}
              updateFormValue={updateFormValue}
            />
          </div>
        </div>
        {/* Line Separator */}
        <div className="border-t border-gray-300 my-4"></div>

        {/* Product Price, Cost, Stock Alert, Product Unit */}
        <div className="space-y-4">
          {/* Product Price dan Product Cost sejajar kiri-kanan */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <InputText
                labelTitle="Product Price"
                updateType="price"
                value={form.price}
                updateFormValue={updateFormValue}
              />
            </div>
            <div className="flex-1">
              <InputText
                labelTitle="Product Cost"
                updateType="cost"
                value={form.cost}
                updateFormValue={updateFormValue}
              />
            </div>
          </div>

          {/* Stock Alert dan Product Unit di bawahnya */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <InputText
                labelTitle="Stock Alert"
                updateType="stockAlert"
                value={form.stockAlert}
                updateFormValue={updateFormValue}
              />
            </div>
            <div className="flex-1">
              <InputText
                labelTitle="Product Unit"
                updateType="unit"
                isDropdown={true}
                options={[
                  { label: "Choose Units", value: "" },
                  ...units.map((unit) => ({
                    label: unit.name,
                    value: unit.id,
                  })),
                ]}
                updateFormValue={updateFormValue}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-16">
          <button
            className="btn btn-primary float-right"
            onClick={createProduct}
          >
            Submit
          </button>
        </div>
      </TitleCard>
    </>
  );
}

export default CreateProduct;
