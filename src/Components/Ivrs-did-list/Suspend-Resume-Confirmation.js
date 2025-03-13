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
