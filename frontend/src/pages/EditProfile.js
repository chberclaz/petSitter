import React from "react";

const EditProfile = () => {
  return (
    <div>
      <h1>Edit Profile</h1>
      <form>
        <div>
          <label>First Name:</label>
          <input type="text" placeholder="Enter your first name" />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" placeholder="Enter your last name" />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" placeholder="Enter your email" />
        </div>
        <div>
          <label>Phone:</label>
          <input type="tel" placeholder="Enter your phone number" />
        </div>
        <div>
          <label>Bio:</label>
          <textarea placeholder="Tell us about yourself"></textarea>
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;
