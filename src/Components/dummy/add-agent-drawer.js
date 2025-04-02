import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  Drawer,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";

const AddIvrsdidDrawer = ({ openDrawer, setOpenDrawer, onRender }) => {
  const [formData, setFormData] = useState({
    account: "",
    didType: "",
    tsp: "",
    did: "",
    route: "",
    agentType: "",
    dateFrom: "",
    dateTo: "",
    description: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const apiurl = process.env.REACT_APP_API_URL;

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiurl}/ivrsdid_add`, formData);
      if (response?.data?.success) {
        setSnackbar({
          open: true,
          message: "IVRS DID added successfully!",
          severity: "success",
        });
        setOpenDrawer(false);
        setFormData({
          account: "",
          didType: "",
          tsp: "",
          did: "",
          route: "",
          agentType: "",
          dateFrom: "",
          dateTo: "",
          description: "",
        });
        onRender();
      } else {
        setSnackbar({
          open: true,
          message: response?.data?.message || "Failed to add IVRS DID.",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "An error occurred while adding IVRS DID.",
        severity: "error",
      });
    }
  };

  return (
    <Box>
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Box pl={4} pr={4} mt={2} sx={{ width: 500, backgroundColor: "#fff" }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" gutterBottom>
              <strong>Add IVRS DID</strong>
            </Typography>
            <IconButton onClick={() => setOpenDrawer(false)}>
              <CancelIcon />
            </IconButton>
          </Box>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Account"
                  name="account"
                  value={formData.account}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="DID Type"
                  name="didType"
                  value={formData.didType}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="TSP"
                  name="tsp"
                  value={formData.tsp}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="DID"
                  name="did"
                  value={formData.did}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Route"
                  name="route"
                  value={formData.route}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Agent Type"
                  name="agentType"
                  value={formData.agentType}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label="Date From"
                  name="dateFrom"
                  type="date"
                  value={formData.dateFrom}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={2}>
                <Box bgcolor={"#ffff"} textAlign={"center"} p={2.5}>
                  To
                </Box>
              </Grid>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label="Date To"
                  name="dateTo"
                  type="date"
                  value={formData.dateTo}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  inputProps={{ style: { resize: "both", fontSize: "25px" } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center" gap={2} mt={3}>
                  <Button variant="contained" color="primary" type="submit">
                    Save
                  </Button>
                  <Button variant="contained" color="primary" type="submit">
                    Save & New
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setOpenDrawer(false)}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Drawer>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddIvrsdidDrawer;
