// import React, { useEffect, useState } from "react";
// import "./ForgetPassword.css";
// import Logo from "./../../Images/logo.png";
// import Slide from "./../../Images/side.png";
// import { Container, Row, Col } from "react-bootstrap";
// import { AiOutlineUser } from "react-icons/ai";
// import { HiLockClosed, HiLockOpen } from "react-icons/hi";
// import axios from "axios";
// import { ApiPaths } from "../../Config";
// import Loader from "../../Components/Loader/Loader";
// import { Link, useNavigate } from "react-router-dom";
// import { Data, toastFailed, toastSuccess } from "../../Common/Data";
// import "./ForgetPassword.css";
// import {
//   AiFillEye,
//   AiOutlineMail,
//   AiOutlinePhone,
//   AiFillEyeInvisible,
//   AiOutlineCheckCircle,
// } from "react-icons/ai";
// const ForgetPassword = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [passwordVisility, setPasswordVisiblity] = useState(false);
//   const [showOtp, setShowOtp] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [otpError, setOtpError] = useState("");
//   const [otpLoading, setOtpLoading] = useState(false);
//   const navigate = useNavigate();

//   function SendForgetOtp() {
//     if (username.length > 0 && password.length > 0) {
//       setLoading(true);
//       axios({
//         method: "post",
//         url: ApiPaths.sendForgetOTP,
//         data: {
//           u_code: username,
//           password: password,
//           otp_type: "forgot_password",
//         },
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       })
//         .then(function (response) {
//           Data.isDebug && console.log(response);
//           if (response?.data?.res == "success") {
//             toastSuccess(response?.data?.message);
//             setShowOtp(true);
//           } else {
//             toastFailed(response?.data?.res);
//           }
//           setLoading(false);
//         })
//         .catch(function (response) {
//           setLoading(false);
//         });
//     } else {
//       toastFailed("check username or password");
//     }
//   }
//   // function ForgetPasswordFunc() {
//   //   let user_Id = localStorage.getItem("userId");
//   //   Data.isDebug && console.log("userId", username);
//   //   Data.isDebug && console.log("passwrpassword", password);
//   //   Data.isDebug && console.log("otp", otp);
//   //   setOtpError("");
//   //   if (otp.length !== 6) {
//   //     setOtpError("Invalid OTP");
//   //   }
//   //   setOtpLoading(true);
//   //   if (otp.length == 6) {
//   //     axios({
//   //       method: "post",
//   //       url: ApiPaths.forgotPassword,
//   //       data: {
//   //         u_code: username,
//   //         otp_type: "forgot_password",
//   //         entered_otp: otp,
//   //         new_password: password,
//   //       },
//   //       headers: {
//   //         "Content-Type": "multipart/form-data",
//   //       },
//   //     })
//   //       .then(function (response) {
//   //         // Data.isDebug && console.log(response);
//   //         if (response?.data?.res == "success") {
//   //           setShowOtp(false);
//   //           setOtp("");
//   //           alert(response?.data?.message);
//   //           navigate("/");
//   //         } else {
//   //           toastFailed(response?.data?.message);
//   //         }
//   //         setOtpLoading(false);
//   //       })
//   //       .catch(function (response) {
//   //         Data.isDebug && console.log(response);
//   //         toastFailed("Something went wrong");
//   //         setOtpLoading(false);
//   //       });
//   //   } else {
//   //     setOtpLoading(false);
//   //   }
//   // }

//   function ForgetPasswordFunc() {
//     setOtpError("");
//     if (otp.length !== 6) {
//       setOtpError("Invalid OTP");
//       return; // Exit if OTP is invalid
//     }

//     setOtpLoading(true);
//     axios({
//       method: "post",
//       url: ApiPaths.forgotPassword,
//       data: {
//         u_code: username,
//         otp_type: "forgot_password",
//         entered_otp: otp,
//         new_password: password,
//       },
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     })
//       .then(function (response) {
//         if (response?.data?.res === "success") {
//           setShowOtp(false);
//           setOtp("");
//           alert(response?.data?.message);
//           navigate("/");
//         } else {
//           toastFailed(response?.data?.message);
//         }
//       })
//       .catch(function (error) {
//         Data.isDebug && console.log(error); // Log the error for debugging
//         toastFailed("Something went wrong");
//       })
//       .finally(() => {
//         setOtpLoading(false); // Ensure loading is stopped in both success and failure cases
//       });
// }

//   useEffect(() => {
//     const viewInput = document.getElementById("viewInput");
//     viewInput.addEventListener("keypress", function (event) {
//       if (event.key === "Enter") {
//         event.preventDefault();
//         document.getElementById("viewBtn").click();
//       }
//     });
//   }, []);

//   return (
//     <>
//       {loading ? <Loader /> : null}

//       {showOtp ? (
//         <div className="otpSection">
//           <div className="otpContainer">
//             <h1>OTP</h1>
//             <p>OTP sent to your registered email address</p>
//             <input
//               type="text"
//               maxLength={6}
//               size={6}
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//             />
//             <p className="errorMsg">{otpError}</p>
//             {otpLoading ? (
//               <div className="otpLoading"></div>
//             ) : (
//               <div>
//                 <button
//                   className="btnSecondary"
//                   onClick={() => (setOtp(""), setShowOtp(false))}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="btnPrimary"
//                   onClick={() => ForgetPasswordFunc()}
//                 >
//                   Submit
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       ) : null}
//       <Container id="logincontainer">
//         <div className="forgotContainerContent">
//           <div className="loginContent">
//             <a className="loginLogo" href={Data.websiteLink}>
//               <img src={Logo} alt="logo.png" height="100px" />
//             </a>
//             <h5>Forget Password?</h5>
//             <div className="forgotContent_inner">
//               <div className="loginInputs">
//                 <div className="loginInput_inner">
//                   <span>Username</span>

//                   <input
//                     type="text"
//                     placeholder="Username"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                   />
//                   <div className="partition"></div>

//                   <i>
//                     <AiOutlineUser />
//                   </i>
//                 </div>

//                 <div className="loginInput_inner">
//                   <span>Password</span>

//                   <input
//                     id="viewInput"
//                     type={passwordVisility ? "text" : "password"}
//                     placeholder="Set New Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                   />
//                   <div className="partition"></div>

//                   <i>
//                     <HiLockClosed />
//                   </i>
//                   <i
//                     id="eyeIcon"
//                     onClick={() => setPasswordVisiblity(!passwordVisility)}
//                   >
//                     {passwordVisility ? <AiFillEye /> : <AiFillEyeInvisible />}
//                   </i>
//                 </div>
//               </div>
//               <div className="loginFooter_btn">
//                 <button
//                   className="btnPrimary mb-2"
//                   onClick={SendForgetOtp}
//                   id="viewBtn"
//                 >
//                   Send OTP
//                 </button>
//                 <p className="sign_log">Don't have an account?</p>
//                 <Link to="/register" className="btnPrimary">
//                   Register
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Container>
//     </>
//   );
// };

// export default ForgetPassword;





import React, { useEffect, useState } from "react";
import "./ForgetPassword.css";
import Logo from "./../../Images/logo.png";
import Slide from "./../../Images/side.png";
import { Container, Row, Col } from "react-bootstrap";
import { AiOutlineUser } from "react-icons/ai";
import { HiLockClosed, HiLockOpen } from "react-icons/hi";
import axios from "axios";
import { ApiPaths } from "../../Config/ApiPath";
import Loader from "../../Components/Loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import { Data, toastFailed, toastSuccess } from "../../Common/Data";
import "./ForgetPassword.css";
import {
  AiFillEye,
  AiOutlineMail,
  AiOutlinePhone,
  AiFillEyeInvisible,
  AiOutlineCheckCircle,
} from "react-icons/ai";
import useAxiosHelper from "../../Common/AxiosHelper";
import ProgressBar from 'react-bootstrap/ProgressBar';
import { BasicInfo } from "../../Config/BasicInfo";

const ForgetPassword = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisility, setPasswordVisiblity] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const navigate = useNavigate();
  const { AxiosPost, AxiosGet } = useAxiosHelper();
  const [companyData, setCompanyData] = useState([])
  useEffect(() => {
    CompanyInfo();
  }, []);
  async function CompanyInfo() {
    try {

      const data = localStorage.getItem("companyData");
      // console.log(JSON.parse(data));
      setCompanyData(JSON.parse(data));
    } catch (error) {
      BasicInfo.isDebug && console.log(error);
    }
  }
  async function SendForgetOtp() {
    if (!username) {
      toastFailed("Username is required");
      return;
    }
    setLoading(true);

    const body = {
      username: username,
      action: "forgot_password",
    };
    BasicInfo.isDebug &&  console.log("Body", body);
    try {
      const res = await AxiosPost(ApiPaths.sendOtp, body);
      BasicInfo.isDebug && console.log("Response of send Otp", res);

      toastSuccess(res?.message || "OTP sent successfully");
      setShowOtp(true);
    } catch (e) {
      BasicInfo.isDebug &&    console.error("Error", e);
      toastFailed(e.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function ForgetPasswordFunc() {
    // Validate OTP and password
    if (!otp || otp.length !== 6) {
      setOtpError("Invalid OTP");
      return;
    }

    if (!password) {
      toastFailed("Password cannot be empty");
      return;
    }
    setOtpLoading(true);
    const body = {
      username: username,  // Include username in the request body
      otp: otp,
      newPassword: password, // Assuming the backend expects password in the request body
      action: "forgot_password"
    };
    BasicInfo.isDebug && console.log("Body of Forgot Passsword", body)
    try {
      // Call the forgotPassword API
      const res = await AxiosPost(ApiPaths.forgotPassword, body);
      BasicInfo.isDebug && console.log("Response of Forgot Password", res);
      // Handle success response
      if (res?.status == "201") {
        toastSuccess(res?.message);
        setShowOtp(false); // Hide OTP input section
        setOtp(""); // Reset OTP field
        navigate("/"); // Redirect to login page or home
      } else {
        toastFailed(res?.data?.message); // Show error message
      }
    } catch (e) {
      BasicInfo.isDebug &&  console.error(e);
      BasicInfo.isDebug &&  console.error("Error details:", e.response ? e.response.data : e.message);
      toastFailed(e.response?.data?.message);
    } finally {
      setOtpLoading(false); // Stop loading spinner
    }
  }

  return (
    <>
      {loading ? <Loader /> : null}

      {showOtp ? (
        <div className="otpSection">
          <div className="otpContainer">
            <h1>OTP</h1>
            <p>OTP sent to your registered email address</p>
            <input
              type="text"
              maxLength={6}
              size={6}
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <p className="errorMsg">{otpError}</p>

            {/* Add the password input here when OTP is shown */}

            <input
              id="viewInput"
              type={passwordVisility ? "text" : "password"}
              placeholder="Set New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginTop: "10px" }}

            />


            {otpLoading ? (
              <div className="otpLoading"></div>
            ) : (
              <div>
                <button
                  className="btnSecondary"
                  onClick={() => (setOtp(""), setShowOtp(false))}
                >
                  Cancel
                </button>
                <button className="btnPrimary" onClick={() => ForgetPasswordFunc()}>
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}

      <Container id="logincontainer">
        <div className="forgotContainerContent">
          <div className="loginContent">
            <a className="loginLogo" href={companyData?.contactInfo?.website}>
              <img src={Logo} alt="logo.png" height="100px" />
            </a>
            <h5>Forget Password?</h5>
            <div className="forgotContent_inner">
              <div className="loginInputs">
                <div className="loginInput_inner">
                  <span>Username</span>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <div className="partition"></div>

                  <i>
                    <AiOutlineUser />
                  </i>
                </div>
              </div>
              <div className="loginFooter_btn">
                <button
                  className="btnPrimary mb-2"
                  onClick={() => SendForgetOtp()}
                  id="viewBtn"
                >
                  Send OTP
                </button>
                <p className="sign_log">Don't have an account?
                  <Link style={{ padding: "0px" }} to="/register">Register</Link>
                </p>
                <Link to="/" className="btnPrimary">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ForgetPassword;
