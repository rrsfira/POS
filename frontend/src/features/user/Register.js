import { useState } from "react";
import { Link } from "react-router-dom";
import LandingIntro from "./LandingIntro";
import ErrorText from "../../components/Typography/ErrorText";
import InputText from "../../components/Input/InputText";

function Register() {
  const INITIAL_REGISTER_OBJ = {
    name: "",
    password: "",
    emailId: "",
    role: "",
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [registerObj, setRegisterObj] = useState(INITIAL_REGISTER_OBJ);

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (registerObj.name.trim() === "") return setErrorMessage("Name is required!");
    if (registerObj.emailId.trim() === "") return setErrorMessage("Email Id is required!");
    if (registerObj.password.trim() === "") return setErrorMessage("Password is required!");
    if (registerObj.role.trim() === "") return setErrorMessage("Role is required!");

    try {
        setLoading(true);
        // Call API to register user
        const response = await fetch("http://localhost:5000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: registerObj.name,
                emailId: registerObj.emailId,
                password: registerObj.password,
                role: registerObj.role
            })
        });

        const result = await response.json();
        
        if (response.ok) {
            // Jika registrasi berhasil, redirect ke halaman dashboard atau login
            localStorage.setItem("token", "DummyTokenHere");
            window.location.href = '/login';
        } else {
            // Tampilkan pesan error jika registrasi gagal
            setErrorMessage(result.message || "Registration failed!");
        }
    } catch (err) {
        console.error("Error during registration:", err);
        setErrorMessage("An error occurred during registration!");
    } finally {
        setLoading(false);
    }
};


  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setRegisterObj({ ...registerObj, [updateType]: value });
  };

  return (
    <div className="min-h-screen flex items-center relative">
      <img
        src="./BgGambar.svg"
        alt="Background"
        className="absolute inset-0 object-cover w-full h-full z-[-1]"
      />
      <div className="card mx-auto w-full max-w-5xl shadow-xl relative z-10">
        <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
          <div className="">
            <LandingIntro />
          </div>

          <div className="py-24 px-10">
            <h2 className="text-2xl font-semibold mb-2 text-center">
              Register
            </h2>
            <form onSubmit={(e) => submitForm(e)}>
              <div className="mb-4">
                <InputText
                  defaultValue={registerObj.name}
                  updateType="name"
                  containerStyle="mt-4"
                  labelTitle="Name"
                  updateFormValue={updateFormValue}
                />

                <InputText
                  defaultValue={registerObj.emailId}
                  updateType="emailId"
                  containerStyle="mt-4"
                  labelTitle="Email"
                  updateFormValue={updateFormValue}
                />

                <InputText
                  defaultValue={registerObj.password}
                  type="password"
                  updateType="password"
                  containerStyle="mt-4"
                  labelTitle="Password"
                  updateFormValue={updateFormValue}
                />

                <InputText
                  defaultValue={registerObj.role}
                  updateType="role"
                  containerStyle="mt-4"
                  labelTitle="Role"
                  updateFormValue={updateFormValue}
                />
              </div>

              <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
              <button
                type="submit"
                className={"btn mt-2 w-full btn-primary" + (loading ? " loading" : "")}
              >
                Register
              </button>

              <div className="text-center mt-4">
                Already have an account?{" "}
                <Link to="/login">
                  <span className="inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                    Login
                  </span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
