// import React, { useState, useEffect } from "react";
// import {
//   Modal,
//   Box,
//   Typography,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextField,
//   Button,
// } from "@mui/material";
// import axios from "axios";
// import toast from "react-hot-toast";
// // import toast, { Toaster } from "react-hot-toast";

// const modalStyle = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   borderRadius: 2,
//   boxShadow: 24,
//   p: 4,
// };

// const SuspendAndResumeConfirmation = ({
//   open,
//   onClose,
//   onUpdate,
//   selectedRows,
//   setSelectedRows,
//   selectedIvrsRows,
//   setSelectedIvrsRows,
//   setData,
// }) => {
//   const [description, setDescription] = useState("");
//   const [status, setStatus] = useState("");

//   const apiurl = process.env.REACT_APP_API_URL;

//   useEffect(() => {
//     if (!open) {
//       setDescription("");
//       setStatus("");
//     }
//   }, [open]);

//   const handleStatusChange = (event) => {
//     setStatus(event.target.value);
//   };

//   const handleDescriptionChange = (event) => {
//     setDescription(event.target.value);
//   };

//   const handleUpdate = async () => {
//     // Validate that a status is selected and description is provided.
//     // if (!status) {
//     //   alert("Please select a status!");
//     //   return;
//     // }
//     // if (!description.trim()) {
//     //   alert("Description is required!");
//     //   return;
//     // }

//     if (!status) {
//       toast.error("Please select a status!");
//       return;
//     }
//     if (!description.trim()) {
//       toast.error("Description is required!");
//       return;
//     }

//     // Capitalize the first letter for display (e.g., "Resumed", "Suspended")
//     const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);
//     // If current action is "resumed", then k1Value = 1; otherwise if "suspended", then k1Value = 2.
//     const k1Value = status === "resumed" ? 1 : 2;

//     // Use `selectedIvrsRows` if available; otherwise, fall back to `selectedRows`.
//     const keys =
//       selectedIvrsRows && selectedIvrsRows.length > 0
//         ? selectedIvrsRows
//         : selectedRows;

//     if (!keys || keys.length === 0) {
//       // alert("No valid row selected.");
//       return;
//     }

//     // Build the payload as before.
//     const payload = {
//       lml: "67f4e66b5b27d",
//       k1: k1Value,
//       des: description,
//       k: keys,
//     };

//     try {
//       const response = await axios.post(
//         `${apiurl}/v1/ivrs_did_suspend_multiple`,
//         payload
//       );

//       if (response.status === 200) {
//         // alert(`Action marked as ${displayStatus} successfully!`);
//         toast.success(`Action marked as ${displayStatus} successfully!`);

//         // Immediately update local state:
//         // Here we update the rows that match the selected keys.
//         setData((prevData) =>
//           prevData.map((row) =>
//             keys.includes(row.ivrsduniq)
//               ? {
//                   ...row,
//                   stat: k1Value, // Update status (ensure UI uses this key)
//                   sdes: description, // Set new description
//                   sudt: new Date().toLocaleString(), // Update timestamp
//                 }
//               : row
//           )
//         );

//         // Clear the selected IVRS rows.
//         setSelectedIvrsRows([]);
//         setSelectedRows([]);
//         // Trigger any additional update callback.
//         onUpdate(status, description);

//         // Reset input fields.
//         setDescription("");
//         setStatus("");

//         // Close the modal.
//         onClose();
//       } else {
//         // alert(`Error updating status: ${response.statusText}`);
//         toast.error(`Error updating status: ${response.statusText}`);
//       }
//     } catch (error) {
//       // alert(`Network error: ${error.message}`);
//       toast.error(`Network error: ${error.message}`);
//     }
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
//       {/* <Toaster position="top-right" /> */}
//       <Box sx={modalStyle}>
//         <Typography variant="h6" component="h2" mb={2}>
//           Update Action Status
//         </Typography>

//         <FormControl fullWidth margin="dense">
//           <InputLabel id="status-label">Status</InputLabel>
//           <Select
//             labelId="status-label"
//             value={status}
//             label="Status"
//             onChange={handleStatusChange}
//           >
//             <MenuItem value="resumed">Resumed</MenuItem>
//             <MenuItem value="suspended">Suspended</MenuItem>
//           </Select>
//         </FormControl>

//         <TextField
//           fullWidth
//           label="Description"
//           value={description}
//           onChange={handleDescriptionChange}
//           required
//           multiline
//           rows={3}
//           margin="dense"
//         />

//         <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
//           <Button variant="contained" color="primary" onClick={handleUpdate}>
//             Update
//           </Button>
//           <Button
//             variant="contained"
//             color="error"
//             onClick={() => {
//               setDescription("");
//               setStatus("");
//               onClose();
//             }}
//           >
//             Close
//           </Button>
//         </Box>
//       </Box>
//     </Modal>
//   );
// };

// export default SuspendAndResumeConfirmation;

import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast"; // Import only toast, not Toaster

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const SuspendAndResumeConfirmation = ({
  open,
  onClose,
  onUpdate,
  selectedRows,
  setSelectedRows,
  selectedIvrsRows,
  setSelectedIvrsRows,
  setData,
}) => {
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const apiurl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!open) {
      setDescription("");
      setStatus("");
    }
  }, [open]);

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleUpdate = async () => {
    if (!status) {
      toast.error("Please select a status!");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required!");
      return;
    }

    const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);
    const k1Value = status === "resumed" ? 1 : 2;

    const keys =
      selectedIvrsRows && selectedIvrsRows.length > 0
        ? selectedIvrsRows
        : selectedRows;

    if (!keys || keys.length === 0) {
      toast.error("No valid row selected.");
      return;
    }

    const payload = {
      lml: "67f4e66b5b27d",
      k1: k1Value,
      des: description,
      k: keys,
    };

    try {
      const response = await axios.post(
        `${apiurl}/v1/ivrs_did_suspend_multiple`,
        payload
      );

      if (response.status === 200) {
        onClose();
        toast.success(`Action Changed as ${displayStatus} successfully!`);

        setData((prevData) =>
          prevData.map((row) =>
            keys.includes(row.ivrsduniq)
              ? {
                  ...row,
                  stat: k1Value,
                  sdes: description,
                  sudt: new Date().toLocaleString(),
                }
              : row
          )
        );

        setSelectedIvrsRows([]);
        setSelectedRows([]);
        onUpdate(status, description);
        setDescription("");
        setStatus("");
      } else {
        toast.error(`Error updating status: ${response.statusText}`);
      }
    } catch (error) {
      toast.error(`Network error: ${error.message}`);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" mb={2}>
          Update Action Status
        </Typography>

        <FormControl fullWidth margin="dense">
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            value={status}
            label="Status"
            onChange={handleStatusChange}
          >
            <MenuItem value="resumed">Resumed</MenuItem>
            <MenuItem value="suspended">Suspended</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={handleDescriptionChange}
          required
          multiline
          rows={3}
          margin="dense"
        />

        <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Update
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setDescription("");
              setStatus("");
              onClose();
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SuspendAndResumeConfirmation;
