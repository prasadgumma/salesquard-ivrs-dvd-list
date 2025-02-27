import React, { useState } from "react";
import IvrsDidListTable from "./Components/Ivrs-did-list/Ivrs-did-table";
import FilterDrawer from "./Components/Ivrs-did-list/filter-button-drower";

const App = () => {
  const [filteredData, setFilteredData] = useState([]);
  console.log(filteredData, "APPdata");

  const handleFilter = (data) => {
    setFilteredData(data);
  };

  return (
    <div>
      <FilterDrawer onFilter={handleFilter} />
      <IvrsDidListTable filteredData={filteredData} />
    </div>
  );
};

export default App;
