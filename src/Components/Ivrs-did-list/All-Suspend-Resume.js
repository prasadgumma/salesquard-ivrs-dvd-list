// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   TextField,
//   DialogActions,
//   Button,
//   Typography,
//   Box,
// } from "@mui/material";

// const SuspendAndResumeConfirmation = () => {
//   const [open, setOpen] = useState(true); // Always open
//   const [description, setDescription] = useState("");
//   const name = "John Doe"; // Static Name
//   const type = 0; // 1 for Resume, 0 for Suspend (Static Example)

//   const handleDescriptionChange = (event) => {
//     setDescription(event.target.value);
//   };

//   const handleUpdate = () => {
//     console.log("Updating with description:", description);
//     alert(`Action ${type === 1 ? "Resumed" : "Suspended"} Successfully!`);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     // <Box sx={{ p: 3, maxWidth: 600, margin: "auto", mt: 4 }}>
//     <Dialog open={open}>
//       <DialogTitle>
//         {type === 1 ? "Resume Confirmation" : "Suspend Confirmation"}
//       </DialogTitle>
//       <DialogContent>
//         <TextField
//           fullWidth
//           label="Name"
//           value={name}
//           InputProps={{ readOnly: true }}
//           margin="dense"
//         />
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
//         <Typography sx={{ mt: 2, fontWeight: "bold", textAlign: "center" }}>
//           {type === 1 ? "Do you want to Resume?" : "Do you want to Suspend?"}
//         </Typography>
//       </DialogContent>
//       <DialogActions>
//         <Button variant="contained" color="primary" onClick={handleUpdate}>
//           Update
//         </Button>
//         <Button variant="contained" color="error" onClick={handleClose}>
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//     // </Box>
//   );
// };

// export default SuspendAndResumeConfirmation;

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const SuspendAndResumeConfirmation = ({
  open,
  onClose,
  type,
  name,
  onUpdate,
}) => {
  const [description, setDescription] = useState("");

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleUpdate = () => {
    if (!description.trim()) {
      alert("Description is required!");
      return;
    }

    alert(`Action ${type === 1 ? "Resumed" : "Suspended"} Successfully!`);
    onUpdate(description); // Pass description back
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {type === 1 ? "Resume Confirmation" : "Suspend Confirmation"}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Name"
          value={name}
          InputProps={{ readOnly: true }}
          margin="dense"
        />
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
        <Typography sx={{ mt: 2, fontWeight: "bold", textAlign: "center" }}>
          {type === 1 ? "Do you want to Resume?" : "Do you want to Suspend?"}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Update
        </Button>
        <Button variant="contained" color="error" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuspendAndResumeConfirmation;
