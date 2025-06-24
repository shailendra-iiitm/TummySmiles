// src/components/PhoneLogin.jsx
import { useState } from 'react';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { firebaseApp } from '../firebase';
import axios from 'axios';

const auth = getAuth(firebaseApp);

const PhoneLogin = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [step, setStep] = useState('phone');

const setupRecaptcha = () => {
  window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
    size: 'invisible'
  }, auth);
};



  const sendOtp = async () => {
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setStep('otp');
    } catch (err) {
      alert(err.message);
    }
  };

  const verifyOtp = async () => {
    try {
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();

      const res = await axios.post('http://localhost:5000/api/auth/firebase-login', { idToken });
      const { token, user } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      
      // Redirect to dashboard based on role
      if (user.role === 'admin') {
        window.location.href = '/admin';
      } else if (user.role === 'agent') {
        window.location.href = '/agent';
      } else {
        window.location.href = '/donor';
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const logout = () => {
  localStorage.clear();
  window.location.href = "/";
  };



  return (
    <div>
      {step === 'phone' && (
        <div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter Phone Number"
            className="border p-2"
          />
          <button onClick={sendOtp} className="ml-2 bg-blue-500 text-white px-4 py-2">Send OTP</button>
        </div>
      )}

      {step === 'otp' && (
        <div>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="border p-2"
          />
          <button onClick={verifyOtp} className="ml-2 bg-green-500 text-white px-4 py-2">Verify OTP</button>
        </div>
      )}

      <button onClick={logout} className="mt-4 bg-red-500 text-white px-4 py-2">Logout</button>
      

      <div id="recaptcha-container"></div>
    </div>
  );
};

export default PhoneLogin;
