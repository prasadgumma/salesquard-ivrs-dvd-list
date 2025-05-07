// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   Drawer,
//   TextField,
//   MenuItem,
//   IconButton,
//   FormControl,
//   Autocomplete,
//   Grid,
// } from "@mui/material";
// import CancelIcon from "@mui/icons-material/Cancel";
// import axios from "axios";
// import IvrsDidListTable from "./Ivrs-did-table";

// const FilterDrawer = () => {
//   const [openDrawer, setOpenDrawer] = useState(false);
//   const [dropdownData, setDropdownData] = useState({
//     tsp: [],
//     account: [],
//     route: [],
//   });

//   const [formData, setFormData] = useState({
//     tsp: "-1" || [],
//     account: "-1" || [],
//     route: "-1" || [],
//     status: "-1",
//     rtype: "",
//   });
//   const [tableDidData, setTableDidData] = useState([]);

//   const apiurl = process.env.REACT_APP_API_URL; // Replace with your API URL

//   useEffect(() => {
//     if (openDrawer) {
//       fetchDropdownData();
//     }
//   }, [openDrawer]);
//   const fetchDropdownData = async () => {
//     try {
//       const [tspRes, routeRes, accountRes] = await Promise.all([
//         axios.post(`${apiurl}/tsp_drp`, {
//           lml: "6791e8bd363b6",
//           mtyp: "5c2e5b697d91c",
//         }),
//         axios.post(`${apiurl}/route_drp_acc_did`, {
//           lml: "6791e8bd363b6",
//           mtyp: "5c2e5b697d91c",
//         }),
//         axios.post(`${apiurl}/acc_list_module`, {
//           lml: "6791e8bd363b6",
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
//       (tspRes, "dropdownData");
//     } catch (error) {
//       console.error("Error fetching dropdown data:", error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleShow = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.post(`${apiurl}/ivrs_did_list_v2`, {
//         lml: "6791e8bd363b6",
//         page: 1,
//         acc: formData.account,
//         tsp: formData.tsp,
//         rout: formData.route,
//         status: formData.status,
//       });

//       if (response?.data?.resp?.error_code === "0") {
//         const TableDidDataAll =
//           response?.data?.resp?.ivrsdidlist?.map((tableDidData, index) => ({
//             ...tableDidData,
//             id: index + 1, // Assigning serial number
//           })) || [];
//         setTableDidData(TableDidDataAll);
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

//   (tableDidData.length, "Tdata");

//   return (
//     <>
//       <Box mt={2} mr={2} textAlign={"end"}>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => setOpenDrawer(true)}
//         >
//           Open Filters
//         </Button>

//         <Drawer
//           anchor="top"
//           open={openDrawer}
//           onClose={() => setOpenDrawer(false)}
//         >
//           <Box
//             p={2}
//             sx={{
//               width: "97%",
//               backgroundColor: "#fff",
//             }}
//           >
//             <Box>
//               <Grid
//                 xs={12}
//                 sm={12}
//                 md={12}
//                 lg={12}
//                 display={"flex"}
//                 justifyContent={"space-between"}
//               >
//                 <Typography variant="h6">Filter Options</Typography>

//                 <IconButton onClick={() => setOpenDrawer(false)}>
//                   <CancelIcon />
//                 </IconButton>
//               </Grid>
//             </Box>
//             <Grid container alignItems="center" spacing={2} flexWrap="wrap">
//               <Grid item xs={3} sm={4} md={6} lg={2.5}>
//                 <FormControl
//                   fullWidth
//                   required
//                   sx={{
//                     "& .MuiInputBase-root": { height: 50 },
//                   }}
//                 >
//                   <Autocomplete
//                     multiple
//                     options={dropdownData?.tsp || []}
//                     getOptionLabel={(option) => option.nm}
//                     value={dropdownData?.tsp.filter((opt) =>
//                       formData.tsp.includes(opt.uni)
//                     )}
//                     onChange={(event, newValue) => {
//                       handleChange({
//                         target: {
//                           name: "tsp",
//                           value: newValue.map((item) => item.uni),
//                         },
//                       });
//                     }}
//                     renderInput={(params) => (
//                       <TextField
//                         {...params}
//                         label="TSP"
//                         variant="outlined"
//                         sx={{
//                           "& .MuiOutlinedInput-root": {
//                             backgroundColor: "#f9f9f9",
//                             borderRadius: "8px",
//                           },
//                           "& .MuiOutlinedInput-notchedOutline": {
//                             borderColor: "#1976d2",
//                           },
//                           "&:hover .MuiOutlinedInput-notchedOutline": {
//                             borderColor: "#1565c0",
//                           },
//                           "& .MuiInputLabel-root": {
//                             color: "#1976d2",
//                           },
//                         }}
//                       />
//                     )}
//                   />
//                 </FormControl>
//               </Grid>

//               {/* Account Filter */}
//               <Grid item xs={3} sm={4} md={6} lg={2.5}>
//                 <FormControl
//                   fullWidth
//                   required
//                   sx={{
//                     "& .MuiInputBase-root": { height: 50 },
//                   }}
//                 >
//                   <Autocomplete
//                     multiple
//                     options={dropdownData?.account || []}
//                     getOptionLabel={(option) => option.unm || ""}
//                     value={dropdownData?.account.filter((opt) =>
//                       formData.account.includes(opt.acuni)
//                     )}
//                     onChange={(event, newValue) => {
//                       handleChange({
//                         target: {
//                           name: "account",
//                           value: newValue.map((item) => item.acuni), // Store selected account IDs
//                         },
//                       });
//                     }}
//                     renderInput={(params) => (
//                       <TextField
//                         {...params}
//                         label="Account"
//                         variant="outlined"
//                         sx={{
//                           "& .MuiOutlinedInput-root": {
//                             backgroundColor: "#f9f9f9",
//                             borderRadius: "8px",
//                           },
//                           "& .MuiOutlinedInput-notchedOutline": {
//                             borderColor: "#1976d2",
//                           },
//                           "&:hover .MuiOutlinedInput-notchedOutline": {
//                             borderColor: "#1565c0",
//                           },
//                           "& .MuiInputLabel-root": {
//                             color: "#1976d2",
//                           },
//                         }}
//                       />
//                     )}
//                   />
//                 </FormControl>
//               </Grid>

//               {/* Routes Filter */}
//               <Grid item xs={3} sm={4} md={6} lg={2.5}>
//                 <FormControl
//                   fullWidth
//                   required
//                   sx={{
//                     "& .MuiInputBase-root": { height: 50 },
//                   }}
//                 >
//                   <Autocomplete
//                     multiple
//                     options={dropdownData?.route || []}
//                     getOptionLabel={(option) => option.rtnm || ""}
//                     value={dropdownData?.route.filter((opt) =>
//                       formData.route.includes(opt.runi)
//                     )}
//                     onChange={(event, newValue) => {
//                       handleChange({
//                         target: {
//                           name: "route",
//                           value: newValue.map((item) => item.runi), // Store selected route IDs
//                         },
//                       });
//                     }}
//                     renderInput={(params) => (
//                       <TextField
//                         {...params}
//                         label="Routes"
//                         variant="outlined"
//                         sx={{
//                           "& .MuiOutlinedInput-root": {
//                             backgroundColor: "#f9f9f9",
//                             borderRadius: "8px",
//                           },
//                           "& .MuiOutlinedInput-notchedOutline": {
//                             borderColor: "#1976d2",
//                           },
//                           "&:hover .MuiOutlinedInput-notchedOutline": {
//                             borderColor: "#1565c0",
//                           },
//                           "& .MuiInputLabel-root": {
//                             color: "#1976d2",
//                           },
//                         }}
//                       />
//                     )}
//                   />
//                 </FormControl>
//               </Grid>

//               {/* Status Filter */}
//               <Grid item xs={3} sm={4} md={6} lg={2.5}>
//                 <FormControl
//                   fullWidth
//                   sx={{
//                     "& .MuiInputBase-root": { height: 50 },
//                   }}
//                 >
//                   <Autocomplete
//                     options={[
//                       { value: "-1", label: "All" },
//                       { value: "1", label: "Active" },
//                       { value: "2", label: "Suspended" },
//                       { value: "3", label: "Expired" },
//                     ]}
//                     getOptionLabel={(option) => option.label}
//                     value={
//                       [
//                         { value: "-1", label: "All" },
//                         { value: "1", label: "Active" },
//                         { value: "2", label: "Suspended" },
//                         { value: "3", label: "Expired" },
//                       ].find(
//                         (item) => item.value === (formData.status || "-1")
//                       ) || null
//                     }
//                     onChange={(event, newValue) => {
//                       handleChange({
//                         target: {
//                           name: "status",
//                           value: newValue?.value || "-1",
//                         },
//                       });
//                     }}
//                     renderInput={(params) => (
//                       <TextField
//                         {...params}
//                         label="Status"
//                         variant="outlined"
//                         sx={{
//                           "& .MuiOutlinedInput-root": {
//                             backgroundColor: "#f9f9f9",
//                             borderRadius: "8px",
//                           },
//                           "& .MuiOutlinedInput-notchedOutline": {
//                             borderColor: "#1976d2",
//                           },
//                           "&:hover .MuiOutlinedInput-notchedOutline": {
//                             borderColor: "#1565c0",
//                           },
//                           "& .MuiInputLabel-root": {
//                             color: "#1976d2",
//                           },
//                         }}
//                       />
//                     )}
//                   />
//                 </FormControl>
//               </Grid>

//               {/* Show Button */}
//               <Grid item xs={2} sm={4} md={6} lg={2}>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={handleShow}
//                   fullWidth
//                 >
//                   Show
//                 </Button>
//               </Grid>
//             </Grid>
//           </Box>
//         </Drawer>
//       </Box>
//       <Box mt={0.5}>
//         <IvrsDidListTable tableDidData={tableDidData} />
//       </Box>
//     </>
//   );
// };

// export default FilterDrawer;

// Dummy Code

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
// } from "@mui/material";
// import CancelIcon from "@mui/icons-material/Cancel";
// import axios from "axios";
// import IvrsDidListTable from "./Ivrs-did-table";

// const FilterDrawer = () => {
//   const [openDrawer, setOpenDrawer] = useState(false);
//   const [dropdownData, setDropdownData] = useState({
//     tsp: [],
//     account: [],
//     route: [],
//   });

//   // Ensure "All" is selected by default
//   const [formData, setFormData] = useState({
//     tsp: ["-1"],
//     account: ["-1"],
//     route: ["-1"],
//     status: "-1",
//     rtype: "-1",
//   });

//   const [tableDidData, setTableDidData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const apiurl = process.env.REACT_APP_API_URL;

//   useEffect(() => {
//     if (openDrawer) {
//       fetchDropdownData();
//     }
//   }, [openDrawer]);

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
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value.length > 0 ? value : ["-1"], // Ensure "All" is selected if empty
//     }));
//   };

//   const handleShow = async () => {
//     setLoading(true);
//     setError(null);
//     (formData.account.length);
//     try {
//       const response = await axios.post(`${apiurl}/ivrs_did_list_v2`, {
//         lml: "67a455659d796",
//         page: 1,
//         acc: formData.account.length > 0 ? formData.account.join("','") : "-1",
//         tsp: formData.tsp.length > 0 ? formData.tsp.join("','") : "-1", // Convert array to comma-separated string
//         rout: formData.route.length > 0 ? formData.route.join("','") : "-1",
//         status: formData.status,
//       });

//       if (response?.data?.resp?.error_code === "0") {
//         setOpenDrawer(false);
//         setTableDidData(
//           response?.data?.resp?.ivrsdidlist?.map((item, index) => ({
//             ...item,
//             id: index + 1, // Assigning serial number
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
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => setOpenDrawer(true)}
//         >
//           Open Filters
//         </Button>

//         <Drawer
//           anchor="top"
//           open={openDrawer}
//           onClose={() => setOpenDrawer(false)}
//         >
//           <Box p={2} sx={{ width: "97%", backgroundColor: "#fff" }}>
//             <Grid container justifyContent="space-between" alignItems="center">
//               <Typography variant="h6">Filter Options</Typography>
//               <IconButton onClick={() => setOpenDrawer(false)}>
//                 <CancelIcon />
//               </IconButton>
//             </Grid>

//             <Grid container alignItems="center" spacing={2} flexWrap="wrap">
//               {/* TSP Filter */}
//               <Grid item xs={12} sm={6} md={3}>
//                 <Autocomplete
//                   multiple
//                   options={dropdownData?.tsp || []}
//                   getOptionLabel={(option) => option.nm || ""}
//                   value={dropdownData.tsp.filter((opt) =>
//                     formData.tsp.includes(opt.uni)
//                   )}
//                   onChange={(event, newValue) => {
//                     handleChange(
//                       "tsp",
//                       newValue.length > 0
//                         ? newValue.map((item) => item.uni)
//                         : ["-1"]
//                     );
//                   }}
//                   renderInput={(params) => (
//                     <TextField {...params} label="TSP" variant="outlined" />
//                   )}
//                 />
//               </Grid>

//               {/* Account Filter */}
//               <Grid item xs={12} sm={6} md={3}>
//                 <Autocomplete
//                   multiple
//                   options={dropdownData?.account || []}
//                   getOptionLabel={(option) => option.unm || ""}
//                   value={dropdownData.account.filter((opt) =>
//                     formData.account.includes(opt.acuni)
//                   )}
//                   onChange={(event, newValue) =>
//                     handleChange(
//                       "account",
//                       newValue.length > 0
//                         ? newValue.map((item) => item.acuni)
//                         : ["-1"]
//                     )
//                   }
//                   renderInput={(params) => (
//                     <TextField {...params} label="Account" variant="outlined" />
//                   )}
//                 />
//               </Grid>

//               {/* Route Filter */}
//               <Grid item xs={12} sm={6} md={3}>
//                 <Autocomplete
//                   multiple
//                   options={dropdownData?.route || []}
//                   getOptionLabel={(option) => option.rtnm || ""}
//                   value={dropdownData.route.filter((opt) =>
//                     formData.route.includes(opt.runi)
//                   )}
//                   onChange={(event, newValue) =>
//                     handleChange(
//                       "route",
//                       newValue.length > 0
//                         ? newValue.map((item) => item.runi)
//                         : ["-1"]
//                     )
//                   }
//                   renderInput={(params) => (
//                     <TextField {...params} label="Routes" variant="outlined" />
//                   )}
//                 />
//               </Grid>

//               {/* Status Filter */}
//               <Grid item xs={12} sm={6} md={3}>
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
//               </Grid>

//               {/* Show Button */}
//               <Grid item xs={12} sm={6} md={3}>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={handleShow}
//                   fullWidth
//                 >
//                   Show
//                 </Button>
//               </Grid>
//             </Grid>
//           </Box>
//         </Drawer>
//       </Box>

//       <Box mt={0.5}>
//         <IvrsDidListTable tableDidData={tableDidData} />
//       </Box>
//     </>
//   );
// };

// export default FilterDrawer;

// With Drawer UI

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
// } from "@mui/material";
// import CancelIcon from "@mui/icons-material/Cancel";
// import axios from "axios";
// import IvrsDidListTable from "./Ivrs-did-table";

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
//     (value);
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

//   const handleShow = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.post(`${apiurl}/ivrs_did_list_v2`, {
//         lml: "67a455659d796",
//         page: 1,
//         acc: formData.account.length > 0 ? formData.account.join("','") : "-1",
//         tsp: formData.tsp.length > 0 ? formData.tsp.join("','") : "-1",
//         rout: formData.route.length > 0 ? formData.route.join("','") : "-1",
//         rtype: formData.status, // Passing the status correctly here
//       });

//       if (response?.data?.resp?.error_code === "0") {
//         setOpenDrawer(false);
//         setTableDidData(
//           response?.data?.resp?.ivrsdidlist?.map((item, index) => ({
//             ...item,
//             id: index + 1,
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
//             <Grid item xs={12} sm={6} md={2.8}>
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
//             </Grid>

//             {/* Route Filter */}
//             <Grid item xs={12} sm={6} md={2.7}>
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
//             </Grid>

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
//         <IvrsDidListTable tableDidData={tableDidData} />
//       </Box>
//     </>
//   );
// };

// export default FilterDrawer;

//---------------------

// import React, { useContext, useEffect, useState } from "react";
// import {
//   Typography,
//   Box,
//   Grid,
//   Card,
//   Button,
//   IconButton,
//   Drawer,
//   Snackbar,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   FormGroup,
//   FormControlLabel,
//   Checkbox,
//   DialogActions,
//   Modal,
//   TextField,
// } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import { Edit, Delete } from "@mui/icons-material";
// import IvrsDidAddForm from "./Add-Did-Form";
// import IvrsDidEditForm from "./Edit-Did-Form";
// import axios from "axios";
// import MD5 from "crypto-js/md5";
// import StatusConfirmation from "./Confirmation-Dilogue";
// import CustomPagination from "./CustomPagination";
// import TableBottomActions from "./Table-Bottom-Actions";
// import { FilterContext } from "../context/FilterProvider";
// import SearchIcon from "@mui/icons-material/Search";
// import MyFilterDrawer from "./My-Filter-Drawer";
// import FilterListIcon from "@mui/icons-material/FilterList";
// import AddSharpIcon from "@mui/icons-material/AddSharp";
// import DeleteIcon from "@mui/icons-material/Delete";

// const modalStyle = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   borderRadius: "8px",
//   boxShadow: 24,
//   p: 4,
// };

// const tableStyles = {
//   height: "76vh",
//   width: "100vw",

//   "& .MuiDataGrid-root": {
//     fontFamily: "mulish, sans-serif",
//     fontSize: "16px",
//   },

//   "& .MuiDataGrid-cell": {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     fontSize: "15px",
//     fontWeight: 500,
//     color: "#333",
//     borderRight: "1px solid rgb(217, 211, 211)", // Add vertical lines in cells
//     bgcolor: "#ffffff",
//   },

//   "& .MuiDataGrid-columnHeader": {
//     backgroundColor: "#0f0f0f",
//     color: "white",
//     fontWeight: "bold",
//     fontSize: "16px",
//     maxHeight: 80,
//   },

//   "& .MuiDataGrid-columnHeaderTitle": {
//     color: "#ffff",
//   },

//   "& .MuiDataGrid-menuIconButton": {
//     color: "white !important",
//     opacity: 1,
//   },

//   "& .MuiDataGrid-columnMenuIcon": {
//     color: "white !important",
//   },

//   "& .MuiDataGrid-columnHeaders .MuiSvgIcon-root": {
//     color: "white !important",
//   },

//   "& .MuiDataGrid-sortIcon, & .MuiDataGrid-filterIcon": {
//     color: "white !important",
//   },

//   "& .MuiDataGrid-row:nth-of-type(odd)": {
//     backgroundColor: "#f9f9f9",
//   },
//   "& .MuiDataGrid-row:nth-of-type(even)": {
//     backgroundColor: "#ffffff",
//   },

//   "& .MuiDataGrid-row:hover": {
//     backgroundColor: "#e3f2fd",
//   },

//   "& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root": {
//     color: "white",
//   },

//   "& .MuiDataGrid-cell--withRenderer": {
//     justifyContent: "center",
//   },
// };

// const IvrsDidListTable = ({ handleShow }) => {
//   const { data, setData } = useContext(FilterContext);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });
//   const [openDrawer, setOpenDrawer] = useState(false);
//   const [openStatus, setOpenStatus] = useState(false);
//   const [statusType, setStatusType] = useState(null);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [description, setDescription] = useState("");
//   const [selectedModuleNames, setSelectedModuleNames] = useState([]);
//   const [openEditDrawer, setOpenEditDrawer] = useState(false);
//   const [selectedDidData, setSelectedDidData] = useState(null);
//   const [open, setOpen] = useState(false);
//   const [selectedModules, setSelectedModules] = useState([]);
//   const [moduleOptions, setModuleOptions] = useState([]);
//   const [editingRow, setEditingRow] = useState(null);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [selectedIvrsRows, setSelectedIvrsRows] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const [openDelete, setOpenDelete] = useState(false);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchText, setSearchText] = useState(""); // Search input
//   const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
//   const toggleDrawer = () => setOpenFilterDrawer(!openFilterDrawer);
//   const [openModal, setOpenModal] = useState(false);
//   const apiurl = process.env.REACT_APP_API_URL; // Your API URL
//   // For pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(25);
//   const totalRows = filteredData?.length;
//   const startIndex = (currentPage - 1) * pageSize;
//   const paginatedRows =
//     pageSize === "All"
//       ? filteredData
//       : filteredData?.slice(startIndex, startIndex + pageSize);
//   const totalPages = pageSize === "All" ? 1 : Math.ceil(totalRows / pageSize);

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage((prev) => prev + 1);
//     }
//   };

//   const handlePreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage((prev) => prev - 1);
//     }
//   };

//   const handlePageSizeChange = (event) => {
//     const newSize = event.target.value;
//     setPageSize(newSize);
//     setCurrentPage(1); // Reset to first page on size change
//   };

//   const handleOpen = (row) => {
//     setEditingRow(row);
//     console.log(row, "Row");
//     // Pre-populate selectedModules if row.module exists
//     setSelectedModules(row.moduni !== null ? row?.moduni?.split(",") : []);
//     setSelectedModuleNames(
//       row.modnms ? row.modnms.split(",").map((n) => n.trim()) : []
//     );

//     setOpen(true);
//     axios
//       .post(`${apiurl}/mtype_drp_did`, {
//         lml: "67a455659d796",
//       })
//       .then((response) => {
//         if (response?.data?.resp?.error_code === "0") {
//           const options = Array.isArray(response?.data?.resp?.mtype_drp_did)
//             ? response?.data?.resp?.mtype_drp_did.map((item) => item)
//             : [];
//           setModuleOptions(options);
//         } else {
//           console.error("API returned an error", response.data);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching module options:", error);
//       });
//   };

//   const handleModuleSave = async () => {
//     if (editingRow) {
//       try {
//         const response = await axios.post(`${apiurl}/add_did_modules`, {
//           lml: "67a455659d796",
//           k: editingRow.ivrsduniq,
//           mod: selectedModules,
//           diduni: editingRow.diduni,
//           accuni: editingRow.accuni,
//           ip: "",
//           funm: "add_did_modules",
//         });

//         if (response?.data?.resp?.error_code === "0") {
//           setSnackbar({
//             open: true,
//             message: "Modules updated successfully.",
//             severity: "success",
//           });

//           setData((prevRows) => {
//             if (!prevRows || prevRows.length === 0) {
//               return prevRows;
//             }

//             const updatedRows = prevRows.map((row) =>
//               row.ivrsduniq === editingRow.ivrsduniq
//                 ? {
//                     ...row,
//                     modnms: selectedModuleNames?.join(", "),
//                     moduni: selectedModules.join(","),
//                   }
//                 : row
//             );
//             return [...updatedRows]; // Force re-render
//           });
//         } else {
//           setSnackbar({
//             open: true,
//             message: "Failed to update modules on the backend.",
//             severity: "error",
//           });
//         }
//       } catch (error) {
//         console.error("Error updating modules:", error);
//         setSnackbar({
//           open: true,
//           message: "Failed to update modules.",
//           severity: "error",
//         });
//       }

//       // Reset state
//       setEditingRow(null);
//       setSelectedModules([]);
//       setOpen(false);
//     }
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar((prev) => ({ ...prev, open: false }));
//   };

//   const handleOpenDialog = (row) => {
//     setSelectedRow(row);
//     setDescription(""); // Clear previous description
//     setStatusType(row.stat); // Assume stat === 1 means "suspended", so dialog shows "Resume"
//     setOpenStatus(true);
//   };

//   const handleUpdate = async () => {
//     if (!selectedRow) return;
//     // Determine the new status.
//     // Assume: stat === 1 means currently Suspended; thus, resume will change status to "2".
//     // And if not Suspended, we suspend (change status to "1").
//     const newStatus = selectedRow.stat === 1 ? 2 : 1;

//     const payload = {
//       lml: "67a455659d796",
//       accdid: `${selectedRow.compnm}-${selectedRow.unm}-${selectedRow.didnum}`,
//       k: selectedRow.ivrsduniq,
//       k1: newStatus,
//       des: description,
//     };

//     try {
//       const response = await axios.post(`${apiurl}/ivrs_did_suspend`, payload);

//       if (response?.data?.resp?.error_code === "0") {
//         // Update the context state, similar to your module update function.
//         setData((prevRows) => {
//           if (!prevRows || prevRows.length === 0) return prevRows;
//           const updatedRows = prevRows.map((row) =>
//             row.ivrsduniq === selectedRow.ivrsduniq
//               ? {
//                   ...row,
//                   stat: newStatus,
//                   sdes: description,
//                   sudt: new Date().toLocaleString(),
//                 }
//               : row
//           );
//           return [...updatedRows];
//         });

//         // Optionally update selectedRow if needed elsewhere.
//         setSelectedRow((prev) => ({
//           ...prev,
//           stat: newStatus,
//         }));

//         setSnackbar({
//           open: true,
//           message:
//             newStatus === 1
//               ? "Module Resumed successfully."
//               : "Module Suspended successfully.",
//           severity: "success",
//         });

//         setOpenStatus(false);
//       } else {
//         setSnackbar({
//           open: true,
//           message:
//             response?.data?.resp?.message ||
//             "Failed to update status on the backend.",
//           severity: "error",
//         });
//       }
//     } catch (error) {
//       console.error("API call error:", error);
//       setSnackbar({
//         open: true,
//         message: "Failed to update status.",
//         severity: "error",
//       });
//     }
//   };

//   const handleEditClick = async (row) => {
//     try {
//       const response = await axios.post(`${apiurl}/ivrs_did_elist`, {
//         lml: "67a455659d796",
//         k: MD5(row.ivrsduniq).toString(),
//       });

//       if (response.status === 200) {
//         const AllDidData = response?.data?.resp?.ivrsdidlist;
//         setSelectedDidData(AllDidData); // Save API response data for editing
//         setOpenEditDrawer(true); // Open the Edit Drawer
//       } else {
//         console.error("Empty response data");
//       }
//     } catch (error) {
//       console.error("Error fetching DID details:", error);
//     }
//   };

//   const handleDeleteClick = async (row) => {
//     try {
//       const response = await axios.post(`${apiurl}/ivrs_did_del`, {
//         lml: "67a455659d796", // Your session token
//         k: row.ivrsduniq, // Unique DID identifier (possibly MD5 hash if required)
//         k1: row.diduni, // Original unique identifier
//         sts: 1, // Status flag
//       });
//       if (response?.data?.resp?.error_code === "0") {
//         // Remove the deleted row from the data state
//         setData((prevData) =>
//           prevData.filter((item) => item.ivrsduniq !== row.ivrsduniq)
//         );
//         setSnackbar({
//           open: true,
//           message: "DID deleted successfully.",
//           severity: "success",
//         });
//       } else {
//         setSnackbar({
//           open: true,
//           message: "Failed to delete DID.",
//           severity: "error",
//         });
//       }
//     } catch (error) {
//       console.error("Error deleting DID:", error);
//       setSnackbar({
//         open: true,
//         message: "Error occurred during deletion.",
//         severity: "error",
//       });
//     }
//   };

//   const handleToggle = (module) => {
//     setSelectedModules((prevIds) =>
//       prevIds.includes(module.typuni)
//         ? prevIds.filter((id) => id !== module.typuni)
//         : [...prevIds, module.typuni]
//     );

//     setSelectedModuleNames((prevNames) => {
//       console.log("Before toggle:", prevNames, "module:", module.typnm);
//       return prevNames.includes(module.typnm)
//         ? prevNames.filter((name) => name !== module.typnm)
//         : [...prevNames, module.typnm];
//     });
//   };
//   const handleOpenDelete = () => setOpenDelete(true);
//   const handleCloseDelete = () => setOpenDelete(false);

//   const handleConfirmAllDelete = async () => {
//     try {
//       const uniqValues = selectedIvrsRows;

//       const response = await axios.post(`${apiurl}/v1/ivrs_did_del_multiple`, {
//         lml: "67a455659d796", // actual session token
//         k: uniqValues,
//       });

//       if (response?.data?.resp?.error_code === "0") {
//         setData((prevData) =>
//           prevData.filter((item) => !uniqValues.includes(item.ivrsduniq))
//         );

//         setSnackbar({
//           open: true,
//           message: "Selected DIDs deleted successfully.",
//           severity: "success",
//         });

//         setSelectedIvrsRows([]); // reset selection
//       } else {
//         setSnackbar({
//           open: true,
//           message: "Failed to delete selected DIDs.",
//           severity: "error",
//         });
//       }
//     } catch (error) {
//       console.error("Error deleting DIDs:", error);
//       setSnackbar({
//         open: true,
//         message: "Error occurred during deletion.",
//         severity: "error",
//       });
//     }

//     handleCloseDelete(); // close the delete confirmation dialog
//   };

//   useEffect(() => {
//     setFilteredData(data);
//   }, [data]);

//   const handleSearch = (event) => {
//     const searchTerm = event.target.value.toLowerCase();
//     setSearchText(searchTerm);

//     if (!searchTerm) {
//       setFilteredData(data); // Reset data when search is cleared
//       return;
//     }

//     const filteredResults = data.filter((row) =>
//       Object.values(row).some(
//         (value) =>
//           typeof value === "string" && value.toLowerCase().includes(searchTerm)
//       )
//     );

//     setFilteredData(filteredResults);
//     console.log(filteredData, "DataMy");
//   };

//   useEffect(() => {
//     // Update the "selectAll" checkbox if selectedRows length equals full data length.
//     setSelectAll(selectedRows.length === data.length && data.length > 0);
//   }, [selectedRows, data]);

//   const handleSelectAll = (event) => {
//     const checked = event.target.checked;
//     setSelectAll(checked);
//     if (checked) {
//       setOpenModal(true);
//     } else {
//       setSelectedRows([]);
//       setSelectAll(false);
//     }
//   };

//   const visibleSelected = paginatedRows
//     ? paginatedRows
//         .map((row) => row.id)
//         .filter((id) => selectedRows.includes(id))
//     : [];

//   const handleConfirmForAll = () => {
//     const allIds = data.map((row) => row.id);
//     const allIvrsIds = data.map((row) => row.ivrsduniq);
//     setSelectedRows(allIds);
//     setSelectedIvrsRows(allIvrsIds);
//     setSelectAll(true);
//     setOpenModal(false);
//   };

//   const handleCancelForAll = () => {
//     setOpenModal(false);
//     setSelectAll(false);
//   };

//   const columns = [
//     {
//       field: "id",
//       headerName: "S.No",
//       type: "number",
//       flex: 2,
//     },
//     {
//       field: "accontid",
//       headerAlign: "center",
//       headerName: "Account Id",
//       flex: 3.5,
//     },
//     {
//       field: "acca",
//       headerName: "Account",
//       headerAlign: "center",
//       flex: 3,
//       renderCell: (params) => (
//         <Typography
//           sx={{
//             color: "blue",
//             mt: 1.5,
//             cursor: "pointer",
//           }}
//           onClick={() =>
//             setSnackbar({
//               open: true,
//               message: `You clicked on account: ${params.value}`,
//               severity: "success",
//             })
//           }
//         >
//           {params.value}
//         </Typography>
//       ),
//     },
//     { field: "rtnm", headerAlign: "center", headerName: "Route", flex: 4 },
//     {
//       field: "mtype",
//       headerName: "Module",
//       flex: 5,
//       align: "center",
//       headerAlign: "center",
//       renderCell: (params) => {
//         return (
//           <Box mt={3}>
//             <Button
//               onClick={() => handleOpen(params.row)}
//               variant="contained"
//               color="success"
//             >
//               +
//             </Button>
//             <p>{params.row.modnms}</p>
//           </Box>
//         );
//       },
//     },
//     { field: "tspnm", headerAlign: "center", headerName: "TSP", flex: 2 },
//     {
//       field: "didnum",
//       headerAlign: "center",
//       headerName: "DID Number",
//       flex: 3.7,
//     },
//     { field: "ver", headerAlign: "center", headerName: "Version", flex: 2.5 },
//     { field: "didtyp", headerAlign: "center", headerName: "Type", flex: 2.5 },
//     {
//       field: "agtyp",
//       headerName: "Agent Type",
//       headerAlign: "center",
//       flex: 3.5,
//       renderCell: (params) => {
//         if (params.value === 0) return "1st Number Agent";
//         if (params.value === 1) return "2nd Number Agent";
//         return "Unknown";
//       },
//     },
//     {
//       field: "fdt",
//       headerName: "From",
//       headerAlign: "center",
//       flex: 3.2,
//     },
//     { field: "tdt", headerAlign: "center", headerName: "To", flex: 3.5 },
//     {
//       field: "descr",
//       headerAlign: "center",
//       headerName: "Description",
//       flex: 3.5,
//     },
//     {
//       field: "stat",
//       headerAlign: "center",
//       headerName: "Status",
//       flex: 6,
//       renderCell: (params) => (
//         <>
//           {params.row.stat === 1 ? (
//             <Box textAlign={"center"}>
//               <Typography color="red" fontWeight="bold">
//                 Suspended
//               </Typography>
//               <Typography variant="body2">
//                 <strong>Description:</strong> {params.row.sdes || "N/A"}
//               </Typography>
//               <Typography variant="body2">
//                 <strong>Date:</strong> {params.row.sudt || "N/A"}
//               </Typography>
//               <Typography variant="body2">
//                 <strong>User:</strong> {params.row.sunm || "N/A"}
//               </Typography>
//               <Button
//                 variant="contained"
//                 color="success"
//                 onClick={() => handleOpenDialog(params.row)}
//                 sx={{ mt: 1 }}
//               >
//                 Resume
//               </Button>
//             </Box>
//           ) : (
//             <Box textAlign={"center"}>
//               <Typography color="green" fontWeight="bold">
//                 Active
//               </Typography>
//               <Button
//                 variant="contained"
//                 color="warning"
//                 onClick={() => handleOpenDialog(params.row)}
//                 sx={{ mt: 1 }}
//               >
//                 Suspend
//               </Button>
//             </Box>
//           )}
//         </>
//       ),
//     },
//     {
//       field: "actions",
//       headerName: "Actions",
//       headerAlign: "center",
//       flex: 3,
//       renderCell: (params) => (
//         <>
//           <IconButton
//             color="primary"
//             onClick={() => handleEditClick(params.row)}
//           >
//             <Edit />
//           </IconButton>
//           <IconButton
//             color="secondary"
//             onClick={() => handleDeleteClick(params.row)}
//           >
//             <Delete />
//           </IconButton>
//         </>
//       ),
//     },
//   ];
//   return (
//     <>
//       {data?.length > 0 && (
//         <Box>
//           <Grid container>
//             <Grid item xs={12}>
//               <Card>
//                 <Box>
//                   <Box
//                     display="flex"
//                     justifyContent="space-between"
//                     alignItems="center"
//                     m={1}
//                   >
//                     {/* Left Side - Title */}
//                     <Typography variant="h5" fontFamily="serif" color="#0d47a1">
//                       IVRS DID List
//                     </Typography>

//                     {/* Right Side - With Background */}
//                     <Box
//                       display="flex"
//                       alignItems="center"
//                       gap={2}
//                       p={1.5}
//                       // bgcolor="#333"
//                       // borderRadius={2}
//                       // boxShadow={1}
//                     >
//                       {/* Search Field */}
//                       <TextField
//                         variant="outlined"
//                         size="small"
//                         placeholder="Search..."
//                         value={searchText}
//                         onChange={handleSearch}
//                         InputProps={{
//                           endAdornment: (
//                             <IconButton>
//                               <SearchIcon color="primary" />
//                             </IconButton>
//                           ),
//                         }}
//                         sx={{ backgroundColor: "#fff", borderRadius: 1 }}
//                       />

//                       {/* Delete Icon */}
//                       {selectedRows.length > 0 && (
//                         <IconButton onClick={handleOpenDelete}>
//                           <DeleteIcon color="error" sx={{ fontSize: 28 }} />
//                           <Typography color={"error"}>Delete</Typography>
//                         </IconButton>
//                       )}

//                       {/* Filter Icon */}
//                       <IconButton onClick={toggleDrawer}>
//                         <FilterListIcon
//                           sx={{
//                             fontSize: 34,
//                             color: "#6a69ff",
//                             transition: "0.3s",
//                             "&:hover": {
//                               color: "#6a69ff",
//                               transform: "scale(1.1)",
//                             },
//                           }}
//                         />
//                       </IconButton>
//                       <Button
//                         onClick={() => setOpenDrawer(true)}
//                         sx={{
//                           bgcolor: "#6a69ff",
//                           color: "#ffff",
//                           "&:hover": {
//                             color: "#ffff",
//                             bgcolor: "#6a69ff",
//                             transform: "scale(1.1)",
//                           },
//                         }}
//                       >
//                         <AddSharpIcon sx={{ fontSize: 16 }} />
//                         <Typography>Add</Typography>
//                       </Button>
//                     </Box>
//                   </Box>

//                   <Box sx={{ overflow: "auto" }}>
//                     <DataGrid
//                       rows={paginatedRows || []}
//                       columns={columns}
//                       disableRowSelectionOnClick={true}
//                       checkboxSelection={true}
//                       rowSelectionModel={visibleSelected}
//                       onRowSelectionModelChange={(newSelection) => {
//                         setSelectAll(false);
//                         setSelectedRows(newSelection);
//                         const selectedIds = data
//                           .filter((row) => newSelection.includes(row.id))
//                           .map((row) => row.ivrsduniq);
//                         setSelectedIvrsRows(selectedIds);
//                       }}
//                       hideFooter
//                       getRowHeight={() => "auto"}
//                       // paginationMode="server"
//                       sx={tableStyles}
//                     />
//                   </Box>

//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       backgroundColor: "#fff",
//                       borderTop: "1px solid #ccc",
//                       // common padding for the container
//                     }}
//                   >
//                     {/* Left Section */}
//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 3, // consistent gap between elements
//                         flexWrap: "wrap", // allow wrapping on smaller screens
//                         ml: 2,
//                       }}
//                     >
//                       <Typography variant="body2">
//                         Selected Rows:{" "}
//                         <strong>
//                           {selectedRows?.length === data?.length
//                             ? "SelectedAll"
//                             : selectedRows?.length}
//                         </strong>
//                       </Typography>
//                       <Typography variant="body2">
//                         Total Rows: <strong>{data?.length}</strong>
//                       </Typography>

//                       {selectedRows.length > 0 && (
//                         <Box
//                           sx={{ display: "flex", alignItems: "center", gap: 1 }}
//                         >
//                           <TableBottomActions
//                             selectedRows={selectedRows}
//                             setSelectedRows={setSelectedRows}
//                             setSelectedIvrsRows={setSelectedIvrsRows}
//                             selectedIvrsRows={selectedIvrsRows}
//                           />
//                           <Box
//                             sx={{
//                               display: "flex",
//                               alignItems: "center",
//                               gap: 1,
//                             }}
//                           >
//                             <Checkbox
//                               checked={selectAll}
//                               onChange={handleSelectAll}
//                             />
//                             <Typography variant="body2">FOR ALL</Typography>
//                           </Box>
//                         </Box>
//                       )}
//                     </Box>

//                     {/* Right Section */}
//                     <Box>
//                       <CustomPagination
//                         currentPage={currentPage}
//                         totalRows={totalRows}
//                         startIndex={startIndex}
//                         pageSize={pageSize}
//                         handlePageSizeChange={handlePageSizeChange}
//                         handlePreviousPage={handlePreviousPage}
//                         handleNextPage={handleNextPage}
//                         totalPages={totalPages}
//                       />
//                     </Box>
//                   </Box>

//                   <Drawer
//                     anchor="right"
//                     open={openDrawer}
//                     onClose={() => setOpenDrawer(true)}
//                   >
//                     <Box sx={{ width: 500, p: 3 }}>
//                       <IvrsDidAddForm
//                         setOpenDrawer={setOpenDrawer}
//                         handleShow={handleShow}
//                       />
//                     </Box>
//                   </Drawer>

//                   <MyFilterDrawer
//                     openDrawer={openFilterDrawer}
//                     toggleDrawer={toggleDrawer}
//                     data={data}
//                     setData={setData}
//                   />
//                   <Drawer
//                     anchor="right"
//                     open={openEditDrawer}
//                     onClose={() => setOpenEditDrawer(true)}
//                   >
//                     <Box sx={{ width: 500, p: 3 }}>
//                       <IvrsDidEditForm
//                         selectedDidData={selectedDidData}
//                         setOpenEditDrawer={setOpenEditDrawer}
//                         handleShow={handleShow}
//                       />
//                     </Box>
//                   </Drawer>

//                   <StatusConfirmation
//                     open={openStatus}
//                     onClose={() => setOpenStatus(false)}
//                     type={statusType}
//                     name={
//                       selectedRow
//                         ? `${selectedRow.compnm}-${selectedRow.unm}-${selectedRow.didnum}`
//                         : ""
//                     }
//                     description={description}
//                     onDescriptionChange={(e) => setDescription(e.target.value)}
//                     onUpdate={handleUpdate}
//                   />
//                 </Box>

//                 <Dialog open={open} maxWidth="sm" fullWidth>
//                   <DialogTitle>Modules</DialogTitle>
//                   <DialogContent>
//                     <FormGroup>
//                       {moduleOptions.map((module) => (
//                         <FormControlLabel
//                           key={module.typuni}
//                           control={
//                             <Checkbox
//                               checked={selectedModules?.includes(module.typuni)}
//                               onChange={() => handleToggle(module)}
//                             />
//                           }
//                           label={module.typnm}
//                         />
//                       ))}
//                     </FormGroup>
//                   </DialogContent>
//                   <DialogActions>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={handleModuleSave}
//                     >
//                       Save
//                     </Button>
//                     <Button
//                       variant="contained"
//                       color="error"
//                       onClick={handleClose}
//                     >
//                       Close
//                     </Button>
//                   </DialogActions>
//                 </Dialog>
//               </Card>
//             </Grid>
//           </Grid>
//           <Snackbar
//             open={snackbar.open}
//             autoHideDuration={3000}
//             onClose={handleCloseSnackbar}
//             anchorOrigin={{ vertical: "top", horizontal: "left" }}
//           >
//             <Alert
//               onClose={handleCloseSnackbar}
//               severity={snackbar.severity}
//               variant="standard"
//               sx={{ width: "100%" }}
//             >
//               {snackbar.message}
//             </Alert>
//           </Snackbar>
//           <Modal open={openDelete} onClose={handleCloseDelete}>
//             <Box
//               sx={{
//                 position: "absolute",
//                 top: "50%",
//                 left: "50%",
//                 transform: "translate(-50%, -50%)",
//                 bgcolor: "white",
//                 p: 3,
//                 borderRadius: 2,
//                 boxShadow: 24,
//               }}
//             >
//               <Typography>
//                 Are you sure you want to delete the selected items?
//               </Typography>
//               <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
//                 <Button
//                   onClick={handleConfirmAllDelete}
//                   variant="contained"
//                   color="primary"
//                 >
//                   Yes
//                 </Button>
//                 <Button
//                   onClick={handleCloseDelete}
//                   variant="contained"
//                   color="error"
//                 >
//                   No
//                 </Button>
//               </Box>
//             </Box>
//           </Modal>

//           <Modal open={openModal} onClose={handleCancelForAll}>
//             <Box sx={modalStyle}>
//               <Typography variant="h6" component="h2" mb={2}>
//                 Confirm Action
//               </Typography>
//               <Typography sx={{ mb: 3 }}>
//                 Action will be applied to all items selected by the filter,
//                 including items on other pages.
//               </Typography>
//               <Box display="flex" justifyContent="flex-end">
//                 <Button
//                   variant="contained"
//                   color="error"
//                   onClick={handleCancelForAll}
//                   sx={{ mr: 1 }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button variant="contained" onClick={handleConfirmForAll}>
//                   Confirm
//                 </Button>
//               </Box>
//             </Box>
//           </Modal>
//         </Box>
//       )}
//     </>
//   );
// };

// export default IvrsDidListTable;
