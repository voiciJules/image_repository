import React from "react";

const CustomInput = ({
  label,
  value,
  setValue,
  type = "text",
  autocomplete = "off",
}) => {
  return (
    <div>
      <label>{label}</label>
      <input
        style={{ width: "100%" }}
        value={value}
        type={type}
        autoComplete={autocomplete}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default CustomInput;
