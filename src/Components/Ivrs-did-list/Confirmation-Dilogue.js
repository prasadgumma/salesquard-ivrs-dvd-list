import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const StatusConfirmation = ({
  open,
  onClose,
  type, // 1 for Resume, otherwise Suspend
  name,
  description,
  onDescriptionChange,
  onUpdate,
}) => {
  const title = type === 1 ? "Resume Confirmation" : "Suspend Confirmation";
  const question =
    type === 1 ? "Do you want to Resume?" : "Do you want to Suspend?";

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {/* Use value prop rather than defaultValue */}
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
          onChange={onDescriptionChange}
          required
          multiline
          rows={3}
          sx={{
            mb: 1,
            "& .MuiInputBase-root textarea": {
              resize: "both",
            },
          }}
          margin="dense"
        />
        <Typography sx={{ mt: 2, fontWeight: "bold", textAlign: "center" }}>
          {question}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={onUpdate}>
          Update
        </Button>
        <Button variant="contained" color="error" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusConfirmation;
