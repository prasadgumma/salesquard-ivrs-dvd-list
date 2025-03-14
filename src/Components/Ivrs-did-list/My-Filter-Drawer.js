// import React, { useState, useContext } from "react";
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
// } from "@mui/material";
// import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
// import { FilterContext } from "../context/FilterProvider";

// const MyFilterDrawer = ({
//   openDrawer,
//   toggleDrawer,
//   fieldNames,
//   resetData,
// }) => {
//   // Use the FilterContext to get the data and setter
//   const { data, setData } = useContext(FilterContext);
//   const [didFilters, setDidFilters] = useState([
//     { field: "", condition: "", value: "" },
//   ]);
//   const [filterLogic, setFilterLogic] = useState("all");

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
//           console.log(value);
//         }

//         if (field && condition && value) {
//           filteredData = filteredData.filter((item) => {
//             // console.log(typeof field);
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
//           const { field, condition, value } = filter;
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

//   const resetFilters = () => {
//     setDidFilters([{ field: "", condition: "", value: "" }]);
//     resetData();
//     toggleDrawer();
//   };

//   return (
//     <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer}>
//       <Box p={2} width="600px">
//         <Typography variant="h6" mb={2}>
//           My Filters
//         </Typography>
//         <Grid container spacing={3}>
//           {/* Overall filter logic selection */}
//           <Grid item xs={12} textAlign="center">
//             <FormControl sx={{ width: "200px" }}>
//               <InputLabel>Filter Condition</InputLabel>
//               <Select
//                 label="Filter Condition"
//                 value={filterLogic}
//                 onChange={(e) => setFilterLogic(e.target.value)}
//               >
//                 <MenuItem value="all">All (AND)</MenuItem>
//                 <MenuItem value="any">Any (OR)</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>

//           {/* Render each filter row */}
//           {didFilters.map((filter, index) => (
//             <React.Fragment key={index}>
//               <Grid item xs={5}>
//                 <FormControl fullWidth>
//                   <InputLabel>Field</InputLabel>
//                   <Select
//                     label="Field"
//                     value={filter.field}
//                     onChange={(e) =>
//                       handleMemberFilterChange(index, "field", e.target.value)
//                     }
//                   >
//                     {fieldNames.map((field) => (
//                       <MenuItem key={field.value} value={field.value}>
//                         {field.label}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>

//               <Grid item xs={3}>
//                 <FormControl fullWidth>
//                   <InputLabel>Condition</InputLabel>
//                   <Select
//                     label="Condition"
//                     value={filter.condition}
//                     onChange={(e) =>
//                       handleMemberFilterChange(
//                         index,
//                         "condition",
//                         e.target.value
//                       )
//                     }
//                   >
//                     <MenuItem value="is">Is</MenuItem>
//                     <MenuItem value="is_not">Is Not</MenuItem>
//                     <MenuItem value="contains">Contains</MenuItem>
//                     <MenuItem value="does_not_contain">
//                       Does Not Contain
//                     </MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>

//               <Grid item xs={3}>
//                 <TextField
//                   fullWidth
//                   label="Value"
//                   value={filter.value}
//                   onChange={(e) =>
//                     handleMemberFilterChange(index, "value", e.target.value)
//                   }
//                 />
//               </Grid>

//               <Grid item xs={1}>
//                 <IconButton
//                   color="error"
//                   onClick={() => handleRemoveFilter(index)}
//                   disabled={didFilters.length === 1}
//                 >
//                   <RemoveCircleOutlineIcon />
//                 </IconButton>
//               </Grid>

//               {/* Display operator (AND/OR) between filters */}
//               {index < didFilters.length - 1 && (
//                 <Grid item xs={12}>
//                   <Typography align="center" color="textSecondary">
//                     {filterLogic === "all" ? "AND" : "OR"}
//                   </Typography>
//                 </Grid>
//               )}
//             </React.Fragment>
//           ))}

//           {/* Add filter row */}
//           <Grid item xs={12}>
//             <Typography
//               fontSize={15}
//               color="primary"
//               onClick={handleAddFilter}
//               sx={{ cursor: "pointer" }}
//             >
//               <strong>+</strong> Add Another Filter
//             </Typography>
//           </Grid>

//           {/* Apply and Reset buttons */}
//           <Grid item xs={6}>
//             <Button
//               variant="contained"
//               color="primary"
//               fullWidth
//               onClick={applyHandler}
//             >
//               Apply Filters
//             </Button>
//           </Grid>
//           <Grid item xs={6}>
//             <Button
//               variant="contained"
//               color="primary"
//               fullWidth
//               onClick={resetFilters}
//             >
//               Reset Filters
//             </Button>
//           </Grid>
//         </Grid>
//       </Box>
//     </Drawer>
//   );
// };

// export default MyFilterDrawer;

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
} from "@mui/material";

import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { FilterContext } from "../context/FilterProvider";
import CancelIcon from "@mui/icons-material/Cancel";

const MyFilterDrawer = ({ openDrawer, toggleDrawer, resetData }) => {
  const { data, setData } = useContext(FilterContext);
  const [didFilters, setDidFilters] = useState([
    { field: "", condition: "", value: "" },
  ]);
  const [filterLogic, setFilterLogic] = useState("all");
  const initialData = useRef(data);

  // Declare fieldNames inside the component
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
    { value: "stat", label: "Status" },
    // You can add more fields here if needed
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

  // Apply filters to the data using the selected logic
  const applyHandler = () => {
    let filteredData = [...data];
    if (filterLogic === "all") {
      // AND logic: every filter must match
      didFilters.forEach((filter) => {
        let { field, condition, value } = filter;
        if (field === "accontid") {
          value = parseInt(value, 10);
        }
        if (field === "tspnm") {
          value = value.toUpperCase();
        }
        if (field === "agtyp") {
          value = parseInt(value, 10);
        }
        if (field && condition && value) {
          filteredData = filteredData.filter((item) => {
            console.log(item);
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
      });
    } else if (filterLogic === "any") {
      // OR logic: at least one filter must match
      filteredData = filteredData.filter((item) => {
        return didFilters.some((filter) => {
          let { field, condition, value } = filter;
          if (field === "accontid") {
            value = parseInt(value, 10);
          }
          if (field === "tspnm") {
            value = value.toUpperCase();
          }
          if (field === "agtyp") {
            value = parseInt(value, 10);
          }
          if (field && condition && value) {
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
          }
          return false;
        });
      });
    }
    // Update the data in the context and close the drawer
    setData(filteredData);
    // toggleDrawer();
  };

  const resetDataInternal = () => {
    setDidFilters([{ field: "", condition: "", value: "" }]);
    setData(initialData.current);
    toggleDrawer();
  };

  return (
    <Drawer anchor="right" open={openDrawer}>
      <Box p={2} width="600px">
        <Box display={"flex"} justifyContent={"space-between"}>
          <Typography variant="h6" mb={2}>
            My Filters
          </Typography>
          <IconButton onClick={() => toggleDrawer()}>
            <CancelIcon />
          </IconButton>
        </Box>
        <Grid container spacing={3}>
          {/* Overall filter logic selection */}
          <Grid item xs={12} textAlign="center">
            <FormControl sx={{ width: "200px" }}>
              {/* <InputLabel>Filter Condition</InputLabel> */}
              <Select
                // label="Filter Condition"
                value={filterLogic}
                onChange={(e) => setFilterLogic(e.target.value)}
              >
                <MenuItem value="all">All </MenuItem>
                <MenuItem value="any">Any </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Render each filter row */}
          {didFilters.map((filter, index) => (
            <React.Fragment key={index}>
              <Grid item xs={5}>
                <FormControl fullWidth>
                  <InputLabel>Field</InputLabel>
                  <Select
                    label="Field"
                    value={filter.field}
                    onChange={(e) =>
                      handleMemberFilterChange(index, "field", e.target.value)
                    }
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
                <FormControl fullWidth>
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

              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Value"
                  value={filter.value}
                  onChange={(e) =>
                    handleMemberFilterChange(index, "value", e.target.value)
                  }
                />
              </Grid>

              <Grid item xs={1}>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveFilter(index)}
                  disabled={didFilters.length === 1}
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </Grid>

              {/* Display operator (AND/OR) between filters */}
              {index < didFilters.length - 1 && (
                <Grid item xs={12}>
                  <Typography align="center" color="textSecondary">
                    {filterLogic === "all" ? "AND" : "OR"}
                  </Typography>
                </Grid>
              )}
            </React.Fragment>
          ))}

          {/* Add filter row */}
          <Grid item xs={12}>
            <Typography
              fontSize={15}
              color="primary"
              onClick={handleAddFilter}
              sx={{ cursor: "pointer" }}
            >
              <strong>+</strong> Add Another Filter
            </Typography>
          </Grid>

          {/* Apply and Reset buttons */}
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={applyHandler}
            >
              Apply Filters
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={resetDataInternal}
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
};

export default MyFilterDrawer;
