import React, { useContext, useEffect, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  Button,
  IconButton,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  FormGroup,
  FormControlLabel,
  Checkbox,
  DialogActions,
  Modal,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import IvrsDidAddForm from "./Add-Did-Form";
import IvrsDidEditForm from "./Edit-Did-Form";
import axios from "axios";
import MD5 from "crypto-js/md5";
import StatusConfirmation from "./Confirmation-Dilogue";
import CustomPagination from "./CustomPagination";
import TableBottomActions from "./Table-Bottom-Actions";
import { FilterContext } from "../context/FilterProvider";
import SearchIcon from "@mui/icons-material/Search";
import MyFilterDrawer from "./My-Filter-Drawer";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
};

const tableStyles = {
  height: "76vh",
  width: "100vw",

  "& .MuiDataGrid-root": {
    fontFamily: "mulish, sans-serif",
    fontSize: "16px",
  },

  "& .MuiDataGrid-cell": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: 500,
    color: "#333",
    borderRight: "1px solid rgb(217, 211, 211)", // Add vertical lines in cells
    bgcolor: "#ffffff",
  },

  "& .MuiDataGrid-columnHeader": {
    backgroundColor: "#0f0f0f",
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
    maxHeight: 80,
  },

  "& .MuiDataGrid-columnHeaderTitle": {
    color: "#ffff",
  },

  "& .MuiDataGrid-menuIconButton": {
    color: "white !important",
    opacity: 1,
  },

  "& .MuiDataGrid-columnMenuIcon": {
    color: "white !important",
  },

  "& .MuiDataGrid-columnHeaders .MuiSvgIcon-root": {
    color: "white !important",
  },

  "& .MuiDataGrid-sortIcon, & .MuiDataGrid-filterIcon": {
    color: "white !important",
  },

  "& .MuiDataGrid-row:nth-of-type(odd)": {
    backgroundColor: "#f9f9f9",
  },
  "& .MuiDataGrid-row:nth-of-type(even)": {
    backgroundColor: "#ffffff",
  },

  "& .MuiDataGrid-row:hover": {
    backgroundColor: "#e3f2fd",
  },

  "& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root": {
    color: "white",
  },

  "& .MuiDataGrid-cell--withRenderer": {
    justifyContent: "center",
  },
};

const IvrsDidListTable = ({ handleShow }) => {
  const { data, setData } = useContext(FilterContext);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [statusType, setStatusType] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [description, setDescription] = useState("");
  const [selectedModuleNames, setSelectedModuleNames] = useState([]);
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [selectedDidData, setSelectedDidData] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedModules, setSelectedModules] = useState([]);
  const [moduleOptions, setModuleOptions] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedIvrsRows, setSelectedIvrsRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState(""); // Search input
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const toggleDrawer = () => setOpenFilterDrawer(!openFilterDrawer);
  const [openModal, setOpenModal] = useState(false);
  const apiurl = process.env.REACT_APP_API_URL; // Your API URL
  // For pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const totalRows = filteredData?.length;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRows =
    pageSize === "All"
      ? filteredData
      : filteredData?.slice(startIndex, startIndex + pageSize);
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

  const handleOpen = (row) => {
    setEditingRow(row);
    console.log(row, "Row");
    // Pre-populate selectedModules if row.module exists
    setSelectedModules(row.moduni !== null ? row?.moduni?.split(",") : []);
    setSelectedModuleNames(
      row.modnms ? row.modnms.split(",").map((n) => n.trim()) : []
    );

    setOpen(true);
    axios
      .post(`${apiurl}/mtype_drp_did`, {
        lml: "67a455659d796",
      })
      .then((response) => {
        if (response?.data?.resp?.error_code === "0") {
          const options = Array.isArray(response?.data?.resp?.mtype_drp_did)
            ? response?.data?.resp?.mtype_drp_did.map((item) => item)
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
    if (editingRow) {
      try {
        const response = await axios.post(`${apiurl}/add_did_modules`, {
          lml: "67a455659d796",
          k: editingRow.ivrsduniq,
          mod: selectedModules,
          diduni: editingRow.diduni,
          accuni: editingRow.accuni,
          ip: "",
          funm: "add_did_modules",
        });

        if (response?.data?.resp?.error_code === "0") {
          toast.success("Modules updated successfully.");

          setData((prevRows) => {
            if (!prevRows || prevRows.length === 0) {
              return prevRows;
            }

            const updatedRows = prevRows.map((row) =>
              row.ivrsduniq === editingRow.ivrsduniq
                ? {
                    ...row,
                    modnms: selectedModuleNames?.join(", "),
                    moduni: selectedModules.join(","),
                  }
                : row
            );
            return [...updatedRows]; // Force re-render
          });
        } else {
          toast.error("Failed to update modules on the backend.");
        }
      } catch (error) {
        console.error("Error updating modules:", error);

        toast.error("Failed to update modules.");
      }

      // Reset state
      setEditingRow(null);
      setSelectedModules([]);
      setOpen(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenDialog = (row) => {
    setSelectedRow(row);
    setDescription(""); // Clear previous description
    setStatusType(row.stat); // Assume stat === 1 means "suspended", so dialog shows "Resume"
    setOpenStatus(true);
  };

  const handleUpdate = async () => {
    if (!selectedRow) return;

    const newStatus = selectedRow.stat === 1 ? 2 : 1;

    const payload = {
      lml: "67a455659d796",
      accdid: `${selectedRow.compnm}-${selectedRow.unm}-${selectedRow.didnum}`,
      k: selectedRow.ivrsduniq,
      k1: newStatus,
      des: description,
    };

    try {
      const response = await axios.post(`${apiurl}/ivrs_did_suspend`, payload);

      if (response?.data?.resp?.error_code === "0") {
        // Update the context state, similar to your module update function.
        setData((prevRows) => {
          if (!prevRows || prevRows.length === 0) return prevRows;
          const updatedRows = prevRows.map((row) =>
            row.ivrsduniq === selectedRow.ivrsduniq
              ? {
                  ...row,
                  stat: newStatus,
                  sdes: description,
                  sudt: new Date().toLocaleString(),
                }
              : row
          );
          return [...updatedRows];
        });

        // Optionally update selectedRow if needed elsewhere.
        setSelectedRow((prev) => ({
          ...prev,
          stat: newStatus,
        }));
        toast.success(
          newStatus === 1
            ? "Module Resumed successfully."
            : "Module Suspended successfully."
        );

        setOpenStatus(false);
      } else {
        toast.error(
          response?.data?.resp?.message ||
            "Failed to update status on the backend."
        );
      }
    } catch (error) {
      console.error("API call error:", error);

      toast.error("Failed to update modules.");
    }
  };

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

        toast.success("DID deleted successfully.");
      } else {
        toast.error("Failed to delete DID.");
      }
    } catch (error) {
      console.error("Error deleting DID:", error);

      toast.error("Error occurred during deletion.");
    }
  };

  const handleToggle = (module) => {
    setSelectedModules((prevIds) =>
      prevIds.includes(module.typuni)
        ? prevIds.filter((id) => id !== module.typuni)
        : [...prevIds, module.typuni]
    );

    setSelectedModuleNames((prevNames) => {
      console.log("Before toggle:", prevNames, "module:", module.typnm);
      return prevNames.includes(module.typnm)
        ? prevNames.filter((name) => name !== module.typnm)
        : [...prevNames, module.typnm];
    });
  };
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  const handleConfirmAllDelete = async () => {
    try {
      const uniqValues = selectedIvrsRows;

      const response = await axios.post(`${apiurl}/v1/ivrs_did_del_multiple`, {
        lml: "67a455659d796", // actual session token
        k: uniqValues,
      });

      if (response?.data?.resp?.error_code === "0") {
        setData((prevData) =>
          prevData.filter((item) => !uniqValues.includes(item.ivrsduniq))
        );

        toast.success("Selected DIDs deleted successfully.");
        setSelectedIvrsRows([]); // reset selection
      } else {
        toast.error("Failed to delete selected DIDs.");
      }
    } catch (error) {
      console.error("Error deleting DIDs:", error);

      toast.error("Error occurred during deletion.");
    }

    handleCloseDelete(); // close the delete confirmation dialog
  };

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchText(searchTerm);

    if (!searchTerm) {
      setFilteredData(data); // Reset data when search is cleared
      return;
    }

    const filteredResults = data.filter((row) =>
      Object.values(row).some(
        (value) =>
          typeof value === "string" && value.toLowerCase().includes(searchTerm)
      )
    );

    setFilteredData(filteredResults);
    console.log(filteredData, "DataMy");
  };

  useEffect(() => {
    // Update the "selectAll" checkbox if selectedRows length equals full data length.
    setSelectAll(selectedRows.length === data.length && data.length > 0);
  }, [selectedRows, data]);

  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    if (checked) {
      setOpenModal(true);
    } else {
      setSelectedRows([]);
      setSelectAll(false);
    }
  };

  const visibleSelected = paginatedRows
    ? paginatedRows
        .map((row) => row.id)
        .filter((id) => selectedRows.includes(id))
    : [];

  const handleConfirmForAll = () => {
    const allIds = data.map((row) => row.id);
    const allIvrsIds = data.map((row) => row.ivrsduniq);
    setSelectedRows(allIds);
    setSelectedIvrsRows(allIvrsIds);
    setSelectAll(true);
    setOpenModal(false);
  };

  const handleCancelForAll = () => {
    setOpenModal(false);
    setSelectAll(false);
  };

  const columns = [
    {
      field: "id",
      headerName: "S.No",
      type: "number",
      flex: 2,
    },
    {
      field: "accontid",
      headerAlign: "center",
      headerName: "Account Id",
      flex: 3.5,
    },
    {
      field: "acca",
      headerName: "Account",
      headerAlign: "center",
      flex: 3,
      renderCell: (params) => (
        <Typography
          sx={{
            color: "blue",
            mt: 1.5,
            cursor: "pointer",
          }}
          onClick={() =>
            toast.success(`You clicked on account: ${params.value}`)
          }
        >
          {params.value}
        </Typography>
      ),
    },
    { field: "rtnm", headerAlign: "center", headerName: "Route", flex: 4 },
    {
      field: "mtype",
      headerName: "Module",
      flex: 5,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Box mt={3}>
            <Button
              onClick={() => handleOpen(params.row)}
              variant="contained"
              color="success"
            >
              +
            </Button>
            <p>{params.row.modnms}</p>
          </Box>
        );
      },
    },
    { field: "tspnm", headerAlign: "center", headerName: "TSP", flex: 2 },
    {
      field: "didnum",
      headerAlign: "center",
      headerName: "DID Number",
      flex: 3.7,
    },
    { field: "ver", headerAlign: "center", headerName: "Version", flex: 2.5 },
    { field: "didtyp", headerAlign: "center", headerName: "Type", flex: 2.5 },
    {
      field: "agtyp",
      headerName: "Agent Type",
      headerAlign: "center",
      flex: 3.5,
      renderCell: (params) => {
        if (params.value === 0) return "1st Number Agent";
        if (params.value === 1) return "2nd Number Agent";
        return "Unknown";
      },
    },
    {
      field: "fdt",
      headerName: "From",
      headerAlign: "center",
      flex: 3.2,
    },
    { field: "tdt", headerAlign: "center", headerName: "To", flex: 3.5 },
    {
      field: "descr",
      headerAlign: "center",
      headerName: "Description",
      flex: 3.5,
    },
    {
      field: "stat",
      headerAlign: "center",
      headerName: "Status",
      flex: 6,
      renderCell: (params) => (
        <>
          {params.row.stat === 1 ? (
            <Box textAlign={"center"}>
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
            <Box textAlign={"center"}>
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
      headerAlign: "center",
      flex: 3,
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
      {data?.length > 0 && (
        <Box>
          <Grid container>
            <Grid item xs={12}>
              <Card>
                <Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    m={1}
                  >
                    {/* Left Side - Title */}
                    <Typography variant="h5" fontFamily="serif" color="#0d47a1">
                      IVRS DID List
                    </Typography>

                    {/* Right Side - With Background */}
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={2}
                      p={1.5}
                      // bgcolor="#333"
                      // borderRadius={2}
                      // boxShadow={1}
                    >
                      {/* Search Field */}
                      <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Search..."
                        value={searchText}
                        onChange={handleSearch}
                        InputProps={{
                          endAdornment: (
                            <IconButton>
                              <SearchIcon color="primary" />
                            </IconButton>
                          ),
                        }}
                        sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                      />

                      {/* Delete Icon */}
                      {selectedRows.length > 0 && (
                        <IconButton onClick={handleOpenDelete}>
                          <DeleteIcon color="error" sx={{ fontSize: 28 }} />
                          <Typography color={"error"}>Delete</Typography>
                        </IconButton>
                      )}

                      {/* Filter Icon */}
                      <IconButton onClick={toggleDrawer}>
                        <FilterListIcon
                          sx={{
                            fontSize: 34,
                            color: "#6a69ff",
                            transition: "0.3s",
                            "&:hover": {
                              color: "#6a69ff",
                              transform: "scale(1.1)",
                            },
                          }}
                        />
                      </IconButton>
                      <Button
                        onClick={() => setOpenDrawer(true)}
                        sx={{
                          bgcolor: "#6a69ff",
                          color: "#ffff",
                          "&:hover": {
                            color: "#ffff",
                            bgcolor: "#6a69ff",
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <AddSharpIcon sx={{ fontSize: 16 }} />
                        <Typography>Add</Typography>
                      </Button>
                    </Box>
                  </Box>

                  <Box sx={{ overflow: "auto" }}>
                    <DataGrid
                      rows={paginatedRows || []}
                      columns={columns}
                      disableRowSelectionOnClick={true}
                      checkboxSelection={true}
                      rowSelectionModel={visibleSelected}
                      onRowSelectionModelChange={(newSelection) => {
                        setSelectAll(false);
                        setSelectedRows(newSelection);
                        const selectedIds = data
                          .filter((row) => newSelection.includes(row.id))
                          .map((row) => row.ivrsduniq);
                        setSelectedIvrsRows(selectedIds);
                      }}
                      hideFooter
                      getRowHeight={() => "auto"}
                      // paginationMode="server"
                      sx={tableStyles}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#fff",
                      borderTop: "1px solid #ccc",
                      // common padding for the container
                    }}
                  >
                    {/* Left Section */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3, // consistent gap between elements
                        flexWrap: "wrap", // allow wrapping on smaller screens
                        ml: 2,
                      }}
                    >
                      <Typography variant="body2">
                        Selected Rows:{" "}
                        <strong>
                          {selectedRows?.length === data?.length
                            ? "SelectedAll"
                            : selectedRows?.length}
                        </strong>
                      </Typography>
                      <Typography variant="body2">
                        Total Rows: <strong>{data?.length}</strong>
                      </Typography>

                      {selectedRows.length > 0 && (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <TableBottomActions
                            selectedRows={selectedRows}
                            setSelectedRows={setSelectedRows}
                            setSelectedIvrsRows={setSelectedIvrsRows}
                            selectedIvrsRows={selectedIvrsRows}
                          />
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Checkbox
                              checked={selectAll}
                              onChange={handleSelectAll}
                            />
                            <Typography variant="body2">FOR ALL</Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>

                    {/* Right Section */}
                    <Box>
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
                    </Box>
                  </Box>

                  <Drawer
                    anchor="right"
                    open={openDrawer}
                    onClose={() => setOpenDrawer(true)}
                  >
                    <Box sx={{ width: 500, p: 3 }}>
                      <IvrsDidAddForm
                        setOpenDrawer={setOpenDrawer}
                        handleShow={handleShow}
                      />
                    </Box>
                  </Drawer>

                  <MyFilterDrawer
                    openDrawer={openFilterDrawer}
                    toggleDrawer={toggleDrawer}
                    data={data}
                    setData={setData}
                  />
                  <Drawer
                    anchor="right"
                    open={openEditDrawer}
                    onClose={() => setOpenEditDrawer(true)}
                  >
                    <Box sx={{ width: 500, p: 3 }}>
                      <IvrsDidEditForm
                        selectedDidData={selectedDidData}
                        setOpenEditDrawer={setOpenEditDrawer}
                        handleShow={handleShow}
                      />
                    </Box>
                  </Drawer>

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
                          key={module.typuni}
                          control={
                            <Checkbox
                              checked={selectedModules?.includes(module.typuni)}
                              onChange={() => handleToggle(module)}
                            />
                          }
                          label={module.typnm}
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
                      onClick={handleClose}
                    >
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
              </Card>
            </Grid>
          </Grid>

          <Modal open={openDelete} onClose={handleCloseDelete}>
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
              <Typography>
                Are you sure you want to delete the selected items?
              </Typography>
              <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
                <Button
                  onClick={handleConfirmAllDelete}
                  variant="contained"
                  color="primary"
                >
                  Yes
                </Button>
                <Button
                  onClick={handleCloseDelete}
                  variant="contained"
                  color="error"
                >
                  No
                </Button>
              </Box>
            </Box>
          </Modal>

          <Modal open={openModal} onClose={handleCancelForAll}>
            <Box sx={modalStyle}>
              <Typography variant="h6" component="h2" mb={2}>
                Confirm Action
              </Typography>
              <Typography sx={{ mb: 3 }}>
                Action will be applied to all items selected by the filter,
                including items on other pages.
              </Typography>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCancelForAll}
                  sx={{ mr: 1 }}
                >
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleConfirmForAll}>
                  Confirm
                </Button>
              </Box>
            </Box>
          </Modal>
        </Box>
      )}
    </>
  );
};

export default IvrsDidListTable;
