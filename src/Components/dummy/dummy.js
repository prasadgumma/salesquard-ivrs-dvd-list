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
//       console.log(tspRes, "dropdownData");
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

//   console.log(tableDidData.length, "Tdata");

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
//     console.log(formData.account.length);
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
