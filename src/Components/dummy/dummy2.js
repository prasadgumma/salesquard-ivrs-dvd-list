// // import React, { useEffect, useState } from "react";
// // import {
// //   Typography,
// //   Box,
// //   Grid,
// //   Card,
// //   CircularProgress,
// //   Button,
// //   IconButton,
// //   Drawer,
// // } from "@mui/material";
// // import { DataGrid } from "@mui/x-data-grid";
// // import { Snackbar, Alert } from "@mui/material";
// // import CustomPagination from "./CustomPagination";
// // import { Add, Edit, Delete } from "@mui/icons-material";
// // import IvrsDidAddForm from "./AddDidForm";
// // import ResumeConfirmation from "./Confirmation-Dilogue";
// // import IvrsDidEditForm from "./EditDidForm";
// // import axios from "axios";
// // import { v4 as uuidv4 } from "uuid"; // Import UUID generator
// // import MD5 from "crypto-js/md5";
// // import StatusConfirmation from "./Confirmation-Dilogue";

// // const IvrsDidListTable = ({ tableDidData, handleShow }) => {
// //   const [data, setData] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [snackbar, setSnackbar] = useState({
// //     open: false,
// //     message: "",
// //     severity: "success",
// //   });
// //   const [openDrawer, setOpenDrawer] = useState(false);
// //   const [openResume, setOpenResume] = useState(false);
// //   const [openSuspend, setOpenSuspend] = useState(false);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [pageSize, setPageSize] = useState(25);
// //   const [open, setOpen] = useState(false);
// //   const [openStatus, setOpenStatus] = useState(false);
// //   const [statusType, setStatusType] = useState(null);
// //   // const [selectedRow, setSelectedRow] = useState(null);
// //   const [description, setDescription] = useState("");

// //   const [openEditDrawer, setOpenEditDrawer] = useState(false);
// //   const [selectedDidData, setSelectedDidData] = useState();
// //   console.log(data, "Data");

// //   const handleOpenDialog = (row) => {
// //     setData(row);
// //     setDescription(""); // clear any previous description
// //     setStatusType(row.stat); // assume stat === 1 means "resume" (i.e. currently suspended)
// //     setOpenStatus(true);
// //   };

// //   const handleUpdate = async () => {
// //     if (statusType !== 1) {
// //       const payload = {
// //         lml: "67a455659d796", // Replace with your actual session value
// //         k: data.ivrsduniq, // Replace with the actual value from the row
// //         k1: data.k1, // Replace with the actual value from the row
// //         des: data.descr,
// //       };

// //       try {
// //         const response = await axios.post(
// //           `${apiurl}/ivrs_did_list_v2`,
// //           payload
// //         );
// //         console.log("API response", response.data);
// //         // Optionally: add logic to update UI or notify the user upon success
// //       } catch (error) {
// //         console.error("API call error:", error);
// //       }
// //     } else {
// //       // For resume functionality, you can add a similar Axios call if needed
// //       console.log(
// //         "Resume functionality is not integrated with an API call in this example."
// //       );
// //     }
// //     setOpenStatus(false);
// //   };

// //   useEffect(() => {
// //     if (tableDidData) {
// //       setData(tableDidData);
// //       setLoading(false);
// //     }
// //   }, [tableDidData]);
// //   console.log(data);
// //   const totalRows = data?.length;
// //   const startIndex = (currentPage - 1) * pageSize;

// //   const paginatedRows =
// //     pageSize === "All" ? data : data?.slice(startIndex, startIndex + pageSize);
// //   const totalPages = pageSize === "All" ? 1 : Math.ceil(totalRows / pageSize);

// //   const apiurl = process.env.REACT_APP_API_URL; // Replace with your API URL

// //   const handleNextPage = () => {
// //     if (currentPage < totalPages) {
// //       setCurrentPage((prev) => prev + 1);
// //     }
// //   };

// //   const handlePreviousPage = () => {
// //     if (currentPage > 1) {
// //       setCurrentPage((prev) => prev - 1);
// //     }
// //   };
// //   const handlePageSizeChange = (event) => {
// //     const newSize = event.target.value;
// //     setPageSize(newSize);
// //     setCurrentPage(1); // Reset to the first page when page size changes
// //   };

// //   const handleCloseSnackbar = () => {
// //     setSnackbar((prev) => ({ ...prev, open: false }));
// //   };

// //   const handleCloseEditDrawer = () => {
// //     setOpenEditDrawer(true);
// //   };

// //   const handleEditClick = async (row) => {
// //     const datas = row.ivrsduniq;
// //     console.log(datas);
// //     console.log(MD5(datas).toString());
// //     console.log(row, "row");
// //     try {
// //       const response = await axios.post(`${apiurl}/ivrs_did_elist`, {
// //         lml: "67a455659d796",
// //         k: MD5(row.ivrsduniq).toString(),
// //       });

// //       console.log(response?.data?.resp?.ivrsdidlist, "API Response");

// //       if (response.status === 200) {
// //         const AllDidData = response?.data?.resp?.ivrsdidlist;
// //         setSelectedDidData(AllDidData); // Store API response
// //         setOpenEditDrawer(true); // Open the Edit Drawer
// //       } else {
// //         console.error("Empty response data");
// //       }
// //     } catch (error) {
// //       console.error("Error fetching DID details:", error);
// //     }
// //   };

// //   // Delete functionality implementation
// //   const handleDeleteClick = async (row) => {
// //     try {
// //       const response = await axios.post(`${apiurl}/ivrs_did_del`, {
// //         lml: "67a455659d796", // Your session token
// //         k: row.ivrsduniq, // MD5 hash of ivrsduniq
// //         k1: row.diduni, // Original unique identifier
// //         sts: 1, // Status flag
// //       });
// //       console.log(response, "Res");
// //       // Adjust condition based on your API's success response
// //       if (response?.data?.resp?.error_code === "0") {
// //         // Remove the deleted row from the state
// //         setData((prevData) =>
// //           prevData.filter((item) => item.ivrsduniq !== row.ivrsduniq)
// //         );
// //         setSnackbar({
// //           open: true,
// //           message: "DID deleted successfully.",
// //           severity: "success",
// //         });
// //       } else {
// //         setSnackbar({
// //           open: true,
// //           message: "Failed to delete DID.",
// //           severity: "error",
// //         });
// //       }
// //     } catch (error) {
// //       console.error("Error deleting DID:", error);
// //       setSnackbar({
// //         open: true,
// //         message: "Error occurred during deletion.",
// //         severity: "error",
// //       });
// //     }
// //   };

// //   const columns = [
// //     {
// //       field: "id",
// //       headerName: "S.No",
// //       type: "number",
// //       width: 150,
// //       align: "center",
// //     },
// //     { field: "accontid", headerName: "Account Id", width: 100 },
// //     {
// //       field: "acca",
// //       headerName: "Account",
// //       width: 150,
// //       renderCell: (params) => (
// //         <Typography
// //           sx={{
// //             color: "blue",
// //             mt: 1.5,
// //             cursor: "pointer",
// //             // textDecoration: "underline",
// //           }}
// //           onClick={() =>
// //             setSnackbar({
// //               open: true,
// //               message: `You clicked on account: ${params.value}`,
// //               severity: "success",
// //             })
// //           }
// //         >
// //           {params.value}
// //         </Typography>
// //       ),
// //     },
// //     { field: "rtnm", headerName: "Route", width: 200 },
// //     {
// //       field: "mtype",
// //       headerName: "Module",
// //       width: 150,
// //       align: "center",
// //       renderCell: () => (
// //         <Button
// //           variant="contained"
// //           sx={{
// //             backgroundColor: "green",
// //             color: "white",
// //             minWidth: 50,
// //             display: "flex",
// //             ml: 5,
// //             mt: 0.5,
// //           }}
// //         >
// //           +
// //         </Button>
// //       ),
// //     },
// //     { field: "tspnm", headerName: "TSP", width: 120 },
// //     { field: "didnum", headerName: "DID Number", width: 150 },
// //     { field: "ver", headerName: "Version", width: 100 },
// //     { field: "didtyp", headerName: "Type", width: 150 },

// //     {
// //       field: "agtyp",
// //       headerName: "Agent Type",
// //       width: 110,
// //       renderCell: (params) => {
// //         if (params.value === 0) return "1st Number Agent";
// //         if (params.value === 1) return "2nd Number Agent";
// //         return "Unknown";
// //       },
// //     },

// //     { field: "fdt", headerName: "From", width: 200 },
// //     { field: "tdt", headerName: "To", width: 150 },
// //     { field: "descr", headerName: "Description", width: 150 },

// //     // {
// //     //   field: "stat",
// //     //   headerName: "Status",
// //     //   width: 250,
// //     //   renderCell: (params) => (
// //     //     <>
// //     //       {params.row.stat === 1 ? ( // If Suspended
// //     //         <Box>
// //     //           <Typography color="red" fontWeight="bold">
// //     //             Suspended
// //     //           </Typography>
// //     //           <Typography variant="body2">
// //     //             <strong>Description:</strong> {params.row.sdes || "N/A"}
// //     //           </Typography>
// //     //           <Typography variant="body2">
// //     //             <strong>Date:</strong> {params.row.sudt || "N/A"}
// //     //           </Typography>
// //     //           <Typography variant="body2">
// //     //             <strong>User:</strong> {params.row.sunm || "N/A"}
// //     //           </Typography>
// //     //           <Button
// //     //             variant="contained"
// //     //             color="success"
// //     //             onClick={() => setOpenResume(true)}
// //     //             sx={{ mt: 1 }}
// //     //           >
// //     //             Resume
// //     //           </Button>
// //     //         </Box>
// //     //       ) : (
// //     //         // If Active
// //     //         <Box>
// //     //           <Typography color="green" fontWeight="bold">
// //     //             Active
// //     //           </Typography>

// //     //           <Button
// //     //             variant="contained"
// //     //             color="warning"
// //     //             onClick={() => setOpenSuspend(true)}
// //     //             sx={{ mt: 1 }}
// //     //           >
// //     //             Suspend
// //     //           </Button>
// //     //         </Box>
// //     //       )}
// //     //     </>
// //     //   ),
// //     // },

// //     {
// //       field: "stat",
// //       headerName: "Status",
// //       width: 250,
// //       renderCell: (params) => (
// //         <>
// //           {params.row.stat === 1 ? (
// //             <Box>
// //               <Typography color="red" fontWeight="bold">
// //                 Suspended
// //               </Typography>
// //               <Typography variant="body2">
// //                 <strong>Description:</strong> {params.row.sdes || "N/A"}
// //               </Typography>
// //               <Typography variant="body2">
// //                 <strong>Date:</strong> {params.row.sudt || "N/A"}
// //               </Typography>
// //               <Typography variant="body2">
// //                 <strong>User:</strong> {params.row.sunm || "N/A"}
// //               </Typography>
// //               <Button
// //                 variant="contained"
// //                 color="success"
// //                 onClick={() => handleOpenDialog(params.row)}
// //                 sx={{ mt: 1 }}
// //               >
// //                 Resume
// //               </Button>
// //             </Box>
// //           ) : (
// //             <Box>
// //               <Typography color="green" fontWeight="bold">
// //                 Active
// //               </Typography>
// //               <Button
// //                 variant="contained"
// //                 color="warning"
// //                 onClick={() => handleOpenDialog(params.row)}
// //                 sx={{ mt: 1 }}
// //               >
// //                 Suspend
// //               </Button>
// //             </Box>
// //           )}
// //         </>
// //       ),
// //     },

// //     {
// //       field: "actions",
// //       headerName: "Actions",
// //       width: 150,
// //       renderCell: (params) => (
// //         <>
// //           <IconButton
// //             color="primary"
// //             onClick={() => handleEditClick(params.row)}
// //           >
// //             <Edit />
// //           </IconButton>

// //           <IconButton
// //             color="secondary"
// //             onClick={() => handleDeleteClick(params.row)}
// //           >
// //             <Delete />
// //           </IconButton>
// //         </>
// //       ),
// //     },
// //   ];

// //   console.log(paginatedRows);

// //   return (
// //     <>
// //       {tableDidData?.length > 0 && (
// //         <Box>
// //           <Grid container>
// //             <Grid item xs={12}>
// //               <Card>
// //                 <Box mt={2} m={2}>
// //                   <Box display="flex" justifyContent="space-between" m={1}>
// //                     <Typography variant="h5" fontFamily="serif">
// //                       IVRS DID List
// //                     </Typography>
// //                     <Button
// //                       variant="contained" // Move this outside sx
// //                       onClick={() => setOpenDrawer(true)}
// //                     >
// //                       Add +
// //                     </Button>
// //                   </Box>

// //                   <Box>
// //                     <DataGrid
// //                       rows={paginatedRows || []}
// //                       columns={columns}
// //                       disableSelectionOnClick={true} // Disable row selection on click
// //                       hideFooter
// //                       getRowHeight={() => "auto"}
// //                       // rowCount={data?.length}
// //                       paginationMode="server" // Very Important Pagination
// //                       // getRowId={(row) => row.id}
// //                       sx={{
// //                         height: "75vh",
// //                         // width: "75vw",

// //                         "& .MuiDataGrid-cell": {
// //                           display: "flex",
// //                           justifyContent: "center",
// //                           alignItems: "center",
// //                         },

// //                         "& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root":
// //                           {
// //                             color: "white",
// //                           },
// //                         "& .MuiDataGrid-columnHeader": {
// //                           backgroundColor: "#0f0f0f",
// //                           color: "white",
// //                           maxHeight: 70,
// //                         },
// //                         "& .MuiDataGrid-columnHeaderTitle": {
// //                           color: "#ffff",
// //                         },
// //                         "& .MuiDataGrid-columnMenuIcon": {
// //                           color: "#ffff",
// //                         },
// //                         "& .MuiDataGrid-menu": {
// //                           backgroundColor: "#1976d2",
// //                         },
// //                         "& .MuiMenuItem-root": {
// //                           color: "white",
// //                         },
// //                         "& .MuiDataGrid-menuItem-root:hover": {
// //                           backgroundColor: "#1565c0",
// //                         },
// //                         "& .MuiDataGrid-sortIcon": {
// //                           opacity: 1,
// //                           color: "#ffff",
// //                         },
// //                         "& .MuiDataGrid-menuIconButton": {
// //                           opacity: 1,
// //                           color: "#ffff",
// //                         },
// //                         "& .MuiDataGrid-filterIcon": {
// //                           opacity: 1,
// //                           color: "white",
// //                         },

// //                         "& .MuiDataGrid-cell": {
// //                           borderRight: "1px solid rgb(217, 211, 211)", // Add vertical lines in cells
// //                           height: 150,
// //                           bgcolor: "#ffff",
// //                         },
// //                       }}
// //                     />
// //                   </Box>

// //                   <CustomPagination
// //                     currentPage={currentPage}
// //                     totalRows={totalRows}
// //                     startIndex={startIndex}
// //                     pageSize={pageSize}
// //                     handlePageSizeChange={handlePageSizeChange}
// //                     handlePreviousPage={handlePreviousPage}
// //                     handleNextPage={handleNextPage}
// //                     totalPages={totalPages}
// //                   />

// //                   <Drawer
// //                     anchor="right"
// //                     open={openDrawer}
// //                     onClose={() => setOpenDrawer(true)}
// //                   >
// //                     <Box sx={{ width: 500, p: 3 }}>
// //                       <IvrsDidAddForm
// //                         setOpenDrawer={setOpenDrawer}
// //                         setData={setData}
// //                         handleShow={handleShow}
// //                       />
// //                     </Box>
// //                   </Drawer>

// //                   <Drawer
// //                     anchor="right"
// //                     open={openEditDrawer}
// //                     onClose={() => setOpenEditDrawer(false)}
// //                   >
// //                     <Box sx={{ width: 500, p: 3 }}>
// //                       <IvrsDidEditForm
// //                         // onClose={handleCloseEditDrawer}

// //                         selectedDidData={selectedDidData}
// //                         setOpenEditDrawer={setOpenEditDrawer}
// //                         setData={setData}
// //                         handleShow={handleShow}
// //                       />
// //                     </Box>
// //                   </Drawer>

// //                   {/* Render your data grid or table component here using the columns definition */}
// //                   {/* Example: <DataGrid rows={rows} columns={columns} /> */}

// //                   {/* Render the confirmation dialog */}
// //                   <StatusConfirmation
// //                     open={openStatus}
// //                     onClose={() => setOpenStatus(false)}
// //                     type={statusType}
// //                     name={tableDidData?.compnm}
// //                     description={tableDidData?.descr}
// //                     onDescriptionChange={(e) => setDescription(e.target.value)}
// //                     onUpdate={handleUpdate}
// //                   />
// //                 </Box>
// //               </Card>
// //             </Grid>
// //           </Grid>
// //           <Snackbar
// //             open={snackbar.open}
// //             autoHideDuration={3000}
// //             onClose={handleCloseSnackbar}
// //             anchorOrigin={{ vertical: "top", horizontal: "left" }}
// //           >
// //             <Alert
// //               onClose={handleCloseSnackbar}
// //               severity={snackbar.severity}
// //               variant="filled"
// //               sx={{ width: "100%" }}
// //             >
// //               {snackbar.message}
// //             </Alert>
// //           </Snackbar>
// //         </Box>
// //       )}
// //     </>
// //   );
// // };

// // export default IvrsDidListTable;

// /// Filters
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   Drawer,
//   TextField,
//   IconButton,
//   Grid,
//   Autocomplete,
//   MenuItem,
//   Paper,
//   Chip,
// } from "@mui/material";
// import CancelIcon from "@mui/icons-material/Cancel";
// import axios from "axios";
// import IvrsDidListTable from "./Ivrs-did-table";
// import { v4 as uuidv4 } from "uuid";

// const FilterDrawer = () => {
//   const [openDrawer, setOpenDrawer] = useState(false);
//   const [dropdownData, setDropdownData] = useState({
//     tsp: [],
//     account: [],
//     route: [],
//   });

//   const [formData, setFormData] = useState({
//     tsp: ["-1"], // Ensuring it's an array for multi-select
//     account: ["-1"],
//     route: ["-1"],
//     status: "-1",
//   });

//   const [tableDidData, setTableDidData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const apiurl = process.env.REACT_APP_API_URL;

//   // useEffect(() => {
//   //   if (openDrawer) {
//   //     fetchDropdownData();
//   //   }
//   // }, [openDrawer]);
//   useEffect(() => {
//     // if (openDrawer) {
//     fetchDropdownData();
//     // }
//   }, []);

//   const fetchDropdownData = async () => {
//     try {
//       const [tspRes, routeRes, accountRes] = await Promise.all([
//         axios.post(`${apiurl}/tsp_drp`, {
//           lml: "67a455659d796",
//           mtyp: "5c2e5b697d91c",
//         }),
//         axios.post(`${apiurl}/route_drp_acc_did`, {
//           lml: "67a455659d796",
//           mtyp: "5c2e5b697d91c",
//         }),
//         axios.post(`${apiurl}/acc_list_module`, {
//           lml: "67a455659d796",
//           mtyp: "5c2e5b697d91c",
//         }),
//       ]);

//       setDropdownData({
//         tsp: [
//           { uni: "-1", nm: "All" },
//           ...(tspRes?.data?.resp?.tsp_list || []),
//         ],
//         account: [
//           { acuni: "-1", unm: "All" },
//           ...(accountRes?.data?.resp?.acc_users_call_log || []),
//         ],
//         route: [
//           { runi: "-1", rtnm: "All" },
//           ...(routeRes?.data?.resp?.route || []),
//         ],
//       });
//     } catch (error) {
//       console.error("Error fetching dropdown data:", error);
//     }
//   };

//   const handleChange = (name, value) => {
//     console.log(value);
//     if (name === "status") {
//       // Status is a single value, so no need to use filter
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     } else {
//       // Handle multi-select filters (TSP, Account, Route)
//       if (value.includes("-1")) {
//         setFormData((prev) => ({
//           ...prev,
//           [name]: ["-1"], // Reset to ["-1"] if "All" is selected
//         }));
//       } else {
//         setFormData((prev) => ({
//           ...prev,
//           [name]: value.filter((v) => v !== "-1"), // Filter out "-1" if other values are selected
//         }));
//       }
//     }
//   };

//   // const handleShow = async () => {
//   //   setLoading(true);
//   //   setError(null);
//   //   try {
//   //     const response = await axios.post(`${apiurl}/ivrs_did_list_v2`, {
//   //       lml: "67a455659d796",
//   //       page: 1,
//   //       acc:
//   //         formData?.account?.length > 0 ? formData.account.join("','") : "-1",
//   //       tsp: formData?.tsp?.length > 0 ? formData.tsp.join("','") : "-1",
//   //       rout: formData?.route?.length > 0 ? formData.route.join("','") : "-1",
//   //       rtype: formData.status, // Passing the status correctly here
//   //     });

//   //     if (response?.data?.resp?.error_code === "0") {
//   //       setOpenDrawer(false);
//   //       setTableDidData(
//   //         response?.data?.resp?.ivrsdidlist?.map((item, index) => ({
//   //           ...item,
//   //           id: index + 1,
//   //         })) || []
//   //       );
//   //     } else {
//   //       throw new Error(response.data.resp.message);
//   //     }
//   //   } catch (error) {
//   //     console.error("Error fetching filtered data:", error);
//   //     setError(error.message || "An unexpected error occurred.");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleShow = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.post(`${apiurl}/ivrs_did_list_v2`, {
//         lml: "67a455659d796",
//         page: 1,
//         acc:
//           formData?.account?.length > 0 ? formData.account.join("','") : "-1",
//         tsp: formData?.tsp?.length > 0 ? formData.tsp.join("','") : "-1",
//         rout: formData?.route?.length > 0 ? formData.route.join("','") : "-1",
//         rtype: formData.status, // Passing the status correctly here
//       });

//       if (response?.data?.resp?.error_code === "0") {
//         setOpenDrawer(false);
//         setTableDidData(
//           response?.data?.resp?.ivrsdidlist?.map((item, index) => ({
//             ...item,
//             id: index + 1, // You can use this as the serial number if needed
//             uuiv: `${index}-${uuidv4()}`, // Generates a unique value combining the index and a UUID
//           })) || []
//         );
//       } else {
//         throw new Error(response.data.resp.message);
//       }
//     } catch (error) {
//       console.error("Error fetching filtered data:", error);
//       setError(error.message || "An unexpected error occurred.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Box mt={2} mr={2} textAlign="end">
//         {/* <Button
//           variant="contained"
//           color="primary"
//           onClick={() => setOpenDrawer(true)}
//         >
//           Open Filters
//         </Button> */}

//         {/* <Drawer
//           anchor="top"
//           open={openDrawer}
//           onClose={() => setOpenDrawer(true)}
//         > */}
//         <Box p={2} sx={{ width: "97%", backgroundColor: "#fff" }}>
//           {/* <Grid container justifyContent="space-between" alignItems="center">
//             <Typography variant="h6">Filter Options</Typography>
//             <IconButton onClick={() => setOpenDrawer(false)}>
//               <CancelIcon />
//             </IconButton>
//           </Grid> */}

//           <Grid container alignItems="center" spacing={2} flexWrap="wrap">
//             {/* TSP Filter */}
//             <Grid item xs={12} sm={6} md={2.8}>
//               <Autocomplete
//                 multiple
//                 options={dropdownData?.tsp || []}
//                 getOptionLabel={(option) => option.nm || ""}
//                 value={dropdownData.tsp.filter((opt) =>
//                   formData.tsp.includes(opt.uni)
//                 )}
//                 onChange={(event, newValue) => {
//                   const selectedValues = newValue.map((item) => item.uni);
//                   handleChange("tsp", selectedValues);
//                 }}
//                 renderInput={(params) => (
//                   <TextField {...params} label="TSP" variant="outlined" />
//                 )}
//               />
//             </Grid>
//             {/* <Grid item xs={12} sm={6} md={2.8}>
//                 <Autocomplete
//                   multiple
//                   options={dropdownData?.tsp || []}
//                   getOptionLabel={(option) => option.nm || ""}
//                   value={dropdownData.tsp.filter((opt) =>
//                     formData.tsp.includes(opt.uni)
//                   )}
//                   onChange={(event, newValue) => {
//                     const selectedValues = newValue.map((item) => item.uni);
//                     handleChange("tsp", selectedValues);
//                   }}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="TSP"
//                       variant="outlined"
//                       sx={{
//                         // backgroundColor: "#ffeb3b", // Yellow Background
//                         "& .MuiOutlinedInput-root": {
//                           "& fieldset": {
//                             borderColor: "#fbc02d", // Yellow border
//                           },
//                         },
//                       }}
//                     />
//                   )}
//                   renderOption={(props, option, { selected }) => (
//                     <li
//                       {...props}
//                       style={{
//                         backgroundColor: selected ? "#1976d2" : "", // Blue background when selected
//                         color: selected ? "white" : "", // White text when selected
//                         padding: "8px", // Adjust padding for better spacing
//                       }}
//                     >
//                       {option.nm}
//                     </li>
//                   )}
//                 />
//               </Grid> */}
//             {/* Account Filter */}
//             {/* <Grid item xs={12} sm={6} md={2.8}>
//               <Autocomplete
//                 multiple
//                 options={dropdownData?.account || []}
//                 getOptionLabel={(option) => option.unm || ""}
//                 value={dropdownData.account.filter((opt) =>
//                   formData.account.includes(opt.acuni)
//                 )}
//                 onChange={(event, newValue) =>
//                   handleChange(
//                     "account",
//                     newValue.map((item) => item.acuni)
//                   )
//                 }
//                 renderInput={(params) => (
//                   <TextField {...params} label="Account" variant="outlined" />
//                 )}
//               />
//             </Grid> */}

//             {/* <Grid item xs={12} sm={6} md={2.8}>
//               <Autocomplete
//                 multiple
//                 options={dropdownData?.account || []}
//                 getOptionLabel={(option) => option.unm || ""}
//                 value={dropdownData.account.filter((opt) =>
//                   formData.account.includes(opt.acuni)
//                 )}
//                 onChange={(event, newValue) =>
//                   handleChange(
//                     "account",
//                     newValue.map((item) => item.acuni)
//                   )
//                 }
//                 // This prop tells Autocomplete to show only three tags by default.
//                 limitTags={3}
//                 // Custom rendering of the tags (chips)
//                 renderTags={(value, getTagProps) => {
//                   const tags = value.slice(0, 2).map((option, index) => (
//                     <Chip
//                       key={option.acuni}
//                       label={option.unm}
//                       {...getTagProps({ index })}
//                       sx={{
//                         fontSize: "0.875rem",
//                         margin: "2px",
//                         bgcolor: "#e0f7fa",
//                         color: "#006064",
//                       }}
//                     />
//                   ));

//                   // If more than three items are selected, add an extra chip to show the number of additional selections.
//                   if (value.length > 2) {
//                     tags.push(
//                       <Chip
//                         key="extra"
//                         label={`+${value.length - 3} more`}
//                         sx={{
//                           fontSize: "0.875rem",
//                           margin: "2px",
//                           bgcolor: "#ffeb3b",
//                           color: "#000",
//                         }}
//                       />
//                     );
//                   }
//                   return tags;
//                 }}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Account"
//                     variant="outlined"
//                     sx={{
//                       // Adjust the TextField height and inner input styles
//                       "& .MuiOutlinedInput-root": {
//                         height: 50,
//                         borderRadius: "8px",
//                         backgroundColor: "#f5f5f5",
//                         "& fieldset": {
//                           borderColor: "#ccc",
//                         },
//                         "&:hover fieldset": {
//                           borderColor: "#999",
//                         },
//                         "&.Mui-focused fieldset": {
//                           borderColor: "#3f51b5",
//                         },
//                         "& input": {
//                           padding: "0 8px",
//                           fontSize: "0.875rem",
//                         },
//                       },
//                       "& .MuiInputLabel-root": {
//                         fontSize: "0.875rem",
//                       },
//                     }}
//                   />
//                 )}
//                 // Styling for the dropdown list options
//                 ListboxProps={{
//                   sx: {
//                     bgcolor: "#fff",
//                     "& .MuiAutocomplete-option": {
//                       padding: "10px",
//                       fontSize: "14px",
//                       '&[aria-selected="true"]': {
//                         backgroundColor: "primary.main",
//                         color: "white",
//                       },
//                       "&:hover": {
//                         backgroundColor: "primary.light",
//                       },
//                     },
//                   },
//                 }}
//                 // Custom Paper styling for the dropdown container
//                 PaperComponent={(props) => (
//                   <Paper
//                     {...props}
//                     sx={{
//                       boxShadow: 3,
//                       borderRadius: "8px",
//                       bgcolor: "#fafafa",
//                     }}
//                   />
//                 )}
//               />
//             </Grid>
//             {/* Route Filter */}
//             {/* <Grid item xs={12} sm={6} md={2.7}>
//               <Autocomplete
//                 multiple
//                 options={dropdownData?.route || []}
//                 getOptionLabel={(option) => option.rtnm || ""}
//                 value={dropdownData.route.filter((opt) =>
//                   formData.route.includes(opt.runi)
//                 )}
//                 onChange={(event, newValue) =>
//                   handleChange(
//                     "route",
//                     newValue.map((item) => item.runi)
//                   )
//                 }
//                 renderInput={(params) => (
//                   <TextField {...params} label="Routes" variant="outlined" />
//                 )}
//               />
//             </Grid> */}
//             {/* Status Filter */}
//             {/* <Grid item xs={12} sm={6} md={3}>
//                 <TextField
//                   select
//                   fullWidth
//                   label="Status"
//                   value={formData.status}
//                   onChange={(e) => handleChange("status", e.target.value)}
//                 >
//                   <MenuItem value="-1">All</MenuItem>
//                   <MenuItem value="1">Active</MenuItem>
//                   <MenuItem value="2">Suspended</MenuItem>
//                   <MenuItem value="3">Expired</MenuItem>
//                 </TextField>
//               </Grid> */}
//             <Grid item xs={12} sm={6} md={2.7}>
//               <Autocomplete
//                 options={[
//                   { label: "All", value: "-1" },
//                   { label: "Active", value: "1" },
//                   { label: "Suspended", value: "2" },
//                   { label: "Expired", value: "3" },
//                 ]}
//                 getOptionLabel={(option) => option.label}
//                 value={
//                   [
//                     { label: "All", value: "-1" },
//                     { label: "Active", value: "1" },
//                     { label: "Suspended", value: "2" },
//                     { label: "Expired", value: "3" },
//                   ].find((opt) => opt.value === formData.status) || null
//                 }
//                 onChange={(event, newValue) => {
//                   handleChange("status", newValue ? newValue.value : "-1");
//                 }}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Status"
//                     variant="outlined"
//                     fullWidth
//                   />
//                 )}
//               />
//             </Grid>
//             {/* Show Button */}
//             <Grid item xs={12} sm={6} md={1}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleShow}
//                 fullWidth
//               >
//                 Show
//               </Button>
//             </Grid>
//           </Grid>
//         </Box>
//         {/* </Drawer> */}
//       </Box>

//       <Box mt={0.5}>
//         <IvrsDidListTable tableDidData={tableDidData} handleShow={handleShow} />
//       </Box>
//     </>
//   );
// };

// export default FilterDrawer; */}

// //formDatas={formData}
