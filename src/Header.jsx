import React from "react";

import brand from "../images/brand.png";

const Header = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <img src={brand} style={{ width: "40%" }} />
    </div>
  );
};

export default Header;
