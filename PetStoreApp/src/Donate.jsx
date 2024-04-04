import React, { useState } from "react";
import Navbar from "./components/Navbar";
import "./index.css"; // Import CSS file for styling

function Donate() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [shelter, setShelter] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [emailError, setEmailError] = useState("");
  const [shelterError, setShelterError] = useState("")
  const [amountError, setAmountError] = useState("");
  const [reasonError, setReasonError] = useState("");

  const onButtonClick = () => {
    preventDefault(); // Prevent default form submission

    // Validate form fields
    let isValid = true;

    if (!email) {
      setEmailError("Please enter your email");
      isValid = false;
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError("Please enter a valid email");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!shelter) {
      setShelterError("Please enter a target shelter.");
      isValid = false;
    } else {
      setShelterError("");
    }

    if (!amount) {
      setAmountError("Please enter the amount to donate");
      isValid = false;
    } else {
      setAmountError("");
    }

    if (!reason) {
      setReasonError("Please enter why you want to donate");
      isValid = false;
    } else {
      setReasonError("");
    }

    // Proceed w submission if all fields are valid
    if (isValid) {
      // Perform further actions, such as submitting form data
    }
  };
 
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <main className="donate-container">
        <form>
          <div className="form-group"> 
            <input
              type="name"
              id="name"
              name="name"
              className="form-control" 
              placeholder="Name"
            />
          </div>
          <div className="form-group"> 
            <input
              type="email"
              id="email"
              name="email"
              className="form-control" 
              placeholder="Email"
              required
            />
          </div>
          <div className="form-group"> 
            <input
              type="shelter"
              id="shelter"
              name="shelter"
              className="form-control" 
              placeholder="Target Shelter"
              required
            />
          </div>
          <div className="form-group"> 
            <input
              type="text"
              className="form-control" 
              placeholder="Amount to donate"
              required
            />
          </div>
          <div className="form-group"> 
            <textarea
              className="form-control" 
              placeholder="Why did you donate?"
              rows="5" 
              required
            />
          </div>
          <div className="form-group"> 
            <button type="submit" className="btn btn-primary" onClick={onButtonClick}>Donate</button> 
          </div>
        </form>
      </main>
    </div>
  );
}

export default Donate;
