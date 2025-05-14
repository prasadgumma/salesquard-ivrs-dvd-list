import React from "react";
import IvrsDidListTable from "./Components/Ivrs-did-list/Ivrs-did-table";
import FilterDrawer from "./Components/Ivrs-did-list/filter-button-drower";
import FilterProvider from "./Components/context/FilterProvider";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <FilterProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#ffff",
            color: "#333",
            fontSize: "16px",
            padding: "12px 12px",
            borderRadius: "4px",
          },
          success: {
            iconTheme: {
              primary: "#4caf50",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#f44336",
              secondary: "#ffff",
            },
          },
        }}
      />
      <FilterDrawer />
      <IvrsDidListTable />
    </FilterProvider>
  );
};

export default App;
