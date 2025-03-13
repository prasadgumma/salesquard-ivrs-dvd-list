import React from "react";
import IvrsDidListTable from "./Components/Ivrs-did-list/Ivrs-did-table";
import FilterDrawer from "./Components/Ivrs-did-list/filter-button-drower";
import FilterProvider from "./Components/context/FilterProvider";

const App = () => {
  return (
    <FilterProvider>
      <div>
        <FilterDrawer />
        <IvrsDidListTable />
      </div>
    </FilterProvider>
  );
};

export default App;
