// import React, { useState, useContext, useRef } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   TextField,
//   Grid,
//   Drawer,
//   IconButton,
//   Divider,
// } from "@mui/material";

// import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
// import CloseIcon from "@mui/icons-material/Close";
// import { FilterContext } from "../context/FilterProvider";
// import FilterListIcon from "@mui/icons-material/FilterList";

// const MyFilterDrawer = ({ openDrawer, toggleDrawer }) => {
//   const { data, setData } = useContext(FilterContext);
//   console.log(data, "FiData");
//   const [didFilters, setDidFilters] = useState([
//     { field: "", condition: "", value: "" },
//   ]);
//   const [filterLogic, setFilterLogic] = useState("all");
//   const initialData = useRef(data);
//   console.log(initialData, "Initialdata");

//   // Declare fieldNames inside the component
//   const fieldNames = [
//     { value: "accontid", label: "Account Id" },
//     { value: "acca", label: "Account" },
//     { value: "rtnm", label: "Route" },
//     { value: "tspnm", label: "TSP" },
//     { value: "didnum", label: "Did Number" },
//     { value: "didtyp", label: "Type" },
//     { value: "agtyp", label: "Agent Type" },
//     { value: "fdt", label: "From" },
//     { value: "tdt", label: "To" },
//     { value: "descr", label: "Description" },
//   ];

//   const handleAddFilter = () => {
//     setDidFilters([...didFilters, { field: "", condition: "", value: "" }]);
//   };

//   const handleRemoveFilter = (index) => {
//     setDidFilters(didFilters.filter((_, i) => i !== index));
//   };

//   const handleMemberFilterChange = (index, key, value) => {
//     const updatedFilters = [...didFilters];
//     updatedFilters[index][key] = value;
//     setDidFilters(updatedFilters);
//   };

//   // Apply filters to the data using the selected logic
//   const applyHandler = () => {
//     let filteredData = [...data];
//     if (filterLogic === "all") {
//       // AND logic: every filter must match
//       didFilters.forEach((filter) => {
//         let { field, condition, value } = filter;
//         if (field === "accontid") {
//           value = parseInt(value, 10);
//         }
//         if (field === "tspnm") {
//           value = value.toUpperCase();
//         }
//         if (field === "agtyp") {
//           value = parseInt(value, 10);
//         }
//         if (field && condition && value) {
//           filteredData = filteredData.filter((item) => {
//             console.log(item);
//             switch (condition) {
//               case "is":
//                 return item[field] === value;
//               case "is_not":
//                 return item[field] !== value;
//               case "contains":
//                 return item[field]?.toString().includes(value);
//               case "does_not_contain":
//                 return !item[field]?.toString().includes(value);
//               default:
//                 return true;
//             }
//           });
//         }
//       });
//     } else if (filterLogic === "any") {
//       // OR logic: at least one filter must match
//       filteredData = filteredData.filter((item) => {
//         return didFilters.some((filter) => {
//           let { field, condition, value } = filter;
//           if (field === "accontid") {
//             value = parseInt(value, 10);
//           }
//           if (field === "tspnm") {
//             value = value.toUpperCase();
//           }
//           if (field === "agtyp") {
//             value = parseInt(value, 10);
//           }
//           if (field && condition && value) {
//             switch (condition) {
//               case "is":
//                 return item[field] === value;
//               case "is_not":
//                 return item[field] !== value;
//               case "contains":
//                 return item[field]?.toString().includes(value);
//               case "does_not_contain":
//                 return !item[field]?.toString().includes(value);
//               default:
//                 return false;
//             }
//           }
//           return false;
//         });
//       });
//     }
//     // Update the data in the context and close the drawer
//     setData(filteredData);
//     toggleDrawer();
//   };

//   const resetDataInternal = () => {
//     setDidFilters([{ field: "", condition: "", value: "" }]);
//     setData(initialData.current);
//     toggleDrawer();
//   };

//   return (
//     <Drawer anchor="right" open={openDrawer}>
//       <Box p={2} width="520px">
//         <Box display={"flex"} justifyContent={"space-between"}>
//           <Box display={"flex"} gap={0.5}>
//             <FilterListIcon sx={{ mt: 0.5 }} />
//             <Typography variant="h6" mb={2} fontWeight={"bold"}>
//               My Filters
//             </Typography>
//           </Box>
//           <IconButton onClick={() => toggleDrawer()}>
//             <CloseIcon fontSize="medium" />
//           </IconButton>
//         </Box>

//         <Grid container spacing={3}>
//           <Grid item xs={12} textAlign="center">
//             <FormControl sx={{ width: "100px" }} size="small">
//               <Select
//                 value={filterLogic}
//                 onChange={(e) => setFilterLogic(e.target.value)}
//               >
//                 <MenuItem
//                   value="all"
//                   sx={{
//                     fontWeight: filterLogic === "all" ? "bold" : "normal",
//                     color: filterLogic === "all" ? "#6a69ff" : "inherit",
//                   }}
//                 >
//                   All
//                 </MenuItem>
//                 <MenuItem
//                   value="any"
//                   sx={{
//                     fontWeight: filterLogic === "any" ? "550" : "normal",
//                     color: filterLogic === "any" ? "#6a69ff" : "inherit",
//                   }}
//                 >
//                   Any
//                 </MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12}>
//             <Divider />
//           </Grid>

//           <Grid container spacing={1.8} ml={1.5} mt={1}>
//             {didFilters.map((filter, index) => (
//               <React.Fragment key={index}>
//                 <Grid item xs={4.5}>
//                   <FormControl fullWidth size="small">
//                     <InputLabel>Field</InputLabel>
//                     <Select
//                       label="Field"
//                       value={filter.field}
//                       onChange={(e) =>
//                         handleMemberFilterChange(index, "field", e.target.value)
//                       }
//                       renderValue={(selected) =>
//                         fieldNames.find((field) => field.value === selected)
//                           ?.label || ""
//                       }
//                       MenuProps={{
//                         PaperProps: {
//                           sx: {
//                             "& .MuiMenuItem-root.Mui-selected": {
//                               fontWeight: "550", // Bold text for the selected item
//                               color: "#6a69ff", // Blue text color for the selected item
//                               fontFamily: "mulish,sans-serif",
//                             },
//                           },
//                         },
//                       }}
//                     >
//                       {fieldNames.map((field) => (
//                         <MenuItem key={field.value} value={field.value}>
//                           {field.label}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>

//                 <Grid item xs={3}>
//                   <FormControl fullWidth size="small">
//                     <InputLabel>Condition</InputLabel>
//                     <Select
//                       label="Condition"
//                       value={filter.condition}
//                       onChange={(e) =>
//                         handleMemberFilterChange(
//                           index,
//                           "condition",
//                           e.target.value
//                         )
//                       }
//                     >
//                       <MenuItem value="is">Is</MenuItem>
//                       <MenuItem value="is_not">Is Not</MenuItem>
//                       <MenuItem value="contains">Contains</MenuItem>
//                       <MenuItem value="does_not_contain">
//                         Does Not Contain
//                       </MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Grid>

//                 {/* Only show Value field when a field is selected */}
//                 {filter.field && (
//                   <Grid item xs={3.5}>
//                     <TextField
//                       fullWidth
//                       label="Value"
//                       size="small"
//                       value={filter.value}
//                       onChange={(e) =>
//                         handleMemberFilterChange(index, "value", e.target.value)
//                       }
//                     />
//                   </Grid>
//                 )}

//                 <Grid item xs={0.5} mr={2}>
//                   <IconButton
//                     color="error"
//                     onClick={() => handleRemoveFilter(index)}
//                     // disabled={didFilters.length === 1}
//                   >
//                     <RemoveCircleOutlineIcon sx={{ color: "#6a69ff" }} />
//                   </IconButton>
//                 </Grid>

//                 {index < didFilters.length - 1 && (
//                   <Grid item xs={12}>
//                     <Typography
//                       align="left"
//                       color="textSecondary"
//                       fontWeight={"bold"}
//                     >
//                       {filterLogic === "all" ? "AND" : "OR"}
//                     </Typography>
//                   </Grid>
//                 )}
//               </React.Fragment>
//             ))}
//           </Grid>

//           {/* Add filter row */}
//           <Grid item xs={12} ml={0.5}>
//             <Typography
//               fontSize={15}
//               color="#6a69ff"
//               onClick={handleAddFilter}
//               sx={{ cursor: "pointer", display: "inline-block" }}
//             >
//               <strong>+</strong> Add Another Field
//             </Typography>
//           </Grid>

//           <Grid
//             container
//             xs={12}
//             gap={2}
//             m={2}
//             mt={4}
//             ml={3.5}
//             justifyContent={"start"}
//           >
//             <Grid item xs={2}>
//               <Button
//                 variant="contained"
//                 // color="primary"
//                 fullWidth
//                 onClick={applyHandler}
//                 sx={{ bgcolor: "#6a69ff" }}
//               >
//                 Apply
//               </Button>
//             </Grid>
//             <Grid item xs={2}>
//               <Button
//                 variant="contained"
//                 color="error"
//                 fullWidth
//                 onClick={resetDataInternal}
//               >
//                 Reset
//               </Button>
//             </Grid>
//           </Grid>
//         </Grid>
//       </Box>
//     </Drawer>
//   );
// };

// export default MyFilterDrawer;

// Main

import React, { useState, useContext, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Drawer,
  IconButton,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";

import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import { FilterContext } from "../context/FilterProvider";
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const MyFilterDrawer = ({ openDrawer, toggleDrawer }) => {
  const { data, setData } = useContext(FilterContext);
  const [didFilters, setDidFilters] = useState([
    { field: "", condition: "", value: "" },
  ]);
  const [filterLogic, setFilterLogic] = useState("all");
  const initialData = useRef(data);

  // Snackbar state for error messages
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // List of fields for filtering
  const fieldNames = [
    { value: "accontid", label: "Account Id" },
    { value: "acca", label: "Account" },
    { value: "rtnm", label: "Route" },
    { value: "tspnm", label: "TSP" },
    { value: "didnum", label: "Did Number" },
    { value: "didtyp", label: "Type" },
    { value: "agtyp", label: "Agent Type" },
    { value: "fdt", label: "From" },
    { value: "tdt", label: "To" },
    { value: "descr", label: "Description" },
  ];

  const handleAddFilter = () => {
    setDidFilters([...didFilters, { field: "", condition: "", value: "" }]);
  };

  const handleRemoveFilter = (index) => {
    setDidFilters(didFilters.filter((_, i) => i !== index));
  };

  const handleMemberFilterChange = (index, key, value) => {
    const updatedFilters = [...didFilters];
    updatedFilters[index][key] = value;
    setDidFilters(updatedFilters);
  };

  // Validate each filter input. Returns an error message string if any error is found, or empty if valid.
  const validateFilters = () => {
    for (let i = 0; i < didFilters.length; i++) {
      const { field, condition, value } = didFilters[i];
      if (!field || !condition || value === "") {
        return "All filter fields must be filled out.";
      }
      if ((field === "accontid" || field === "agtyp") && isNaN(value)) {
        return "Account Id and Agent Type must be valid numbers.";
      }
    }
    return "";
  };

  const applyHandler = () => {
    const errorMsg = validateFilters();
    if (errorMsg) {
      setSnackbarMessage(errorMsg);
      setSnackbarOpen(true);
      return; // Stop processing if validation fails
    }

    let filteredData = [...data];

    if (filterLogic === "all") {
      // AND logic: Every filter must match
      for (let i = 0; i < didFilters.length; i++) {
        let { field, condition, value } = didFilters[i];

        // Convert values based on field type
        if (field === "accontid" || field === "agtyp") {
          value = parseInt(value, 10);
        }
        if (field === "tspnm") {
          value = value.toUpperCase();
        }

        filteredData = filteredData.filter((item) => {
          switch (condition) {
            case "is":
              return item[field] === value;
            case "is_not":
              return item[field] !== value;
            case "contains":
              return item[field]?.toString().includes(value);
            case "does_not_contain":
              return !item[field]?.toString().includes(value);
            default:
              return true;
          }
        });
      }
    } else if (filterLogic === "any") {
      // OR logic: At least one filter must match
      filteredData = filteredData.filter((item) => {
        return didFilters.some((filter) => {
          let { field, condition, value } = filter;
          if (field === "accontid" || field === "agtyp") {
            value = parseInt(value, 10);
          }
          if (field === "tspnm") {
            value = value.toUpperCase();
          }
          switch (condition) {
            case "is":
              return item[field] === value;
            case "is_not":
              return item[field] !== value;
            case "contains":
              return item[field]?.toString().includes(value);
            case "does_not_contain":
              return !item[field]?.toString().includes(value);
            default:
              return false;
          }
        });
      });
    }

    // If no data is found, show a Snackbar and update data with empty array,
    // but do not close the drawer so the user can adjust the filters.
    if (filteredData.length === 0) {
      setData(filteredData);
      setSnackbarMessage("No data found.");
      setSnackbarOpen(true);
      return;
    }

    // Otherwise, update data and close the drawer.
    setData(filteredData);
    toggleDrawer();
  };

  const resetDataInternal = () => {
    setDidFilters([{ field: "", condition: "", value: "" }]);
    setData(initialData.current);
    toggleDrawer();
  };

  return (
    <Drawer anchor="right" open={openDrawer}>
      <Box p={2} width="520px">
        <Box display="flex" justifyContent="space-between">
          <Box display="flex" gap={0.5}>
            <FilterListIcon sx={{ mt: 0.5 }} />
            <Typography variant="h6" mb={2} fontWeight="bold">
              My Filters
            </Typography>
          </Box>
          <IconButton onClick={() => toggleDrawer()}>
            <CloseIcon fontSize="medium" />
          </IconButton>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} textAlign="center">
            <FormControl sx={{ width: "100px" }} size="small">
              <Select
                value={filterLogic}
                onChange={(e) => setFilterLogic(e.target.value)}
              >
                <MenuItem
                  value="all"
                  sx={{
                    fontWeight: filterLogic === "all" ? "bold" : "normal",
                    color: filterLogic === "all" ? "#6a69ff" : "inherit",
                  }}
                >
                  All
                </MenuItem>
                <MenuItem
                  value="any"
                  sx={{
                    fontWeight: filterLogic === "any" ? "550" : "normal",
                    color: filterLogic === "any" ? "#6a69ff" : "inherit",
                  }}
                >
                  Any
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid container spacing={1.8} ml={1.5} mt={1}>
            {didFilters.map((filter, index) => (
              <React.Fragment key={index}>
                <Grid item xs={4.5}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Field</InputLabel>

                    <Select
                      label="Field"
                      value={filter.field}
                      onChange={(e) =>
                        handleMemberFilterChange(index, "field", e.target.value)
                      }
                      renderValue={(selected) =>
                        fieldNames.find((field) => field.value === selected)
                          ?.label || ""
                      }
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            "& .MuiMenuItem-root.Mui-selected": {
                              fontWeight: "550", // Bold text for the selected item
                              color: "#6a69ff", // Blue text color for the selected item
                              fontFamily: "mulish,sans-serif",
                            },
                          },
                        },
                      }}
                    >
                      {fieldNames.map((field) => (
                        <MenuItem key={field.value} value={field.value}>
                          {field.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Condition</InputLabel>
                    <Select
                      label="Condition"
                      value={filter.condition}
                      onChange={(e) =>
                        handleMemberFilterChange(
                          index,
                          "condition",
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="is">Is</MenuItem>
                      <MenuItem value="is_not">Is Not</MenuItem>
                      <MenuItem value="contains">Contains</MenuItem>
                      <MenuItem value="does_not_contain">
                        Does Not Contain
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Render only one input field per filter.
                    If the selected field is "tdt" or "fdt", show the appropriate Date/Time Picker.
                    Otherwise, show a regular TextField. */}
                <Grid item xs={3.5}>
                  {filter.field === "tdt" || filter.field === "fdt" ? (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      {filter.field === "tdt" ? (
                        <DatePicker
                          label="Value"
                          inputFormat="YYYY-MM-DD"
                          value={filter.value ? dayjs(filter.value) : null}
                          onChange={(newValue) =>
                            handleMemberFilterChange(
                              index,
                              "value",
                              newValue?.format("YYYY-MM-DD")
                            )
                          }
                          renderInput={(params) => (
                            <TextField {...params} fullWidth size="small" />
                          )}
                        />
                      ) : (
                        <DateTimePicker
                          label="Value"
                          inputFormat="YYYY-MM-DD HH:mm:ss"
                          ampm={false}
                          views={[
                            "year",
                            "month",
                            "day",
                            "hours",
                            "minutes",
                            "seconds",
                          ]}
                          value={filter.value ? dayjs(filter.value) : null}
                          onChange={(newValue) =>
                            handleMemberFilterChange(
                              index,
                              "value",
                              newValue?.format("YYYY-MM-DD HH:mm:ss")
                            )
                          }
                          renderInput={(params) => (
                            <TextField {...params} fullWidth size="small" />
                          )}
                        />
                      )}
                    </LocalizationProvider>
                  ) : (
                    <TextField
                      fullWidth
                      label="Value"
                      size="small"
                      value={filter.value}
                      onChange={(e) =>
                        handleMemberFilterChange(index, "value", e.target.value)
                      }
                    />
                  )}
                </Grid>

                <Grid item xs={0.5} mr={2}>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveFilter(index)}
                  >
                    <RemoveCircleOutlineIcon sx={{ color: "#6a69ff" }} />
                  </IconButton>
                </Grid>

                {index < didFilters.length - 1 && (
                  <Grid item xs={12}>
                    <Typography
                      align="left"
                      color="textSecondary"
                      fontWeight="bold"
                    >
                      {filterLogic === "all" ? "AND" : "OR"}
                    </Typography>
                  </Grid>
                )}
              </React.Fragment>
            ))}
          </Grid>

          <Grid item xs={12} ml={0.5}>
            <Typography
              fontSize={15}
              color="#6a69ff"
              onClick={handleAddFilter}
              sx={{ cursor: "pointer", display: "inline-block" }}
            >
              <strong>+</strong> Add Another Field
            </Typography>
          </Grid>

          <Grid container gap={2} m={2} mt={4} ml={3.5}>
            <Grid item xs={2}>
              <Button
                variant="contained"
                fullWidth
                onClick={applyHandler}
                sx={{ bgcolor: "#6a69ff" }}
              >
                Apply
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={resetDataInternal}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="error" onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Drawer>
  );
};

export default MyFilterDrawer;
