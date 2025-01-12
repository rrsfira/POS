import { useState } from 'react';
import { Link } from 'react-router-dom';
import LandingIntro from './LandingIntro';
import ErrorText from '../../components/Typography/ErrorText';
import InputText from '../../components/Input/InputText';

function Login() {
    const INITIAL_LOGIN_OBJ = {
        password: "",
        emailId: "",
    };

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);

    const submitForm = async (e) => {
        e.preventDefault();
        setErrorMessage("");
    
        if (loginObj.emailId.trim() === "") return setErrorMessage("Email Id is required!");
        if (loginObj.password.trim() === "") return setErrorMessage("Password is required!");
    
        setLoading(true);
    
        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: loginObj.emailId,
                    password: loginObj.password,
                }),
            });
    
            const data = await response.json();
            console.log("Backend Response:", data); // Log respons dari backend untuk melihat apakah ada error atau tidak
    
            if (response.ok) {
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    console.log("Token saved:", data.token); // Log token yang disimpan
                    window.location.href = "/app/dashboard"; // Contoh pengalihan setelah login
                } else {
                    setErrorMessage("No token in response from server.");
                }
            } else {
                setErrorMessage(data.message || "Login failed!");
            }
        } catch (error) {
            console.error("Request Error:", error); // Log error lebih rinci
            setErrorMessage("An error occurred during login!");
        } finally {
            setLoading(false);
        }
    };
    
    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        setLoginObj({ ...loginObj, [updateType]: value });
    };

    return (
        <div className="min-h-screen flex items-center relative">
           {/* <img src="./BgGambar.svg" alt="Background" className="absolute inset-0 object-cover w-full h-full z-[-1]" />*/}
            <div className="card mx-auto w-full max-w-5xl shadow-xl relative z-10">
                <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
                    <div className="">
                        <LandingIntro />
                    </div>
                    <div className="py-24 px-10">
                        <h2 className="text-2xl font-semibold mb-2 text-center">Login</h2>
                        <form onSubmit={(e) => submitForm(e)}>
                            <div className="mb-4">
                                <InputText
                                    type="email"
                                    defaultValue={loginObj.emailId}
                                    updateType="emailId"
                                    containerStyle="mt-4"
                                    labelTitle="Email"
                                    updateFormValue={updateFormValue}
                                />
                                <InputText
                                    defaultValue={loginObj.password}
                                    type="password"
                                    updateType="password"
                                    containerStyle="mt-4"
                                    labelTitle="Password"
                                    updateFormValue={updateFormValue}
                                />
                            </div>
                           {/*} <div className="text-right text-primary">
                                <Link to="/forgot-password">
                                    <span className="text-sm inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                                        Forgot Password?
                                    </span>
                                </Link>
                            </div>*/}
                            <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
                            <button type="submit" className={"btn mt-2 w-full btn-primary" + (loading ? " loading" : "")}>
                                Login
                            </button>
                           {/*<div className="text-center mt-4">
                                Don't have an account yet?{" "}
                                <Link to="/register">
                                    <span className="inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                                        Register
                                    </span>
                                </Link>
                            </div>*/}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;