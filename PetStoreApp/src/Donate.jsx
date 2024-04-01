import React from "react";
import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js";
import Navbar from "./components/Navbar";

function Donate() {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <main>
        <form>
        <div>
            <input
              type="name"
              id="name"
              name="name"
              placeholder="Name"
            />
          </div>
          <div>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Why did you donate?"
              required
            />
          </div>
          <div>
            <input type="Submit" value="Donate" />
          </div>
        </form>
      </main>
    </div>
  );
}

export default Donate;
