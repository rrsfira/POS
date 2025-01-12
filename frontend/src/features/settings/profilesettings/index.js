import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import InputText from "../../../components/Input/InputText";
import { showNotification } from "../../common/headerSlice";

function ProfileSettings() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    id: null,
    name: "Admin", 
    email: "admin@gmail.com", 
    phone: "+62851065072895", 
    role: "Admin", 
    password: "********",
  });

  // Ambil data profil pengguna saat komponen pertama kali dimuat
  useEffect(() => {
    const token = localStorage.getItem("token"); // Ambil token dari localStorage
    console.log("Token yang dikirim:", token); // Log token yang dikirimkan

    if (!token) {
      dispatch(
        showNotification({ message: "Token tidak ditemukan", status: 0 })
      );
      return;
    }

    fetch("/api/getProfile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Token yang dikirim dalam format Bearer <token>
        "Content-Type": "application/json",
      },
      credentials: "include", // Menambahkan kredensial jika diperlukan
    })
      .then((response) => {
        console.log("Response status:", response.status); // Log status respons
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data received:", data); // Log data yang diterima
        if (data.success) {
          setProfile(data.user);
        } else {
          dispatch(
            showNotification({
              message: data.error || "Gagal memuat data pengguna",
              status: 0,
            })
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        dispatch(
          showNotification({
            message: "Terjadi kesalahan saat memuat profil",
            status: 0,
          })
        );
      });
  }, [dispatch]);

  const updateFormValue = ({ updateType, value }) => {
    setProfile((prevState) => ({ ...prevState, [updateType]: value }));
  };

  const updateProfile = () => {
    setIsLoading(true);

    const token = localStorage.getItem("token");
    console.log("Token dari localStorage:", token); // Log token untuk memeriksa apakah token benar-benar ada

    // Pastikan endpoint untuk pembaruan berbeda dan sesuai dengan tujuan
    fetch("/api/getProfile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log("Status respons:", response.status);
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data diterima dari API:", data);
      })
      .catch((error) => {
        console.error("Kesalahan saat memuat profil:", error);
      });
  };

  return (
    <TitleCard title="Profile Settings" topMargin="mt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputText
          labelTitle="Name"
          value={profile.name}
          updateFormValue={(value) =>
            updateFormValue({ updateType: "name", value })
          }
        />
        <InputText
          labelTitle="Email"
          value={profile.email}
          updateFormValue={(value) =>
            updateFormValue({ updateType: "email", value })
          }
        />
        <InputText
          labelTitle="Phone"
          value={profile.phone}
          updateFormValue={(value) =>
            updateFormValue({ updateType: "phone", value })
          }
        />
        <div className="form-control">
          <label className="label">
            <span className="label-text">Role</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={profile.role}
            readOnly
          />
        </div>
        <InputText
          labelTitle="Password"
          value={profile.password}
          updateFormValue={(value) =>
            updateFormValue({ updateType: "password", value })
          }
        />
      </div>
      <div className="divider"></div>
      <div className="mt-16">
        <button
          className={`btn btn-primary float-right ${
            isLoading ? "loading" : ""
          }`}
          onClick={updateProfile}
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update"}
        </button>
      </div>
    </TitleCard>
  );
}

export default ProfileSettings;
