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

// const Component4 = ({ handleClose }) => (
//   <Box>
//     <Typography>Component 4 Content</Typography>
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
// const Component5 = ({ handleClose }) => (
//   <Box>
//     <Typography>Component 5 Content</Typography>
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

//   // Modal open/close handlers
//   const handleOpenSelection = () => setOpenSelection(true);
//   const handleCloseSelection = () => {
//     setSelectedOption("");
//     setOpenSelection(false);
//   };

//   // Component mapping
//   const componentMap = {
//     value1: (
//       <LocalizationProvider dateAdapter={AdapterDateFns}>
//         <ChangeValidityModel onClose={handleCloseSelection} />
//       </LocalizationProvider>
//     ),
//     value2: <RouteChangeModel onClose={handleCloseSelection} />,
//     value3: <SuspendAndResumeConfirmation />,
//     value4: <Component4 handleClose={handleCloseSelection} />,
//     value5: <Component5 handleClose={handleCloseSelection} />,
//   };

//   return (
//     <Box
//     //   display="flex"
//     //   justifyContent="space-between"
//     //   mb={2}
//     //   p={2}
//     //   bgcolor="#d6d4d4"
//     //   borderRadius={2}
//     //   gap={2}
//     //   sx={{
//     //     ml: 1,
//     //     position: "fixed",

//     //     bottom: 0,
//     //     left: 0,
//     //     width: "98%",
//     //     boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
//     //     padding: "10px",
//     //     // zIndex: 1000,
//     //   }}
//     >
//       <Box display="flex" alignItems="center" gap={2}>
//         {/* <Typography>Select Option:</Typography> */}
//         <Select
//           value={selectedOption}
//           onChange={(e) => {
//             setSelectedOption(e.target.value);
//             handleOpenSelection();
//           }}
//           displayEmpty
//           variant="outlined"
//           size="small"
//           sx={{ minWidth: 200 }}
//           MenuProps={{
//             anchorOrigin: {
//               vertical: "top",
//               horizontal: "left",
//             },
//             transformOrigin: {
//               vertical: "bottom",
//               horizontal: "left",
//             },
//           }}
//         >
//           <MenuItem value="" disabled>
//             Select Actions
//           </MenuItem>
//           <MenuItem value="value1">Change Validity</MenuItem>
//           <MenuItem value="value2">Change Root</MenuItem>
//           <MenuItem value="value3">Suspend Action</MenuItem>
//           <MenuItem value="value4">Resume Action</MenuItem>
//           <MenuItem value="value5">Dummy</MenuItem>
//         </Select>
//       </Box>

//       {/* Selection Modal */}
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

//       {/* Delete Confirmation Modal */}
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
import SuspendAndResumeConfirmation from "./All-Suspend-Resume";

const Component4 = ({ handleClose }) => (
  <Box>
    <Typography>Resume Action</Typography>
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

  // Modal open/close handlers
  const handleOpenSelection = () => setOpenSelection(true);
  const handleCloseSelection = () => {
    setSelectedOption("");
    setOpenSelection(false);
  };

  // Dynamic type for Suspend & Resume (1 for Resume, 0 for Suspend)
  const suspendResumeType = selectedOption === "value3" ? 0 : 1;

  // Component mapping
  const componentMap = {
    value1: (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ChangeValidityModel onClose={handleCloseSelection} />
      </LocalizationProvider>
    ),
    value2: <RouteChangeModel onClose={handleCloseSelection} />,
    value3: (
      <SuspendAndResumeConfirmation
        open={openSelection}
        onClose={handleCloseSelection}
        type={suspendResumeType} // 0 for Suspend
        name="Selected User"
        description=""
        onDescriptionChange={() => {}}
        onUpdate={() => {
          alert("Suspend action updated!");
          handleCloseSelection();
        }}
      />
    ),
    value4: (
      <SuspendAndResumeConfirmation
        open={openSelection}
        onClose={handleCloseSelection}
        type={suspendResumeType} // 1 for Resume
        name="Selected User"
        description=""
        onDescriptionChange={() => {}}
        onUpdate={() => {
          alert("Resume action updated!");
          handleCloseSelection();
        }}
      />
    ),
    value5: <Component5 handleClose={handleCloseSelection} />,
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2}>
        <Select
          value={selectedOption}
          onChange={(e) => {
            setSelectedOption(e.target.value);
            handleOpenSelection();
          }}
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
          <MenuItem value="value2">Change Root</MenuItem>
          <MenuItem value="value3">Suspend Action</MenuItem>
          <MenuItem value="value4">Resume Action</MenuItem>
          <MenuItem value="value5">Dummy</MenuItem>
        </Select>
      </Box>

      {/* Selection Modal */}
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
          {componentMap[selectedOption] || (
            <Typography>No Component</Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default TableBottomActions;
