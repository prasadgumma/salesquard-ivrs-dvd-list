// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   Select,
//   MenuItem,
//   Typography,
//   Modal,
// } from "@mui/material";
// import ChangeValidityModel from "./Change-validity";
// import { LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import RouteChangeModel from "./Route-Change";
// import SuspendAndResumeConfirmation from "./All-Suspend-Resume";

// const Component5 = ({ handleClose }) => (
//   <Box>
//     <Typography>Dummy Action</Typography>
//     <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
//       <Button onClick={handleClose} variant="contained" color="primary">
//         Submit
//       </Button>
//       <Button onClick={handleClose} variant="outlined" color="secondary">
//         Cancel
//       </Button>
//     </Box>
//   </Box>
// );

// const TableBottomActions = ({ selectedRows }) => {
//   const [selectedOption, setSelectedOption] = useState("");
//   const [openSelection, setOpenSelection] = useState(false);
//   const [suspendResumeType, setSuspendResumeType] = useState(null);

//   const handleOpenSelection = (value) => {
//     setSelectedOption(value);
//     setSuspendResumeType(
//       value === "value3" ? 0 : value === "value4" ? 1 : null
//     );
//     setOpenSelection(true);
//   };

//   const handleCloseSelection = () => {
//     setSelectedOption("");
//     setOpenSelection(false);
//   };

//   const handleSuspendResumeUpdate = (description) => {
//     console.log(`Action Updated with Description: ${description}`);
//   };

//   const componentMap = {
//     value1: (
//       <LocalizationProvider dateAdapter={AdapterDateFns}>
//         <ChangeValidityModel onClose={handleCloseSelection} />
//       </LocalizationProvider>
//     ),
//     value2: <RouteChangeModel onClose={handleCloseSelection} />,
//     value3: (
//       <SuspendAndResumeConfirmation
//         open={openSelection}
//         onClose={handleCloseSelection}
//         type={suspendResumeType}
//         name="Selected User"
//         onUpdate={handleSuspendResumeUpdate}
//       />
//     ),
//     value4: (
//       <SuspendAndResumeConfirmation
//         open={openSelection}
//         onClose={handleCloseSelection}
//         type={suspendResumeType}
//         name="Selected User"
//         onUpdate={handleSuspendResumeUpdate}
//       />
//     ),
//     value5: <Component5 handleClose={handleCloseSelection} />,
//   };

//   return (
//     <Box>
//       <Box display="flex" alignItems="center" gap={2}>
//         <Select
//           value={selectedOption}
//           onChange={(e) => handleOpenSelection(e.target.value)}
//           displayEmpty
//           variant="outlined"
//           size="small"
//           sx={{ minWidth: 200 }}
//           MenuProps={{
//             anchorOrigin: { vertical: "top", horizontal: "left" },
//             transformOrigin: { vertical: "bottom", horizontal: "left" },
//           }}
//         >
//           <MenuItem value="" disabled>
//             Select Actions
//           </MenuItem>
//           <MenuItem value="value1">Change Validity</MenuItem>
//           <MenuItem value="value2">Change Route</MenuItem>
//           <MenuItem value="value3">Suspend Action</MenuItem>
//           <MenuItem value="value4">Resume Action</MenuItem>
//           <MenuItem value="value5">Dummy</MenuItem>
//         </Select>
//       </Box>

//       <Modal open={openSelection} onClose={handleCloseSelection}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             bgcolor: "white",
//             p: 3,
//             borderRadius: 2,
//             boxShadow: 24,
//           }}
//         >
//           {componentMap[selectedOption] || (
//             <Typography>No Component</Typography>
//           )}
//         </Box>
//       </Modal>
//     </Box>
//   );
// };

// export default TableBottomActions;

import React, { useState } from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  Typography,
  Modal,
} from "@mui/material";
import ChangeValidityModel from "./Change-validity";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import RouteChangeModel from "./Route-Change";
import SuspendAndResumeConfirmation from "./Suspend-Resume-Confirmation";

const Component5 = ({ handleClose }) => (
  <Box>
    <Typography>Dummy Action</Typography>
    <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
      <Button onClick={handleClose} variant="contained" color="primary">
        Submit
      </Button>
      <Button onClick={handleClose} variant="outlined" color="secondary">
        Cancel
      </Button>
    </Box>
  </Box>
);

const TableBottomActions = ({ selectedRows }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [openSelection, setOpenSelection] = useState(false);
  const [suspendResumeType, setSuspendResumeType] = useState(null);

  const handleOpenSelection = (value) => {
    setSelectedOption(value);
    setSuspendResumeType(
      value === "value3" ? 0 : value === "value4" ? 1 : null
    );
    setOpenSelection(true);
  };

  const handleCloseSelection = () => {
    setSelectedOption("");
    setOpenSelection(false);
  };

  const handleSuspendResumeUpdate = (description) => {
    console.log(`Action Updated with Description: ${description}`);
  };

  // Function to render the component based on selected option
  const renderComponent = () => {
    switch (selectedOption) {
      case "value1":
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ChangeValidityModel onClose={handleCloseSelection} />
          </LocalizationProvider>
        );
      case "value2":
        return <RouteChangeModel onClose={handleCloseSelection} />;
      case "value3":
      case "value4":
        return (
          <SuspendAndResumeConfirmation
            open={openSelection}
            onClose={handleCloseSelection}
            type={suspendResumeType}
            name="Selected User"
            onUpdate={handleSuspendResumeUpdate}
          />
        );
      case "value5":
        return <Component5 handleClose={handleCloseSelection} />;
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
          <MenuItem value="value1">Change Validity</MenuItem>
          <MenuItem value="value2">Change Route</MenuItem>
          <MenuItem value="value3">Suspend Action</MenuItem>
          <MenuItem value="value4">Resume Action</MenuItem>
          <MenuItem value="value5">Dummy</MenuItem>
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
