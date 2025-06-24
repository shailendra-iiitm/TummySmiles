// src/components/PhoneLogin.jsx
import React, { useState } from 'react';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { firebaseApp } from '../firebase'; // your config file

const PhoneLogin = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [step, setStep] = useState('phone');

  const auth = getAuth(firebaseApp); // ✅ must be INSIDE the component

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          console.log("reCAPTCHA solved");
        }
      });
    }
  };

  const sendOtp = async () => {
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setStep('otp');
    } catch (err) {
      console.error(err);
      alert("OTP sending failed");
    }
  };

  const verifyOtp = async () => {
    try {
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();

      const res = await fetch("http://localhost:5000/api/auth/firebase-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      if (data.user.role === 'admin') {
        window.location.href = "/admin";
      } else if (data.user.role === 'agent') {
        window.location.href = "/agent";
      } else {
        window.location.href = "/donor";
      }

    } catch (err) {
      alert("Incorrect OTP");
    }
  };

  return (
    <div className="p-4">
      {step === 'phone' && (
        <>
          <input
            type="tel"
            placeholder="+91XXXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2"
          />
          <button onClick={sendOtp} className="ml-2 bg-blue-500 text-white px-4 py-2">Send OTP</button>
        </>
      )}

      {step === 'otp' && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2"
          />
          <button onClick={verifyOtp} className="ml-2 bg-green-500 text-white px-4 py-2">Verify OTP</button>
        </>
      )}

      <div id="recaptcha-container"></div>
    </div>
  );
};

export default PhoneLogin;
