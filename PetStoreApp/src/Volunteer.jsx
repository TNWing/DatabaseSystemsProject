import React from "react";
import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js";
import Navbar from "./components/Navbar";
import "./styles.css";

function Volunteer() {
  return (
    <div>
      <Navbar />
        <div className="container">
          <h3>Volunteer Form</h3>
          <form>
            <div>
            <label for="name">First and Last Name</label>
              <input type="text" id="name" name="name" placeholder="Please enter your name" />
            </div>
            <div>
            <label for="contact">Contact Info</label>
              <input type="text" id="contact" name="contact" placeholder="Please enter your contact information" />
            </div>
            <div>
            <label for="street-address">Full Address</label>
              <input type="text" id="street-address" name="street-address" placeholder="Please enter your full address" autoComplete="street-address" required enterkeyhint="next" />
            </div>
            <div>
            <label for="birthday">Date of Birth </label>
            </div>
            <div>
              <input type="date" id="birthday" name="birthday" />
            </div>
            <div>
            <label for="organization">Organization</label>
              <select id="organization" name="organization" autoComplete="organization" enterkeyhint="done" required>
                <option>Please choose the organization you are volunteering at</option>
                <option value="org1">Org1</option>
                <option value="org2">Org2</option>
                <option value="org3">Org3</option>
              </select>
            </div>
            <div>
            <label for="task">Task</label>
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
