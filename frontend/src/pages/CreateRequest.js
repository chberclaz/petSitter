import React from "react";

const CreateRequest = () => {
  return (
    <div>
      <h1>Create Sitting Request</h1>
      <form>
        <div>
          <label>Pet:</label>
          <select>
            <option value="">Select a pet</option>
            <option value="1">Buddy (Dog)</option>
            <option value="2">Whiskers (Cat)</option>
          </select>
        </div>
        <div>
          <label>Start Date:</label>
          <input type="date" />
        </div>
        <div>
          <label>End Date:</label>
          <input type="date" />
        </div>
        <div>
          <label>Notes:</label>
          <textarea placeholder="Any special instructions"></textarea>
        </div>
        <button type="submit">Create Request</button>
      </form>
    </div>
  );
};

export default CreateRequest;
