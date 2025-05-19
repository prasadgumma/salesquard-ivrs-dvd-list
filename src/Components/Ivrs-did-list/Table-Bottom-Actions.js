// API Integration

import React, { useContext, useState } from "react";
import {
  Box,
  Select,
  MenuItem,
  Typography,
  Modal,
  IconButton,
} from "@mui/material";
import ChangeValidityModel from "./Change-validity";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import RouteChangeModel from "./Route-Change";
import SuspendAndResumeConfirmation from "./Suspend-Resume-Confirmation";
import { FilterContext } from "../context/FilterProvider";
import { CancelRounded } from "@mui/icons-material";

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
              width: 400,
            }}
          >
            <RouteChangeModel
              onClose={handleCloseSelection}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              selectedIvrsRows={selectedIvrsRows}
              setSelectedIvrsRows={setSelectedIvrsRows}
              data={data}
              setData={setData}
            />
          </Box>
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
    // <Box>
    //   <Box display="flex" alignItems="center" gap={2}>
    //     <Select
    //       value={selectedOption}
    //       onChange={(e) => handleOpenSelection(e.target.value)}
    //       displayEmpty
    //       variant="outlined"
    //       size="small"
    //       sx={{ minWidth: 200, bgcolor: "white" }}
    //       MenuProps={{
    //         anchorOrigin: { vertical: "top", horizontal: "left" },
    //         transformOrigin: { vertical: "bottom", horizontal: "left" },
    //       }}
    //     >
    //       <MenuItem value="" disabled sx={{ color: "#000", fontWeight: 600 }}>
    //         Select Actions
    //       </MenuItem>
    //       <MenuItem
    //         value="changeValidity"
    //         sx={{ color: "#000", fontWeight: 600 }}
    //       >
    //         Change Validity
    //       </MenuItem>
    //       <MenuItem value="changeRoute">Change Route</MenuItem>
    //       <MenuItem value="updateStatus">Change Status</MenuItem>
    //     </Select>
    //   </Box>

    //   <Modal open={openSelection}>
    //     <Box
    //       sx={{
    //         position: "absolute",
    //         top: "50%",
    //         left: "50%",
    //         transform: "translate(-50%, -50%)",
    //         bgcolor: "white",
    //         p: 1,
    //         borderRadius: 2,
    //         boxShadow: 24,
    //       }}
    //     >
    //       <Box sx={{ display: "flex", justifyContent: "end" }}>
    //         <IconButton onClick={handleCloseSelection}>
    //           <CancelRounded />
    //         </IconButton>
    //       </Box>
    //       {renderComponent()}
    //     </Box>
    //   </Modal>
    // </Box>
    <Box>
      <Box display="flex" alignItems="center" gap={2}>
        <Select
          value={selectedOption}
          onChange={(e) => handleOpenSelection(e.target.value)}
          displayEmpty
          variant="outlined"
          size="small"
          sx={{
            minWidth: 240,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 2,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#1976d2",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#115293",
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: "#f9f9f9",
                mt: 1,
                borderRadius: 2,
                boxShadow: 3,
              },
            },
            anchorOrigin: { vertical: "bottom", horizontal: "left" },
            transformOrigin: { vertical: "top", horizontal: "left" },
          }}
        >
          <MenuItem value="" disabled sx={{ color: "#555", fontWeight: 500 }}>
            Select Actions
          </MenuItem>

          {[
            { value: "changeValidity", label: "Change Validity" },
            { value: "changeRoute", label: "Change Route" },
            { value: "updateStatus", label: "Change Status" },
          ].map((item) => (
            <MenuItem
              key={item.value}
              value={item.value}
              sx={{
                color: selectedOption === item.value ? "#fff" : "#000",
                bgcolor:
                  selectedOption === item.value ? "#1976d2" : "transparent",
                fontWeight: selectedOption === item.value ? 600 : 500,
                "&:hover": {
                  bgcolor:
                    selectedOption === item.value ? "#1565c0" : "#e3f2fd",
                },
                borderRadius: 1,
                mx: 1,
              }}
            >
              {item.label}
            </MenuItem>
          ))}
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
            borderRadius: 3,
            boxShadow: 24,
            minWidth: 400,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={handleCloseSelection}>
              <CancelRounded sx={{ color: "#1976d2" }} />
            </IconButton>
          </Box>

          {/* Render your dynamic content here */}
          {renderComponent()}
        </Box>
      </Modal>
    </Box>
  );
};

export default TableBottomActions;
