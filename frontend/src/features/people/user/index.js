import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EllipsisVerticalIcon,
  FunnelIcon,
  PlusCircleIcon,
  DocumentChartBarIcon,
  DocumentTextIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { utils, write } from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import TitleCard from "../../../components/Cards/TitleCard";
import SearchBar from "../../../components/Input/SearchBar";
import { showNotification } from "../../common/headerSlice";

function User() {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const dispatch = useDispatch();

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null); // Untuk menyimpan user yang akan dihapus
  const openDeleteConfirmModal = (user) => {
    setUserToDelete(user); // Simpan user yang akan dihapus
    setShowDeleteConfirmModal(true); // Tampilkan modal konfirmasi
  };

  // State untuk Modal
  const [showModal, setShowModal] = useState(false); // Untuk tampilan modal
  const [modalMode, setModalMode] = useState(""); // Untuk menentukan apakah modal untuk View, Edit, atau Create
  const [selectedUser, setSelectedUser] = useState(null); // Untuk menyimpan user yang dipilih saat modal dibuka

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = new FormData(e.target);
    const payload = Object.fromEntries(userData); // ambil data dari form

    try {
      let response;
      if (modalMode === "create") {
        response = await fetch("http://localhost:5000/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          const newUser = await response.json();
          setUsers([...users, newUser]); // Menambah user baru ke state
          dispatch(
            showNotification({
              message: "User created successfully!",
              status: 1,
            })
          );
        }
      } else if (modalMode === "edit") {
        response = await fetch(
          `http://localhost:5000/api/users/${selectedUser.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        if (response.ok) {
          const updatedUser = await response.json();
          setUsers(
            users.map((user) =>
              user.id === selectedUser.id ? { ...user, ...updatedUser } : user
            )
          ); // Memperbarui user pada state
          dispatch(
            showNotification({
              message: "User updated successfully!",
              status: 1,
            })
          );
        }
      }
      closeModal();
    } catch (error) {
      console.error("Error during submission:", error);
      dispatch(showNotification({ message: "Action failed!", status: 0 }));
    }
  };

  // DROPDOWN
  const [openDropdown, setOpenDropdown] = useState(null);

  // Mengaktifkan Dropdown
  const handleActionClick = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  // Menutup dropdown saat klik di luar area
  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest(".dropdown")) setOpenDropdown(null);
    };
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users");
        if (!response.ok) throw new Error("Gagal mengambil data dari server");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Kesalahan di frontend:", error);
      }
    };
    fetchUsers();
  }, []);

  // Download Excel
  const downloadExcel = () => {
    const worksheet = utils.json_to_sheet(users);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "User");
    const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "UserData.xlsx");
  };

  // Download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("User Data", 14, 10);
    const tableColumn = ["name", "Phone", "Email", "Role"];
    const tableRows = users.map((item) => [
      item.name || "N/A",
      item.phone || "N/A",
      item.email || "N/A",
      item.role || "N/A",
    ]);
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("UserData.pdf");
  };

  // Pagination
  const filteredUser = users.filter(
    (user) =>
      (user.name &&
        user.name.toLowerCase().includes(searchText.toLowerCase())) ||
      (user.email &&
        user.email.toLowerCase().includes(searchText.toLowerCase())) ||
      (user.role && user.role.toLowerCase().includes(searchText.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredUser.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUser.slice(indexOfFirstItem, indexOfLastItem);

  // Fungsi untuk membuka modal
  const openModal = (mode, user = null) => {
    setModalMode(mode);
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setModalMode("");
    setSelectedUser(null);
    setShowModal(false);
  };

  return (
    <>
      <TitleCard title="User Management">
        <div className="flex justify-between items-center mb-4">
          <SearchBar
            searchText={searchText}
            setSearchText={(text) => {
              setSearchText(text);
              setCurrentPage(1); // Reset ke halaman pertama setelah search
            }}
          />

          <div className="flex items-center space-x-2">
            {/* <button
              className="border btn-sm border-primary text-primary rounded-md px-4 py-2 flex items-center space-x-1 hover:bg-primary hover:text-white hover:shadow-xl transition duration-200"
              onClick={() => console.log("Filter button clicked!")}
            >
              <FunnelIcon className="h-5 w-5" />
              <span>Filter</span>
            </button>*/}
            <button
              className="border btn-sm border-success text-success rounded-md px-4 py-2 flex items-center space-x-1 hover:bg-success hover:text-white hover:shadow-xl transition duration-200"
              onClick={downloadExcel}
            >
              <DocumentChartBarIcon className="h-5 w-5" />
              <span>EXCEL</span>
            </button>
            <button
              className="border btn-sm border-error text-error rounded-md px-4 py-2 flex items-center space-x-1 hover:bg-error hover:text-white hover:shadow-xl transition duration-200"
              onClick={downloadPDF}
            >
              <DocumentTextIcon className="h-5 w-5" />
              <span>PDF</span>
            </button>
            <button
              className="btn-sm bg-primary text-white rounded-md px-4 py-2 flex items-center space-x-1 hover:shadow-xl transition duration-200"
              onClick={() => openModal("create")}
            >
              <PlusCircleIcon className="h-5 w-5" />
              <span>Create</span>
            </button>
          </div>
        </div>

        <div className="w-full">
          <table className="table w-full table-auto">
            <thead>
              <tr>
                <th className="text-center text-primary text-base">Name</th>
                <th className="text-center text-primary text-base">Email</th>
                <th className="text-center text-primary text-base">Phone</th>
                <th className="text-center text-primary text-base">Role</th>
                <th className="text-center text-primary text-base">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user, index) => (
                <tr key={user.id}>
                  <td className="text-center">{user.name}</td>
                  <td className="text-center">{user.email}</td>
                  <td className="text-center">{user.phone}</td>
                  <td className="text-center">{user.role}</td>
                  <td>
                    <div className="dropdown dropdown-end ml-4">
                      <button onClick={() => handleActionClick(index)}>
                        <EllipsisVerticalIcon className="h-6 w-6" />
                      </button>
                      <ul
                        tabIndex={0}
                        className="menu menu-compact dropdown-content shadow bg-base-100 rounded-box w-30 z-50"
                      >
                        {/* View */}
                        <div className="flex items-center ml-2">
                          <EyeIcon className="h-5 w-5 inline-block" />
                          <li onClick={() => openModal("view", user)}>
                            <span>View</span>
                          </li>
                        </div>
                        <div className="flex items-center ml-2">
                          <PencilIcon className="h-5 w-5 inline-block" />
                          <li onClick={() => openModal("edit", user)}>
                            <span>Edit</span>
                          </li>
                        </div>
                        <div className="flex items-center ml-2">
                          <TrashIcon className="h-5 w-5 inline-block" />
                          <li onClick={() => openDeleteConfirmModal(user)}>
                            <span>Delete</span>
                          </li>
                        </div>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Page Content */}
          <div className="flex justify-between items-center mt-5 mx-5 space-x-4">
            {/* Text for current page */}
            <span className="text-sm text-gray-500">
              Rows Per Page{" "}
              <span className="font-bold text-primary">{itemsPerPage}</span>
            </span>
            {/* Pagination */}
            <div className="flex justify-end items-center space-x-4">
              {/* Text for current page */}
              <span className="text-sm text-gray-500">
                Page{" "}
                <span className="font-bold text-primary">{currentPage}</span> of{" "}
                <span className="font-bold text-primary">{totalPages}</span>
              </span>

              {/* Pagination buttons */}
              <div className="join">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`join-item btn btn-sm ${
                      currentPage === i + 1 ? "btn-primary btn-active" : ""
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </TitleCard>

      {showDeleteConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-lg font-bold">Confirm Deletion</h3>
            <p>Are you sure you want to delete user {userToDelete?.name}?</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={async () => {
                  // Hapus user jika konfirmasi
                  try {
                    const response = await fetch(
                      `http://localhost:5000/api/users/${userToDelete.id}`,
                      { method: "DELETE" }
                    );
                    if (response.ok) {
                      setUsers(
                        users.filter((user) => user.id !== userToDelete.id)
                      ); // Hapus user dari state
                      dispatch(
                        showNotification({
                          message: "User deleted successfully!",
                          status: 1,
                        })
                      );
                    } else {
                      throw new Error("Failed to delete user");
                    }
                  } catch (error) {
                    console.error("Error deleting user:", error);
                    dispatch(
                      showNotification({
                        message: "Failed to delete user!",
                        status: 0,
                      })
                    );
                  }
                  setShowDeleteConfirmModal(false); // Tutup modal
                }}
                className="btn btn-error"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirmModal(false)} // Menutup modal jika batal
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            {modalMode === "view" && selectedUser && (
              <>
                <h3 className="text-lg font-bold">View User</h3>

                {/* Gambar Bulat atau Placeholder */}
                <div className="flex flex-col items-center">
                  <div className="user-image">
                    {selectedUser.image_url ? (
                      <img
                        src={`http://localhost:5000${selectedUser.img}`}
                        alt={selectedUser.name}
                        className="w-full h-full object-cover rounded-full" // Menambahkan rounded-full untuk membuat gambar bulat
                      />
                    ) : (
                      // Ikon Heroicons sebagai pengganti gambar
                      <UserCircleIcon className="w-16 h-16 text-gray-500" />
                    )}
                  </div>
                </div>
                <p>
                  <strong>Name:</strong> {selectedUser.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedUser.phone}
                </p>
                <p>
                  <strong>Role:</strong> {selectedUser.role}
                </p>

                <button onClick={closeModal} className="mt-4 btn btn-primary">
                  Close
                </button>
              </>
            )}
            {modalMode === "edit" && selectedUser && (
              <>
                <h3 className="text-lg font-bold">Edit User</h3>
                <form onSubmit={handleSubmit}>
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={selectedUser?.name || ""}
                    required
                    className="input input-bordered w-full mb-2"
                  />
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={selectedUser?.email || ""}
                    required
                    className="input input-bordered w-full mb-2"
                  />
                  <label>Phone:</label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={selectedUser?.phone || ""}
                    required
                    className="input input-bordered w-full mb-2"
                  />
                  <label>Password:</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter new password"
                    className="input input-bordered w-full mb-2"
                  />
                  <label>Role:</label>
                  <select
                    name="role"
                    defaultValue={selectedUser?.role || "Cashier"}
                    className="select select-bordered w-full mb-4"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Manager">Manager</option>
                  </select>
                  <button type="submit" className="btn btn-primary">
                    {modalMode === "edit" ? "Save Changes" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn btn-secondary ml-2"
                  >
                    Cancel
                  </button>
                </form>
              </>
            )}
            {modalMode === "create" && (
              <>
                <h3 className="text-lg font-bold">Create New User</h3>
                <form onSubmit={handleSubmit}>
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="input input-bordered w-full mb-2"
                  />
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="input input-bordered w-full mb-2"
                  />
                  <label>Phone:</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    className="input input-bordered w-full mb-2"
                  />
                  <label>Password:</label>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="Enter new password"
                    className="input input-bordered w-full mb-2"
                  />
                  <label>Role:</label>
                  <select
                    name="role"
                    className="select select-bordered w-full mb-4"
                    defaultValue="Cashier"
                  >
                    <option>Admin</option>
                    <option>Cashier</option>
                    <option>Manager</option>
                  </select>
                  <button type="submit" className="btn btn-primary">
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn btn-secondary ml-2"
                  >
                    Cancel
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default User;
