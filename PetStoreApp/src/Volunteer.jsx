import React from "react";
import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js";
import Navbar from "./components/Navbar";

function Volunteer() {
  return (
    <div>
      <Navbar />
        <div className="container">
          <h3>Volunteer Form</h3>
          <form>
            <div>
              <input type="text" id="name" name="name" placeholder="Please enter your name" />
            </div>
            <div>
              <input type="text" id="contact" name="contact" placeholder="Please enter your contact information" />
            </div>
            <div>
              <input type="text" id="street-address" name="street-address" placeholder="Please enter your address" autoComplete="street-address" required enterkeyhint="next" />
            </div>
            <div>
              <input type="text" id="postal-code" name="postal-code" className="postal-code" autoComplete="postal-code" enterkeyhint="next" />
            </div>
            <div>
              <input type="text" id="city" name="city" placeholder="Please enter your city" autoComplete="address-level2" enterkeyhint="next" required />
            </div>
            <div>
              <select id="country" name="country" autoComplete="country" enterkeyhint="done" required>
                <option></option>
                <option value="AU">Australia</option>
                <option value="CA">Canada</option>
                <option value="US">United States</option>
              </select>
            </div>
            <div>
              <input type="date" id="birthday" name="birthday" />
            </div>
            <div>
              <select id="organization" name="organization" autoComplete="organization" enterkeyhint="done" required>
                <option>Please choose the organization you are volunteering at</option>
                <option value="org1">Org1</option>
                <option value="org2">Org2</option>
                <option value="org3">Org3</option>
              </select>
            </div>
            <div>
              <select id="task" name="task" autoComplete="task" enterkeyhint="done" required>
                <option>Please enter your preferred task</option>
                <option value="task1">Task1</option>
                <option value="task2">Task2</option>
                <option value="task3">Task3</option>
              </select>
            </div>
            <input type="submit" value="Submit" />
          </form>
        </div>
    </div>
  );
}

export default Volunteer;
