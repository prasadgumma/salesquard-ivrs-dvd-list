// API Integration

import React, { useContext, useState } from "react";
import { Box, Select, MenuItem, Typography, Modal } from "@mui/material";
import ChangeValidityModel from "./Change-validity";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import RouteChangeModel from "./Route-Change";
import SuspendAndResumeConfirmation from "./Suspend-Resume-Confirmation";
import { FilterContext } from "../context/FilterProvider";

const TableBottomActions = ({
  selectedRows,
  setSelectedRows,
  setSelectedIvrsRows,
  selectedIvrsRows,
}) => {
  const { data, setData } = useContext(FilterContext);
  const [selectedOption, setSelectedOption] = useState("");
  const [openSelection, setOpenSelection] = useState(false);

  // When an action is selected, open the modal
  const handleOpenSelection = (value) => {
    setSelectedOption(value);
    setOpenSelection(true);
  };

  const handleCloseSelection = () => {
    setSelectedOption("");
    setOpenSelection(false);
  };

  // Callback for status update
  const handleStatusUpdate = (status, description) => {
    console.log(`Action Updated: ${status}, Description: ${description}`);
    // Additional actions after the status update can go here.
  };

  // Render the modal's inner component based on the selected action
  const renderComponent = () => {
    switch (selectedOption) {
      case "changeValidity":
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ChangeValidityModel
              onClose={handleCloseSelection}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              selectedIvrsRows={selectedIvrsRows}
              setSelectedIvrsRows={setSelectedIvrsRows}
              data={data}
              setData={setData}
            />
          </LocalizationProvider>
        );
      case "changeRoute":
        return (
          <RouteChangeModel
            onClose={handleCloseSelection}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            selectedIvrsRows={selectedIvrsRows}
            setSelectedIvrsRows={setSelectedIvrsRows}
            data={data}
            setData={setData}
          />
        );
      case "updateStatus":
        return (
          <SuspendAndResumeConfirmation
            open={openSelection}
            onClose={handleCloseSelection}
            onUpdate={handleStatusUpdate}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            selectedIvrsRows={selectedIvrsRows}
            setSelectedIvrsRows={setSelectedIvrsRows}
            data={data}
            setData={setData}
          />
        );
      default:
        return <Typography>No Component</Typography>;
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2}>
        <Select
          value={selectedOption}
          onChange={(e) => handleOpenSelection(e.target.value)}
          displayEmpty
          variant="outlined"
          size="small"
          sx={{ minWidth: 200 }}
          MenuProps={{
            anchorOrigin: { vertical: "top", horizontal: "left" },
            transformOrigin: { vertical: "bottom", horizontal: "left" },
          }}
        >
          <MenuItem value="" disabled>
            Select Actions
          </MenuItem>
          <MenuItem value="changeValidity">Change Validity</MenuItem>
          <MenuItem value="changeRoute">Change Route</MenuItem>
          <MenuItem value="updateStatus">Update Action Status</MenuItem>
        </Select>
      </Box>

      <Modal open={openSelection} onClose={handleCloseSelection}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 3,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          {renderComponent()}
        </Box>
      </Modal>
    </Box>
  );
};

export default TableBottomActions;
