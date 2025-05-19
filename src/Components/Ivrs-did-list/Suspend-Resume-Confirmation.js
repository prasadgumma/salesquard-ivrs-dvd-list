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
// import toast from "react-hot-toast"; // Import only toast, not Toaster

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
//     if (!status) {
//       toast.error("Please select a status!");
//       return;
//     }
//     if (!description.trim()) {
//       toast.error("Description is required!");
//       return;
//     }

//     const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);
//     const k1Value = status === "resumed" ? 1 : 2;

//     const keys =
//       selectedIvrsRows && selectedIvrsRows.length > 0
//         ? selectedIvrsRows
//         : selectedRows;

//     if (!keys || keys.length === 0) {
//       toast.error("No valid row selected.");
//       return;
//     }

//     const payload = {
//       lml: "67a455659d796",
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
//         onClose();
//         toast.success(`Action Changed as ${displayStatus} successfully!`);

//         setData((prevData) =>
//           prevData.map((row) =>
//             keys.includes(row.ivrsduniq)
//               ? {
//                   ...row,
//                   stat: k1Value,
//                   sdes: description,
//                   sudt: new Date().toLocaleString(),
//                 }
//               : row
//           )
//         );

//         setSelectedIvrsRows([]);
//         setSelectedRows([]);
//         onUpdate(status, description);
//         setDescription("");
//         setStatus("");
//       } else {
//         toast.error(`Error updating status: ${response.statusText}`);
//       }
//     } catch (error) {
//       toast.error(`Network error: ${error.message}`);
//     }
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
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
  Box,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  Stack,
  Chip,
  IconButton,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import { CheckCircle, Cancel, CancelOutlined } from "@mui/icons-material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 440,
  bgcolor: "rgb(255, 255, 255)",
  borderRadius: "16px",
  backdropFilter: "blur(12px)",
  boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
  p: 4,
  transition: "all 0.3s ease-in-out",
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

  const handleUpdate = async () => {
    if (!status) {
      toast.error("Please select a status!");
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
      lml: "67a455659d796",
      k1: k1Value,
      des: description || "",
      k: keys,
    };

    try {
      const response = await axios.post(
        `${apiurl}/v1/ivrs_did_suspend_multiple`,
        payload
      );

      if (response.status === 200 && response.data?.resp?.error_code === "0") {
        toast.success(`Action changed to ${displayStatus} successfully!`);

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
        if (onUpdate) onUpdate(status, description);
        onClose();
      } else {
        toast.error(`Failed to update status`);
      }
    } catch (error) {
      toast.error(`Network error: ${error.message}`);
    }
  };
  const handleCancel = () => {
    onClose();
  };

  return (
    // <Modal open={open}>
    <Box sx={modalStyle}>
      <IconButton
        onClick={handleCancel}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: "#000",
        }}
      >
        <CancelOutlined />
      </IconButton>

      <Typography variant="h5" fontWeight="600" mb={2}>
        🔄 Update IVRS Status
      </Typography>

      <FormControl fullWidth margin="normal" size="small">
        <InputLabel id="status-label">Choose Status</InputLabel>
        <Select
          labelId="status-label"
          value={status}
          label="Choose Status"
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="resumed">
            <Chip
              icon={<CheckCircle color="success" />}
              label="Resumed"
              color="success"
              variant="contained"
            />
          </MenuItem>
          <MenuItem value="suspended">
            <Chip
              icon={<Cancel color="error" />}
              label="Suspended"
              color="error"
              variant="contained"
            />
          </MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Optional Description"
        placeholder="Add context or notes (optional)"
        multiline
        rows={4}
        fullWidth
        margin="normal"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        variant="outlined"
      />

      <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdate}
          sx={{ textTransform: "capitalize", borderRadius: 2 }}
        >
          Confirm
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            setDescription("");
            setStatus("");
            onClose();
          }}
          sx={{ textTransform: "capitalize", borderRadius: 2 }}
        >
          Cancel
        </Button>
      </Stack>
    </Box>
    // </Modal>
  );
};

export default SuspendAndResumeConfirmation;
