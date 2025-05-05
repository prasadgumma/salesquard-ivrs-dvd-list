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
//   Chip,
//   Tooltip,
// } from "@mui/material";
// import axios from "axios";
// import IvrsDidListTable from "./Ivrs-did-table";
// import { v4 as uuidv4 } from "uuid";
// import FilterProvider from "../context/FilterProvider";

// // Shared styling for Autocomplete/TextField components
// const autoCompleteSx = {
//   "& .MuiInputLabel-root": { color: "#1976d2" },

//   "& .MuiOutlinedInput-root": {
//     backgroundColor: "#f9f9f9",
//     borderRadius: "8px",
//   },
//   "& .MuiOutlinedInput-notchedOutline": {
//     borderColor: "#1976d2",
//   },
//   "&:hover .MuiOutlinedInput-notchedOutline": {
//     borderColor: "#1565c0",
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
//   // If no value is selected, revert to ["-1"] (All)
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
//       console.log(response.data);
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
//       console.log(error);
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

//   // Configuration for dropdowns. For each, we include:
//   // - field: key for state
//   // - label: label for the dropdown
//   // - options: options array (from API or static)
//   // - multiple: flag if multi-select is enabled
//   // - optionKey and labelKey: keys to extract the value and label for options
//   const dropdownConfigs = [
//     {
//       label: "TSP",
//       field: "tsp",
//       options: dropdownData.tsp,
//       multiple: true,
//       optionKey: "uni",
//       labelKey: "nm",
//       // Filter options to match the selected values from state
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
//       <Box mt={0.5} mr={2} textAlign="end">
//         <Box
//           p={2}
//           sx={{
//             width: "97%",
//             backgroundColor: "#f5f5f5",
//             borderRadius: "12px",
//           }}
//         >
//           <Grid container alignItems="center" spacing={2} flexWrap="wrap">
//             {dropdownConfigs.map((config, index) => (
//               <Grid key={index} item xs={12} sm={6} md={2.3}>
//                 <Autocomplete
//                   size="small"
//                   multiple={config.multiple}
//                   options={config.options}
//                   getOptionLabel={(option) => option[config.labelKey] || ""}
//                   value={config.value}
//                   onChange={config.onChange}
//                   isOptionEqualToValue={(option, value) =>
//                     option[config.optionKey] === value[config.optionKey]
//                   }
//                   renderTags={(value, getTagProps) => {
//                     const visibleTags = value.slice(0, 2);
//                     const remaining = value.length - visibleTags.length;

//                     return (
//                       <>
//                         {visibleTags.map((option, index) => (
//                           <Chip
//                             {...getTagProps({ index })}
//                             key={index}
//                             label={option[config.labelKey]}
//                             // sx={{ backgroundColor: "#1976d2", color: "#fff" }}
//                           />
//                         ))}
//                         {remaining > 0 && (
//                           <Tooltip
//                             title={value
//                               .slice(2)
//                               .map((val) => val[config.labelKey])
//                               .join(", ")}
//                           >
//                             <Chip
//                               label={`+${remaining} more`}
//                               // sx={{ backgroundColor: "#1976d2", color: "#fff" }}
//                             />
//                           </Tooltip>
//                         )}
//                       </>
//                     );
//                   }}
//                   ListboxProps={{
//                     sx: {
//                       "& .MuiAutocomplete-option[aria-selected='true']": {
//                         fontWeight: 500,
//                         color: "#6a69ff",
//                         fontFamily: "mulish, sans-serif",
//                       },
//                     },
//                   }}
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
//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={2000}
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
//     </FilterProvider>
//   );
// };

// export default FilterDrawerMultiSelect;

//modified Code

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  Autocomplete,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import IvrsDidListTable from "./Ivrs-did-table";
import { v4 as uuidv4 } from "uuid";
import FilterProvider from "../context/FilterProvider";

const autoCompleteSx = {
  "& .MuiInputLabel-root": { color: "#1976d2" },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#1976d2",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#1565c0",
  },
};

const FilterDrawerMultiSelect = () => {
  const apiurl = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({
    tsp: ["-1"],
    account: ["-1"],
    route: ["-1"],
    status: "-1",
  });

  const [dropdownData, setDropdownData] = useState({
    tsp: [],
    account: [],
    route: [],
  });

  const [tableDidData, setTableDidData] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [tspRes, routeRes, accountRes] = await Promise.all([
          axios.post(`${apiurl}/tsp_drp`, {
            lml: "67a455659d796",
            mtyp: "5c2e5b697d91c",
          }),
          axios.post(`${apiurl}/route_drp_acc_did`, {
            lml: "67a455659d796",
            mtyp: "5c2e5b697d91c",
          }),
          axios.post(`${apiurl}/acc_list_module`, {
            lml: "67a455659d796",
            mtyp: "5c2e5b697d91c",
          }),
        ]);

        setDropdownData({
          tsp: [
            { uni: "-1", nm: "All" },
            ...(tspRes.data?.resp?.tsp_list || []),
          ],
          account: [
            { acuni: "-1", unm: "All" },
            ...(accountRes.data?.resp?.acc_users_call_log || []),
          ],
          route: [
            { runi: "-1", rtnm: "All" },
            ...(routeRes.data?.resp?.route || []),
          ],
        });
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, [apiurl]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMultiSelectChange = (field, newValue, key) => {
    let selectedValues = newValue.map((item) => item[key]);
    if (selectedValues.includes("-1") && selectedValues.length > 1) {
      selectedValues = selectedValues.filter((val) => val !== "-1");
    }
    if (selectedValues.length === 0) {
      selectedValues = ["-1"];
    }
    handleChange(field, selectedValues);
  };

  const handleShow = async () => {
    setLoading(false);
    try {
      const response = await axios.post(`${apiurl}/ivrs_did_list_v2`, {
        lml: "67a455659d796",
        page: 1,
        acc: formData.account.join("','"),
        tsp: formData.tsp.join("','"),
        rout: formData.route.join("','"),
        rtype: formData.status,
      });

      if (response.data?.resp?.error_code === "0") {
        setTableDidData(
          (response.data?.resp?.ivrsdidlist || []).map((item, index) => ({
            ...item,
            id: index + 1,
            uuiv: `${index}-${uuidv4()}`,
          }))
        );
        setSnackbar({
          open: true,
          message: "Data loaded successfully.",
          severity: "success",
        });
      } else {
        throw new Error(response.data.resp.message);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Error fetching data.",
        severity: "error",
      });
    } finally {
      setLoading(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const dropdownConfigs = [
    {
      label: "TSP",
      field: "tsp",
      options: dropdownData.tsp,
      multiple: true,
      optionKey: "uni",
      labelKey: "nm",
      value: dropdownData.tsp.filter((opt) => formData.tsp.includes(opt.uni)),
      onChange: (event, newValue) =>
        handleMultiSelectChange("tsp", newValue, "uni"),
    },
    {
      label: "Account",
      field: "account",
      options: dropdownData.account,
      multiple: true,
      optionKey: "acuni",
      labelKey: "unm",
      value: dropdownData.account.filter((opt) =>
        formData.account.includes(opt.acuni)
      ),
      onChange: (event, newValue) =>
        handleMultiSelectChange("account", newValue, "acuni"),
    },
    {
      label: "Routes",
      field: "route",
      options: dropdownData.route,
      multiple: true,
      optionKey: "runi",
      labelKey: "rtnm",
      value: dropdownData.route.filter((opt) =>
        formData.route.includes(opt.runi)
      ),
      onChange: (event, newValue) =>
        handleMultiSelectChange("route", newValue, "runi"),
    },
    {
      label: "Status",
      field: "status",
      options: [
        { label: "All", value: "-1" },
        { label: "Active", value: "1" },
        { label: "Suspended", value: "2" },
        { label: "Expired", value: "3" },
      ],
      multiple: false,
      optionKey: "value",
      labelKey: "label",
      value: [
        { label: "All", value: "-1" },
        { label: "Active", value: "1" },
        { label: "Suspended", value: "2" },
        { label: "Expired", value: "3" },
      ].find((opt) => opt.value === formData.status) || {
        label: "All",
        value: "-1",
      },
      onChange: (event, newValue) => {
        handleChange("status", newValue ? newValue.value : "-1");
      },
    },
  ];

  return (
    <FilterProvider tableDidData={tableDidData}>
      <Box mt={0.5} mr={2} textAlign="end">
        <Box
          p={2}
          sx={{
            width: "97%",
            backgroundColor: "#f5f5f5",
            borderRadius: "12px",
          }}
        >
          <Grid container alignItems="center" spacing={2} flexWrap="wrap">
            {dropdownConfigs.map((config, index) => (
              <Grid key={index} item xs={12} sm={6} md={2.3}>
                <Autocomplete
                  size="small"
                  multiple={config.multiple}
                  options={config.options}
                  getOptionLabel={(option) => option[config.labelKey] || ""}
                  value={config.value}
                  onChange={config.onChange}
                  isOptionEqualToValue={(option, value) =>
                    option[config.optionKey] === value[config.optionKey]
                  }
                  renderTags={(value, getTagProps) => {
                    const visibleTags = value.slice(0, 2);
                    const remaining = value.length - visibleTags.length;
                    return (
                      <>
                        {visibleTags.map((option, index) => (
                          <Chip
                            {...getTagProps({ index })}
                            key={index}
                            label={option[config.labelKey]}
                          />
                        ))}
                        {remaining > 0 && (
                          <Tooltip
                            title={value
                              .slice(2)
                              .map((val) => val[config.labelKey])
                              .join(", ")}
                          >
                            <Chip label={`+${remaining} more`} />
                          </Tooltip>
                        )}
                      </>
                    );
                  }}
                  ListboxProps={{
                    sx: {
                      "& .MuiAutocomplete-option[aria-selected='true']": {
                        fontWeight: 500,
                        color: "#6a69ff",
                        fontFamily: "mulish, sans-serif",
                      },
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={config.label}
                      variant="outlined"
                      sx={autoCompleteSx}
                    />
                  )}
                />
              </Grid>
            ))}
            <Grid item xs={12} sm={6} md={1}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleShow}
                fullWidth
                size="small"
                sx={{ borderRadius: "8px", padding: "6px" }}
              >
                Show
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={2000}
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

      <Box>
        {loading ? (
          <IvrsDidListTable
            tableDidData={tableDidData}
            handleShow={handleShow}
          />
        ) : (
          <CircularProgress
            variant="indeterminate"
            size={"4rem"}
            sx={{ marginLeft: "40%", marginTop: "20%" }}
          />
        )}
      </Box>
    </FilterProvider>
  );
};

export default FilterDrawerMultiSelect;
