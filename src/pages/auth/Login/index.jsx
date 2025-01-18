import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";

function LoginIndex() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { refeshLogin, setRefeshLogin } = useAuthContext()
  const isValidCredentials = (email, password) => {
    const validCredentials = [
      { email: "admin", password: "Admin123" },
      { email: "Admin", password: "Admin123" }
    ];
    return validCredentials.some(cred => cred.email === email && cred.password === password);
  };

  const handleSubmit = () => {
    setError(false);
    setLoading(true);

    if (isValidCredentials(email, password)) {
      localStorage.setItem("token", "abcdefghijklmnopqrstuvwxyzABC");
      message.success("Đăng nhập thành công");
      setRefeshLogin(prev => !prev);
      navigate("/");
    } else {
      setLoading(false);
      message.error("Hãy nhập đúng tài khoản, mật khẩu");
    }
  };
  const checkAccessToken = async () => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      navigate("/");
    }
  };

  useEffect(() => {
    checkAccessToken();
  }, [refeshLogin]);

  const LoginImage =
    "https://static.vecteezy.com/system/resources/previews/019/872/884/non_2x/3d-minimal-user-login-page-user-authentication-concept-user-verification-concept-login-page-with-a-fingerprint-padlock-3d-illustration-free-png.png";
  return (
    <>
      <div className="flex min-h-screen">
        <div className="flex w-full flex-col md:flex-row">
          {/* Image */}
          <div className="md:bg-emerald-500 md:min-h-screen flex flex-wrap md:w-1/2">
            <div className="items-center text-center flex flex-col relative justify-center mx-auto">
              <img
                src={LoginImage}
                alt="Logo Login"
                className="md:w-72 w-48 mx-auto"
              />
              <div className="md:block hidden text-slate-100">
                <h1 className="font-semibold text-2xl pb-2">
                  Login to Your Account
                </h1>
                <span className="text-sm">
                  Free access to EDP Online services
                </span>
              </div>
            </div>
          </div>
          {/* Login Section */}
          <div className="flex flex-col md:flex-1 items-center justify-center">
            <div className="loginWrapper flex flex-col w-full lg:px-36 md:px-8 px-8 md:py-8">
              {/* Login Header Text */}
              <div className="hidden md:block font-medium self-center text-xl sm:text-3xl text-gray-800">
                Welcome Back!
              </div>

              {/* Sparator */}
              <div className="hidden md:block relative mt-10 h-px bg-gray-300">
                <div className="absolute left-0 top-0 flex justify-center w-full -mt-2">
                  <span className="bg-white px-4 text-xs text-gray-500 uppercase">
                    Login dengan e-mail atau username
                  </span>
                </div>
              </div>

              <div className="md:hidden block my-4">
                <h1 className="text-2xl font-semibold">Login</h1>
              </div>

              {/* Login Form */}
              <div className="md:mt-10 mt-4">
                <div >
                  {/* Username */}
                  <div className="flex flex-col mb-3">
                    <div className="relative">
                      <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                        <FontAwesomeIcon icon={faEnvelope} />
                      </div>

                      <input
                        id="email"
                        type="text"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                        placeholder="E-Mail Address"
                      />
                    </div>
                    {error?.email && (
                      <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                        {error.email[0]}
                      </span>
                    )}
                  </div>

                  {/* Password */}
                  <div className="flex flex-col mb-6">
                    <div className="relative">
                      <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                        <FontAwesomeIcon icon={faLock} />
                      </div>

                      <input
                        id="password"
                        type="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full md:py-2 py-3 focus:outline-none focus:border-emerald-400"
                        placeholder="Password"
                      />
                    </div>
                    {error?.password && (
                      <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                        {error.password[0]}
                      </span>
                    )}
                  </div>



                  {/* Button Login */}
                  <div className="flex w-full">
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      type="submit"
                      className="flex items-center justify-center focus:outline-none text-white text-sm bg-emerald-500 hover:bg-emerald-700 rounded-lg md:rounded md:py-2 py-3 w-full transition duration-150 ease-in"
                    >
                      <span className="mr-2 md:uppercase">
                        {loading ? "Processing...." : "Login"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>



            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginIndex;
