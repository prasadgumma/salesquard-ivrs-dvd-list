import React, { createContext, useEffect, useState } from "react";

// Create Context
export const FilterContext = createContext();

// Context Provider Component
const FilterProvider = ({ children, tableDidData }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (tableDidData) {
      setData(tableDidData);
    }
  }, [tableDidData]);

  return (
    <FilterContext.Provider value={{ data, setData }}>
      {children}
    </FilterContext.Provider>
  );
};

export default FilterProvider;
