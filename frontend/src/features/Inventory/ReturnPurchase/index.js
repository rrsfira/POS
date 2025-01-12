import { useState } from "react";
import {
  FunnelIcon,
  EyeIcon,
  DocumentTextIcon,
  DocumentChartBarIcon,
  TrashIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import TitleCard from "../../../components/Cards/TitleCard";
import FilterReturnPurchases from "./Filter";
import ReturnPurchasesDetail from "./ActionReturnPurchase/ReturnPurchaseDetail";
import EditReturnPurchase from "./ActionReturnPurchase/ReturnPurchaseEdit";
import CreatePurchase from "../CreatePurchase";
import PageControl from "../../../components/PageControl/PageControl";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const RETURN_PURCHASES_DATA = [
  {
    date: "2024-10-26",
    reference: "TR_1119",
    supplier: "IT Supplier",
    warehouse: "Warehouse 1",
    grandTotal: 22.0,
    status: "Completed",
    purchaseRef: "PR_20231026",
    paid: 1527.0,
    due: 0.0,
    paymentStatus: "Unpaid",
  },
  {
    date: "2024-10-27",
    reference: "TR_1120",
    supplier: "Fruit Supply",
    warehouse: "Warehouse 4",
    grandTotal: 15.0,
    status: "Completed",
    purchaseRef: "PR_20231027",
    paid: 1527.0,
    due: 0.0,
    paymentStatus: "Unpaid",
  },
];

function ReturnPurchase() {
  const [returnPurchasesData, setReturnPurchasesData] = useState(
    RETURN_PURCHASES_DATA
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isEditReturnPurchase, setIsEditReturnPurchase] = useState(false);
  const [isReturnPurchases, setIsReturnPurchases] = useState(false);
  const [isCreatePurchase, setIsCreatePurchases] = useState(false);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredData = returnPurchasesData.filter(
    (transfer) =>
      transfer.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.warehouse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (index) => {
    const updatedReturnPurchasesData = returnPurchasesData.filter(
      (_, i) => i !== index
    );
    setReturnPurchasesData(updatedReturnPurchasesData);
  };

  const navigateToEditReturnPurchase = () => setIsEditReturnPurchase(true);
  const navigateToReturnPurchases = () => setIsReturnPurchases(true);
  const navigateToCreatePurchase = () => setIsCreatePurchases(true);

  //nominal rupiah
  const formatToRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item) => ({
        ...item,
        grandTotal: formatToRupiah(item.grandTotal),
        paid: formatToRupiah(item.paid),
        due: formatToRupiah(item.due),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, "Return Purchases Report.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Return Purchases Report", 10, 10);

    const tableData = filteredData.map((item) => [
      item.date,
      item.reference,
      item.supplier,
      item.warehouse,
      item.purchaseRef,
      item.status,
      formatToRupiah(item.grandTotal),
      formatToRupiah(item.paid),
      formatToRupiah(item.due),
      item.paymentStatus,
    ]);

    doc.autoTable({
      head: [
        [
          "Date",
          "Reference",
          "Supplier",
          "Warehouse",
          "Purchase Ref",
          "Status",
          "Grand Total",
          "Paid",
          "Due",
          "Payment Status",
        ],
      ],
      body: tableData,
      startY: 20,
    });

    doc.save("Return Purchases Report.pdf");
  };

  if (isEditReturnPurchase) return <EditReturnPurchase />;
  if (isReturnPurchases) return <ReturnPurchasesDetail />;
  if (isCreatePurchase) return <CreatePurchase />;

  return (
    <div className="flex flex-col items-center h-screen pt-10 px-4">
      <FilterReturnPurchases
        isVisible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
      />

      <TitleCard title="Return Purchases" topMargin="mt-2">
        <div className="flex w-full items-center justify-between flex-wrap mb-4">
          <div className="relative w-50 max-w-xs">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by Supplier "
              className="input input-bordered w-full h-8 pl-8 text-sm"
            />
          </div>

          <div className="flex space-x-2 mt-2 sm:mt-0">
            <button
              onClick={() => setIsFilterVisible(true)}
              className="btn btn-outline btn-primary flex items-center text-sm h-10"
            >
              <FunnelIcon className="w-5 h-5 mr-1" />
              Filter
            </button>
            <button
              onClick={handleExportExcel}
              className="btn btn-outline btn-success flex items-center text-sm h-10"
            >
              <DocumentChartBarIcon className="w-5 h-5 mr-1" />
              Excel
            </button>
            <button
              onClick={handleExportPDF}
              className="btn btn-outline btn-error flex items-center text-sm h-10"
            >
              <DocumentTextIcon className="w-5 h-5 mr-1" />
              PDF
            </button>
            <button
              className="btn btn-primary flex items-center"
              onClick={navigateToCreatePurchase}
            >
              <PlusCircleIcon className="w-5 h-5 mr-1" />
              Create
            </button>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr>
                {[
                  "Date",
                  "Reference",
                  "Supplier",
                  "Warehouse",
                  "Purchase Ref",
                  "Status",
                  "Grand Total",
                  "Paid",
                  "Due",
                  "Payment Status",
                  "Action",
                ].map((header, i) => (
                  <th
                    key={i}
                    className="border-b py-3 px-4 text-left text-sm font-semibold"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((transfer, index) => (
                <tr key={index}>
                  <td className="py-3 px-4 text-sm">{transfer.date}</td>
                  <td className="py-3 px-4 text-sm">{transfer.reference}</td>
                  <td className="py-3 px-4 text-sm">{transfer.supplier}</td>
                  <td className="py-3 px-4 text-sm">{transfer.warehouse}</td>
                  <td className="py-3 px-4 text-sm">{transfer.purchaseRef}</td>
                  <td className="py-3 px-4 text-sm">
                    <span
                      className={`px-2 py-1 text-xs rounded-md ${
                        transfer.status === "Completed"
                          ? "text-green-500 border border-green-500"
                          : "text-red-500 border border-red-500"
                      }`}
                    >
                      {transfer.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">{formatToRupiah(transfer.grandTotal)}</td>
                  <td className="py-3 px-4 text-sm">{formatToRupiah(transfer.paid)}</td>
                  <td className="py-3 px-4 text-sm">{formatToRupiah(transfer.due)}</td>
                  <td className="py-3 px-4 text-sm">
                    <span
                      className={`px-2 py-1 text-xs rounded-md ${
                        transfer.paymentStatus === "Unpaid"
                          ? "text-orange-500 border border-orange-500"
                          : "text-green-500 border border-green-500"
                      }`}
                    >
                      {transfer.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm flex space-x-2">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={navigateToReturnPurchases}
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={navigateToEditReturnPurchase}
                      className="btn btn-sm btn-warning"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="btn btn-sm btn-error"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PageControl />
      </TitleCard>
    </div>
  );
}

export default ReturnPurchase;
