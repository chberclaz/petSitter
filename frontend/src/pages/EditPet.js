import React from "react";

const EditPet = () => {
  return (
    <div>
      <h1>Edit Pet</h1>
      <form>
        <div>
          <label>Name:</label>
          <input type="text" placeholder="Enter pet name" />
        </div>
        <div>
          <label>Type:</label>
          <select>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="bird">Bird</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label>Breed:</label>
          <input type="text" placeholder="Enter breed" />
        </div>
        <div>
          <label>Age:</label>
          <input type="number" placeholder="Enter age" />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditPet;
