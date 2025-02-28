import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  Button,
  IconButton,
  Drawer,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  FormGroup,
  FormControlLabel,
  Checkbox,
  DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import IvrsDidAddForm from "./AddDidForm";
import IvrsDidEditForm from "./EditDidForm";
import axios from "axios";
import MD5 from "crypto-js/md5";
import StatusConfirmation from "./Confirmation-Dilogue";
import CustomPagination from "./CustomPagination";

const IvrsDidListTable = ({ tableDidData, handleShow }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [statusType, setStatusType] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [description, setDescription] = useState("");

  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [selectedDidData, setSelectedDidData] = useState(null);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedModules, setSelectedModules] = useState([]);
  const [moduleOptions, setModuleOptions] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  console.log(moduleOptions, "moduleOptions");
  const apiurl = process.env.REACT_APP_API_URL; // Your API URL
  // For pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const totalRows = data?.length;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRows =
    pageSize === "All" ? data : data?.slice(startIndex, startIndex + pageSize);
  const totalPages = pageSize === "All" ? 1 : Math.ceil(totalRows / pageSize);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handlePageSizeChange = (event) => {
    const newSize = event.target.value;
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page on size change
  };

  useEffect(() => {
    if (tableDidData) {
      setData(tableDidData);
      setLoading(false);
    }
  }, [tableDidData]);

  const handleOpen = (row) => {
    setEditingRow(row);
    // Pre-populate selectedModules if row.module exists
    setSelectedModules(row.module ? row.module.split(", ") : []);
    setOpen(true);
    axios
      .post(`${apiurl}/mtype_drp_did`, {
        lml: "67a455659d796",
      })
      .then((response) => {
        if (response?.data?.resp?.error_code === "0") {
          // Assuming response.data.resp.mtype_drp_did is an array of objects with a 'typnm' property
          const options = Array.isArray(response.data.resp.mtype_drp_did)
            ? response.data.resp.mtype_drp_did.map((item) => item.typnm)
            : [];
          setModuleOptions(options);
        } else {
          console.error("API returned an error", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching module options:", error);
      });
  };

  const handleModuleSave = async () => {
    console.log(editingRow, "eRow");
    if (editingRow) {
      const modulesString = selectedModules.join(", ");
      const updatedRow = { ...editingRow, module: modulesString };
      setData((prevData) =>
        prevData.map((row) =>
          row.ivrsduniq === editingRow.ivrsduniq ? updatedRow : row
        )
      );

      try {
        const response = await axios.post(`${apiurl}/add_did_modules`, {
          lml: "67a455659d796",
          k: editingRow.ivrsduniq,
          mod: selectedModules,
        });
        console.log(response, "ModRes");

        if (response?.data?.resp?.error_code === "0") {
          setSnackbar({
            open: true,
            message: "Modules updated successfully.",
            severity: "success",
          });
        } else {
          setSnackbar({
            open: true,
            message: "Failed to update modules on the backend.",
            severity: "error",
          });
        }
      } catch (error) {
        console.error("Error updating modules:", error);
        setSnackbar({
          open: true,
          message: "Failed to update modules.",
          severity: "error",
        });
      }

      // Reset the editing row and selected modules state
      setEditingRow(null);
      setSelectedModules([]);
    }
    // Finally, close the dialog
    setOpen(false);
  };

  const handleClear = () => {
    if (editingRow) {
      const updatedRow = { ...editingRow, module: "" };
      setData((prevData) =>
        prevData.map((row) =>
          row.ivrsduniq === editingRow.ivrsduniq ? updatedRow : row
        )
      );
      setEditingRow(null);
    }
    setSelectedModules([]);
    setOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Open dialog for either Suspend or Resume
  const handleOpenDialog = (row) => {
    setSelectedRow(row);
    setDescription(""); // Clear previous description
    setStatusType(row.stat); // Assume stat === 1 means "suspended", so dialog shows "Resume"
    setOpenStatus(true);
  };

  const handleUpdate = async () => {
    if (!selectedRow) return; // Ensure a row is selected
    console.log(selectedRow);
    // Build the payload. The 'action' field helps the backend decide the operation.
    const payload = {
      lml: "67a455659d796", // Replace with your actual session value
      accdid: `${selectedRow.compnm}-${selectedRow.unm}-${selectedRow.didnum}`,
      k: selectedRow.ivrsduniq, // Unique identifier from the selected row
      k1: selectedRow.stat === 1 ? "2" : "1",
      des: description, // User-entered description
    };

    try {
      const response = await axios.post(`${apiurl}/ivrs_did_suspend`, payload);
      console.log("API response", response.data);
      handleShow();
      // Optionally, update your UI or notify the user of success
    } catch (error) {
      console.error("API call error:", error);
    }
    setOpenStatus(false);
  };

  // Edit functionality using Axios
  const handleEditClick = async (row) => {
    try {
      const response = await axios.post(`${apiurl}/ivrs_did_elist`, {
        lml: "67a455659d796",
        k: MD5(row.ivrsduniq).toString(),
      });

      if (response.status === 200) {
        const AllDidData = response?.data?.resp?.ivrsdidlist;
        setSelectedDidData(AllDidData); // Save API response data for editing
        setOpenEditDrawer(true); // Open the Edit Drawer
      } else {
        console.error("Empty response data");
      }
    } catch (error) {
      console.error("Error fetching DID details:", error);
    }
  };

  // Delete functionality using Axios
  const handleDeleteClick = async (row) => {
    try {
      const response = await axios.post(`${apiurl}/ivrs_did_del`, {
        lml: "67a455659d796", // Your session token
        k: row.ivrsduniq, // Unique DID identifier (possibly MD5 hash if required)
        k1: row.diduni, // Original unique identifier
        sts: 1, // Status flag
      });
      if (response?.data?.resp?.error_code === "0") {
        // Remove the deleted row from the data state
        setData((prevData) =>
          prevData.filter((item) => item.ivrsduniq !== row.ivrsduniq)
        );
        setSnackbar({
          open: true,
          message: "DID deleted successfully.",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to delete DID.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting DID:", error);
      setSnackbar({
        open: true,
        message: "Error occurred during deletion.",
        severity: "error",
      });
    }
  };
  const handleToggle = (module) => {
    setSelectedModules((prev) =>
      prev.includes(module)
        ? prev.filter((m) => m !== module)
        : [...prev, module]
    );
  };

  const columns = [
    {
      field: "id",
      headerName: "S.No",
      type: "number",
      width: 80,
      align: "center",
    },
    { field: "accontid", headerName: "Account Id", width: 100 },
    {
      field: "acca",
      headerName: "Account",
      width: 160,
      renderCell: (params) => (
        <Typography
          sx={{
            color: "blue",
            mt: 1.5,
            cursor: "pointer",
          }}
          onClick={() =>
            setSnackbar({
              open: true,
              message: `You clicked on account: ${params.value}`,
              severity: "success",
            })
          }
        >
          {params.value}
        </Typography>
      ),
    },
    { field: "rtnm", headerName: "Route", width: 200 },
    {
      field: "mtype",
      headerName: "Module",
      width: 200,
      align: "center",

      renderCell: (params) => {
        // Convert the module string to an array of modules
        const modules = params.row.module ? params.row.module.split(", ") : [];

        return (
          <>
            {/* The button to open the module selection dialog */}
            <Button
              onClick={() => handleOpen(params.row)}
              variant="contained"
              color="success"
            >
              +
            </Button>
            {/* Below the button, display an ordered list if there are any modules */}
            {modules.length > 0 && (
              <ol style={{ margin: 0, paddingLeft: "20px" }}>
                {modules.map((mod, index) => (
                  <li key={index}>{mod}</li>
                ))}
              </ol>
            )}
          </>
        );
      },
    },
    { field: "tspnm", headerName: "TSP", width: 120 },
    { field: "didnum", headerName: "DID Number", width: 150 },
    { field: "ver", headerName: "Version", width: 100 },
    { field: "didtyp", headerName: "Type", width: 150 },
    {
      field: "agtyp",
      headerName: "Agent Type",
      width: 150,
      renderCell: (params) => {
        if (params.value === 0) return "1st Number Agent";
        if (params.value === 1) return "2nd Number Agent";
        return "Unknown";
      },
    },
    { field: "fdt", headerName: "From", width: 200 },
    { field: "tdt", headerName: "To", width: 150 },
    { field: "descr", headerName: "Description", width: 200 },
    {
      field: "stat",
      headerName: "Status",
      width: 250,
      renderCell: (params) => (
        <>
          {params.row.stat === 1 ? (
            <Box>
              <Typography color="red" fontWeight="bold">
                Suspended
              </Typography>
              <Typography variant="body2">
                <strong>Description:</strong> {params.row.sdes || "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>Date:</strong> {params.row.sudt || "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>User:</strong> {params.row.sunm || "N/A"}
              </Typography>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleOpenDialog(params.row)}
                sx={{ mt: 1 }}
              >
                Resume
              </Button>
            </Box>
          ) : (
            <Box>
              <Typography color="green" fontWeight="bold">
                Active
              </Typography>
              <Button
                variant="contained"
                color="warning"
                onClick={() => handleOpenDialog(params.row)}
                sx={{ mt: 1 }}
              >
                Suspend
              </Button>
            </Box>
          )}
        </>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => handleEditClick(params.row)}
          >
            <Edit />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleDeleteClick(params.row)}
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <>
      {tableDidData?.length > 0 && (
        <Box>
          <Grid container>
            <Grid item xs={12}>
              <Card>
                <Box mt={2} m={2}>
                  <Box display="flex" justifyContent="space-between" m={1}>
                    <Typography variant="h5" fontFamily="serif">
                      IVRS DID List
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => setOpenDrawer(true)}
                    >
                      Add +
                    </Button>
                  </Box>
                  <Box>
                    <DataGrid
                      rows={paginatedRows || []}
                      columns={columns}
                      disableSelectionOnClick={true}
                      hideFooter
                      getRowHeight={() => "auto"}
                      paginationMode="server"
                      sx={{
                        height: "75vh",
                        // width: "75vw",

                        "& .MuiDataGrid-cell": {
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        },

                        "& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root":
                          {
                            color: "white",
                          },
                        "& .MuiDataGrid-columnHeader": {
                          backgroundColor: "#0f0f0f",
                          color: "white",
                          maxHeight: 70,
                        },
                        "& .MuiDataGrid-columnHeaderTitle": {
                          color: "#ffff",
                        },
                        "& .MuiDataGrid-columnMenuIcon": {
                          color: "#ffff",
                        },
                        "& .MuiDataGrid-menu": {
                          backgroundColor: "#1976d2",
                        },
                        "& .MuiMenuItem-root": {
                          color: "white",
                        },
                        "& .MuiDataGrid-menuItem-root:hover": {
                          backgroundColor: "#1565c0",
                        },
                        "& .MuiDataGrid-sortIcon": {
                          opacity: 1,
                          color: "#ffff",
                        },
                        "& .MuiDataGrid-menuIconButton": {
                          opacity: 1,
                          color: "#ffff",
                        },
                        "& .MuiDataGrid-filterIcon": {
                          opacity: 1,
                          color: "white",
                        },

                        "& .MuiDataGrid-cell": {
                          borderRight: "1px solid rgb(217, 211, 211)", // Add vertical lines in cells
                          height: 150,
                          bgcolor: "#ffff",
                        },
                      }}
                    />
                  </Box>

                  <CustomPagination
                    currentPage={currentPage}
                    totalRows={totalRows}
                    startIndex={startIndex}
                    pageSize={pageSize}
                    handlePageSizeChange={handlePageSizeChange}
                    handlePreviousPage={handlePreviousPage}
                    handleNextPage={handleNextPage}
                    totalPages={totalPages}
                  />

                  <Drawer
                    anchor="right"
                    open={openDrawer}
                    onClose={() => setOpenDrawer(false)}
                  >
                    <Box sx={{ width: 500, p: 3 }}>
                      <IvrsDidAddForm
                        setOpenDrawer={setOpenDrawer}
                        setData={setData}
                        handleShow={handleShow}
                      />
                    </Box>
                  </Drawer>
                  <Drawer
                    anchor="right"
                    open={openEditDrawer}
                    onClose={() => setOpenEditDrawer(false)}
                  >
                    <Box sx={{ width: 500, p: 3 }}>
                      <IvrsDidEditForm
                        selectedDidData={selectedDidData}
                        setOpenEditDrawer={setOpenEditDrawer}
                        setData={setData}
                        handleShow={handleShow}
                      />
                    </Box>
                  </Drawer>
                  {/* Confirmation Dialog for Suspend/Resume */}
                  <StatusConfirmation
                    open={openStatus}
                    onClose={() => setOpenStatus(false)}
                    type={statusType}
                    name={
                      selectedRow
                        ? `${selectedRow.compnm}-${selectedRow.unm}-${selectedRow.didnum}`
                        : ""
                    }
                    description={description}
                    onDescriptionChange={(e) => setDescription(e.target.value)}
                    onUpdate={handleUpdate}
                  />
                </Box>

                <Dialog open={open} maxWidth="sm" fullWidth>
                  <DialogTitle>Modules</DialogTitle>
                  <DialogContent>
                    <FormGroup>
                      {moduleOptions.map((module) => (
                        <FormControlLabel
                          key={module}
                          control={
                            <Checkbox
                              checked={selectedModules.includes(module)}
                              onChange={() => handleToggle(module)}
                            />
                          }
                          label={module}
                        />
                      ))}
                    </FormGroup>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleModuleSave}
                    >
                      Save
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleClear}
                    >
                      Clear
                    </Button>
                  </DialogActions>
                </Dialog>
              </Card>
            </Grid>
          </Grid>
          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
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
      )}
    </>
  );
};

export default IvrsDidListTable;
