import React, { useState, useContext, useEffect, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const MultistepForm: React.FC = () => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [emailInput, setEmailInput] = useState("");
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(""));
  const [otpInput, setOtpInput] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const timerRef = useRef<number | null>(null);

  if (!userContext) return null;
  const { setUser } = userContext;

  // Countdown timer
  useEffect(() => {
    if (step === 2 && resendTimer > 0) {
      timerRef.current = window.setTimeout(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resendTimer, step]);

  // Generate OTP
  const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    alert(`OTP sent to ${emailInput}: ${otp}`);
    setResendTimer(30);
  };

  // Email validation
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanedEmail = emailInput.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;

    if (!cleanedEmail) {
      setError("Email field cannot be empty.");
      return;
    }

    if (!emailRegex.test(cleanedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setEmailInput(cleanedEmail);
    generateOtp();
    setStep(2);
  };

  // OTP input logic
  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const updatedDigits = [...otpDigits];
    updatedDigits[index] = value;
    setOtpDigits(updatedDigits);
    setOtpInput(updatedDigits.join(""));
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (otpInput !== generatedOtp) {
      setError("Invalid OTP. Please try again.");
      return;
    }
    setStep(3);
  };

  // Profile image validation
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setError("");
      setProfileImage(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  // Profile form submission
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const nameRegex = /^[A-Za-z ]{2,50}$/;
    if (!fullName || !nameRegex.test(fullName)) {
      setError("Please enter a valid full name.");
      return;
    }
    if (!profileImage || !profileImage.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }
    setUser({
      email: emailInput,
      fullName,
      profileImage: URL.createObjectURL(profileImage),
    });
    setStep(4);
    setTimeout(() => navigate("/dashboard"), 3000);
  };

  const buttonClass =
    "w-full bg-gradient-to-r from-[#005EB8] via-[#00A9E0] to-[#005EB8] text-white font-semibold py-2 px-4 rounded shadow-md hover:scale-[1.03] transition";

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F0F4FA] px-4 font-sans">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#005EB8]">
          {step === 1 && "Welcome"}
          {step === 2 && "Verify OTP"}
          {step === 3 && "Profile Info"}
          {step === 4 && "All Set!"}
        </h2>

        {error && (
          <div className="bg-[#EDF5FF] text-[#005EB8] border border-[#B3D9FF] p-2 mb-4 rounded text-sm text-center font-medium">
            {error}
          </div>
        )}

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M2 4a2 2 0 012-2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2 0v.01l8 5 8-5V4H4zm16 2.236l-8 5-8-5V20h16V6.236z" />
                </svg>
              </span>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="pl-10 w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
              />
            </div>
            <button type="submit" className={buttonClass}>
              Send OTP
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div className="flex gap-3 justify-center">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputsRef.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                  className="w-12 h-12 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#005EB8] text-xl font-semibold"
                />
              ))}
            </div>
            <button type="submit" className={buttonClass}>
              Verify OTP
            </button>
            <button
              type="button"
              disabled={resendTimer > 0}
              onClick={generateOtp}
              className="w-full text-xs text-gray-500 hover:text-gray-700 transition"
            >
              Resend OTP {resendTimer > 0 ? `in ${resendTimer}s` : ""}
            </button>
          </form>
        )}

        {/* Step 3: Profile */}
        {step === 3 && (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter Full Name" value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#005EB8]"
            />
            <label className="w-full flex items-center gap-3 px-4 py-2 border border-gray-300 rounded cursor-pointer hover:border-[#00A9E0] transition text-[#005EB8] font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-[#005EB8]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h2l2-3h8l2 3h2a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z" />
                <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth={2} fill="none" />
              </svg>
              <span>Upload Profile Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </label>

            <button type="submit" className={buttonClass}>
              Complete Registration
            </button>
          </form>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="text-center space-y-4">
            <p className="text-[#00A9E0] font-bold text-xl">✅ Registration Complete!</p>
            <p className="text-sm text-gray-600">Redirecting to dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultistepForm;
