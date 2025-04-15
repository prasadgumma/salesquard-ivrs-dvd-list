// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   TextField,
//   Grid,
//   Autocomplete,
//   CircularProgress,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import axios from "axios";
// import IvrsDidListTable from "./Ivrs-did-table";
// import { v4 as uuidv4 } from "uuid";
// import FilterProvider from "../context/FilterProvider";

// // Common styling for the TextField used in Autocomplete
// const textFieldSx = {
//   "& .MuiOutlinedInput-root": {
//     borderRadius: "8px",
//     backgroundColor: "#fff",
//     // width: "250px", // Set the desired width
//     height: "48px", // Set the desired height
//     "& fieldset": { borderColor: "#ced4da" },
//     "&:hover fieldset": { borderColor: "#a1a1a1" },
//     "&.Mui-focused fieldset": { borderColor: "#1976d2" },
//   },
//   "& .MuiInputLabel-root": { color: "#1976d2" },
// };

// const FilterDrawer = () => {
//   const [dropdownData, setDropdownData] = useState({
//     tsp: [],
//     account: [],
//     route: [],
//   });

//   const [formData, setFormData] = useState({
//     tsp: ["-1"], // Default: "All"
//     account: ["-1"],
//     route: ["-1"],
//     status: "-1",
//   });
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   const [tableDidData, setTableDidData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const apiurl = process.env.REACT_APP_API_URL;

//   useEffect(() => {
//     fetchDropdownData();
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

//   // Change handler updates the state without filtering out "All"
//   const handleChange = (name, value) => {
//     if (name === "status") {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handleShow = async () => {
//     setLoading(false);
//     try {
//       const response = await axios.post(`${apiurl}/ivrs_did_list_v2`, {
//         lml: "67a455659d796",
//         page: 1,
//         acc:
//           formData?.account?.length > 0 ? formData.account.join("','") : "-1",
//         tsp: formData?.tsp?.length > 0 ? formData.tsp.join("','") : "-1",
//         rout: formData?.route?.length > 0 ? formData.route.join("','") : "-1",
//         rtype: formData.status,
//       });

//       if (response?.data?.resp?.error_code === "0") {
//         setTableDidData(
//           response?.data?.resp?.ivrsdidlist?.map((item, index) => ({
//             ...item,
//             id: index + 1,
//             uuiv: `${index}-${uuidv4()}`,
//           })) || []
//         );
//         setSnackbar({
//           open: true,
//           message: "Data loaded successfully.",
//           severity: "success",
//         });
//       } else {
//         throw new Error(response.data.resp.message);
//       }
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.message || "Error fetching data.",
//         severity: "error",
//       });
//     } finally {
//       setLoading(true);
//     }
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar((prev) => ({ ...prev, open: false }));
//   };

//   // Helper: If more than one value is selected, exclude "-1" (All) from the chips
//   const getDisplayValues = (selectedValues) => {
//     if (selectedValues.length > 1 && selectedValues.includes("-1")) {
//       return selectedValues.filter((val) => val !== "-1");
//     }
//     return selectedValues;
//   };

//   // Calculate display values for each filter
//   const tspDisplayValues = getDisplayValues(formData.tsp);
//   const accountDisplayValues = getDisplayValues(formData.account);
//   const routeDisplayValues = getDisplayValues(formData.route);

//   return (
//     <FilterProvider tableDidData={tableDidData}>
//       <Box mt={1} mr={2} textAlign="end">
//         <Box
//           p={2}
//           sx={{
//             width: "97%",
//             backgroundColor: "#f5f5f5",
//             borderRadius: "12px",
//           }}
//         >
//           <Grid container alignItems="center" spacing={2} flexWrap="wrap">
//             {/* TSP Filter */}
//             <Grid item xs={12} sm={6} md={2.3}>
//               <Autocomplete
//                 size="small"
//                 multiple
//                 options={dropdownData.tsp} // Always show full list in the dropdown
//                 getOptionLabel={(option) => option.nm || ""}
//                 value={dropdownData.tsp.filter((opt) =>
//                   tspDisplayValues.includes(opt.uni)
//                 )}
//                 onChange={(event, newValue) => {
//                   const selectedValues = newValue.map((item) => item.uni);
//                   handleChange("tsp", selectedValues);
//                 }}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="TSP"
//                     variant="outlined"
//                     sx={textFieldSx}
//                   />
//                 )}
//               />
//             </Grid>

//             {/* Account Filter */}
//             <Grid item xs={12} sm={6} md={2.3}>
//               <Autocomplete
//                 multiple
//                 size="small"
//                 options={dropdownData.account}
//                 getOptionLabel={(option) => option.unm || ""}
//                 value={dropdownData.account.filter((opt) =>
//                   accountDisplayValues.includes(opt.acuni)
//                 )}
//                 onChange={(event, newValue) =>
//                   handleChange(
//                     "account",
//                     newValue.map((item) => item.acuni)
//                   )
//                 }
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Account"
//                     variant="outlined"
//                     sx={textFieldSx}
//                   />
//                 )}
//               />
//             </Grid>

//             {/* Route Filter */}
//             <Grid item xs={12} sm={6} md={2.3}>
//               <Autocomplete
//                 size="small"
//                 multiple
//                 options={dropdownData.route}
//                 getOptionLabel={(option) => option.rtnm || ""}
//                 value={dropdownData.route.filter((opt) =>
//                   routeDisplayValues.includes(opt.runi)
//                 )}
//                 onChange={(event, newValue) =>
//                   handleChange(
//                     "route",
//                     newValue.map((item) => item.runi)
//                   )
//                 }
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Routes"
//                     variant="outlined"
//                     sx={textFieldSx}
//                   />
//                 )}
//               />
//             </Grid>

//             {/* Status Filter */}
//             <Grid item xs={12} sm={6} md={2.2}>
//               <Autocomplete
//                 size="small"
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
//                     size="small"
//                     {...params}
//                     label="Status"
//                     variant="outlined"
//                     sx={textFieldSx}
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
//                 size="small"
//                 sx={{ borderRadius: "8px", padding: "6px" }}
//               >
//                 Show
//               </Button>
//             </Grid>
//           </Grid>
//         </Box>
//         {/* Snackbar */}
//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={3000}
//           onClose={handleCloseSnackbar}
//           anchorOrigin={{ vertical: "top", horizontal: "left" }}
//         >
//           <Alert
//             onClose={handleCloseSnackbar}
//             severity={snackbar.severity}
//             variant="filled"
//             sx={{ width: "100%" }}
//           >
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </Box>
//       <Box>
//         {loading ? (
//           <IvrsDidListTable
//             tableDidData={tableDidData}
//             handleShow={handleShow}
//           />
//         ) : (
//           <CircularProgress
//             variant="indeterminate"
//             size={"4rem"}
//             sx={{ marginLeft: "40%", marginTop: "20%" }}
//           />
//         )}
//       </Box>
//       ;
//     </FilterProvider>
//   );
// };

// export default FilterDrawer;

// Mobile View Of Dropdowns
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   TextField,
//   Grid,
//   Autocomplete,
//   CircularProgress,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import axios from "axios";
// import IvrsDidListTable from "./Ivrs-did-table";
// import { v4 as uuidv4 } from "uuid";
// import FilterProvider from "../context/FilterProvider";

// // Shared styling for Autocomplete/TextField components including mobile-specific styles
// const autoCompleteSx = {
//   "& .MuiOutlinedInput-root": {
//     borderRadius: "8px",
//     backgroundColor: "#fff",
//     height: "48px",
//     "& fieldset": { borderColor: "#ced4da" },
//     "&:hover fieldset": { borderColor: "#a1a1a1" },
//     "&.Mui-focused fieldset": { borderColor: "#1976d2" },
//   },
//   "& .MuiInputLabel-root": { color: "#1976d2" },
//   // Mobile-specific adjustments using a media query
//   "@media (max-width:600px)": {
//     "& .MuiOutlinedInput-root": {
//       height: "40px",
//     },
//     "& .MuiInputLabel-root": {
//       fontSize: "0.8rem",
//     },
//   },
// };

// const FilterDrawerMultiSelect = () => {
//   const apiurl = process.env.REACT_APP_API_URL;

//   // For multi-select dropdowns, default to an array with "-1" (representing "All")
//   const [formData, setFormData] = useState({
//     tsp: ["-1"],
//     account: ["-1"],
//     route: ["-1"],
//     // Status remains single select so default is a string
//     status: "-1",
//   });

//   // Dropdown data from API for TSP, Account, and Route
//   const [dropdownData, setDropdownData] = useState({
//     tsp: [],
//     account: [],
//     route: [],
//   });

//   // State for table data, snackbar and loading flag
//   const [tableDidData, setTableDidData] = useState([]);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });
//   const [loading, setLoading] = useState(true);

//   // Fetch dropdown data on mount
//   useEffect(() => {
//     const fetchDropdownData = async () => {
//       try {
//         const [tspRes, routeRes, accountRes] = await Promise.all([
//           axios.post(`${apiurl}/tsp_drp`, {
//             lml: "67a455659d796",
//             mtyp: "5c2e5b697d91c",
//           }),
//           axios.post(`${apiurl}/route_drp_acc_did`, {
//             lml: "67a455659d796",
//             mtyp: "5c2e5b697d91c",
//           }),
//           axios.post(`${apiurl}/acc_list_module`, {
//             lml: "67a455659d796",
//             mtyp: "5c2e5b697d91c",
//           }),
//         ]);

//         setDropdownData({
//           // Prepend "All" option to each list
//           tsp: [
//             { uni: "-1", nm: "All" },
//             ...(tspRes.data?.resp?.tsp_list || []),
//           ],
//           account: [
//             { acuni: "-1", unm: "All" },
//             ...(accountRes.data?.resp?.acc_users_call_log || []),
//           ],
//           route: [
//             { runi: "-1", rtnm: "All" },
//             ...(routeRes.data?.resp?.route || []),
//           ],
//         });
//       } catch (error) {
//         console.error("Error fetching dropdown data:", error);
//       }
//     };

//     fetchDropdownData();
//   }, [apiurl]);

//   // Update the form data state
//   const handleChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   // Custom handler for multi-select dropdowns:
//   // If the new selection contains other values than "-1", remove "-1"
//   // If no value is selected, revert to ["-1"]
//   const handleMultiSelectChange = (field, newValue, key) => {
//     let selectedValues = newValue.map((item) => item[key]);

//     // If "All" is selected along with other values, remove "All"
//     if (selectedValues.includes("-1") && selectedValues.length > 1) {
//       selectedValues = selectedValues.filter((val) => val !== "-1");
//     }

//     // If nothing remains selected, default back to ["-1"]
//     if (selectedValues.length === 0) {
//       selectedValues = ["-1"];
//     }

//     handleChange(field, selectedValues);
//   };

//   // Handle the "Show" button click to fetch table data
//   const handleShow = async () => {
//     setLoading(false);
//     try {
//       const response = await axios.post(`${apiurl}/ivrs_did_list_v2`, {
//         lml: "67a455659d796",
//         page: 1,
//         // Join multi-select values into a string if needed by API
//         acc: formData.account.join("','"),
//         tsp: formData.tsp.join("','"),
//         rout: formData.route.join("','"),
//         rtype: formData.status,
//       });

//       if (response.data?.resp?.error_code === "0") {
//         setTableDidData(
//           (response.data?.resp?.ivrsdidlist || []).map((item, index) => ({
//             ...item,
//             id: index + 1,
//             uuiv: `${index}-${uuidv4()}`,
//           }))
//         );
//         setSnackbar({
//           open: true,
//           message: "Data loaded successfully.",
//           severity: "success",
//         });
//       } else {
//         throw new Error(response.data.resp.message);
//       }
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: error.message || "Error fetching data.",
//         severity: "error",
//       });
//     } finally {
//       setLoading(true);
//     }
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar((prev) => ({ ...prev, open: false }));
//   };

//   // Dropdown configurations
//   const dropdownConfigs = [
//     {
//       label: "TSP",
//       field: "tsp",
//       options: dropdownData.tsp,
//       multiple: true,
//       optionKey: "uni",
//       labelKey: "nm",
//       value: dropdownData.tsp.filter((opt) => formData.tsp.includes(opt.uni)),
//       onChange: (event, newValue) =>
//         handleMultiSelectChange("tsp", newValue, "uni"),
//     },
//     {
//       label: "Account",
//       field: "account",
//       options: dropdownData.account,
//       multiple: true,
//       optionKey: "acuni",
//       labelKey: "unm",
//       value: dropdownData.account.filter((opt) =>
//         formData.account.includes(opt.acuni)
//       ),
//       onChange: (event, newValue) =>
//         handleMultiSelectChange("account", newValue, "acuni"),
//     },
//     {
//       label: "Routes",
//       field: "route",
//       options: dropdownData.route,
//       multiple: true,
//       optionKey: "runi",
//       labelKey: "rtnm",
//       value: dropdownData.route.filter((opt) =>
//         formData.route.includes(opt.runi)
//       ),
//       onChange: (event, newValue) =>
//         handleMultiSelectChange("route", newValue, "runi"),
//     },
//     {
//       label: "Status",
//       field: "status",
//       options: [
//         { label: "All", value: "-1" },
//         { label: "Active", value: "1" },
//         { label: "Suspended", value: "2" },
//         { label: "Expired", value: "3" },
//       ],
//       multiple: false,
//       optionKey: "value",
//       labelKey: "label",
//       value: [
//         { label: "All", value: "-1" },
//         { label: "Active", value: "1" },
//         { label: "Suspended", value: "2" },
//         { label: "Expired", value: "3" },
//       ].find((opt) => opt.value === formData.status) || {
//         label: "All",
//         value: "-1",
//       },
//       onChange: (event, newValue) => {
//         handleChange("status", newValue ? newValue.value : "-1");
//       },
//     },
//   ];

//   return (
//     <FilterProvider tableDidData={tableDidData}>
//       <Box
//         mt={1}
//         mr={2}
//         textAlign="end"
//         sx={{
//           // Responsive container width adjustments for mobile
//           width: { xs: "100%", sm: "97%" },
//         }}
//       >
//         <Box
//           p={2}
//           sx={{
//             backgroundColor: "#f5f5f5",
//             borderRadius: "12px",
//             // Mobile-specific styles using media query
//             "@media (max-width:600px)": {
//               padding: "8px",
//             },
//           }}
//         >
//           <Grid container alignItems="center" spacing={2} flexWrap="wrap">
//             {dropdownConfigs.map((config, index) => (
//               <Grid
//                 key={index}
//                 item
//                 xs={12}
//                 sm={6}
//                 md={2.3}
//                 sx={{
//                   // For mobile, full width for each dropdown
//                   "@media (max-width:600px)": {
//                     width: "100%",
//                   },
//                 }}
//               >
//                 <Autocomplete
//                   size="small"
//                   multiple={config.multiple}
//                   options={config.options}
//                   getOptionLabel={(option) => option[config.labelKey] || ""}
//                   value={config.value}
//                   onChange={config.onChange}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label={config.label}
//                       variant="outlined"
//                       sx={autoCompleteSx}
//                     />
//                   )}
//                 />
//               </Grid>
//             ))}
//             <Grid
//               item
//               xs={6}
//               sm={6}
//               md={1}
//               sx={{
//                 "@media (max-width:600px)": {
//                   width: "100%",
//                 },
//               }}
//             >
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleShow}
//                 fullWidth
//                 size="small"
//                 sx={{
//                   borderRadius: "8px",
//                   padding: "6px",
//                   // Mobile-specific font size adjustments
//                   fontSize: { xs: "0.8rem", sm: "inherit" },
//                 }}
//               >
//                 Show
//               </Button>
//             </Grid>
//           </Grid>
//         </Box>
//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={3000}
//           onClose={handleCloseSnackbar}
//           anchorOrigin={{ vertical: "top", horizontal: "left" }}
//         >
//           <Alert
//             onClose={handleCloseSnackbar}
//             severity={snackbar.severity}
//             variant="filled"
//             sx={{ width: "100%" }}
//           >
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </Box>
//       <Box>
//         {loading ? (
//           <IvrsDidListTable
//             tableDidData={tableDidData}
//             handleShow={handleShow}
//           />
//         ) : (
//           <CircularProgress
//             variant="indeterminate"
//             size={"4rem"}
//             sx={{ marginLeft: { xs: "auto", md: "40%" }, marginTop: "20%" }}
//           />
//         )}
//       </Box>
//     </FilterProvider>
//   );
// };

// export default FilterDrawerMultiSelect;
