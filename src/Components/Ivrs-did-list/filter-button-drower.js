import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Grid, Autocomplete } from "@mui/material";
import axios from "axios";
import IvrsDidListTable from "./Ivrs-did-table";
import { v4 as uuidv4 } from "uuid";

const FilterDrawer = () => {
  const [dropdownData, setDropdownData] = useState({
    tsp: [],
    account: [],
    route: [],
  });

  const [formData, setFormData] = useState({
    tsp: ["-1"], // Default: "All"
    account: ["-1"],
    route: ["-1"],
    status: "-1",
  });

  const [tableDidData, setTableDidData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiurl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchDropdownData();
  }, []);

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
          ...(tspRes?.data?.resp?.tsp_list || []),
        ],
        account: [
          { acuni: "-1", unm: "All" },
          ...(accountRes?.data?.resp?.acc_users_call_log || []),
        ],
        route: [
          { runi: "-1", rtnm: "All" },
          ...(routeRes?.data?.resp?.route || []),
        ],
      });
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  // Change handler updates the state without filtering out "All"
  const handleChange = (name, value) => {
    if (name === "status") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleShow = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${apiurl}/ivrs_did_list_v2`, {
        lml: "67a455659d796",
        page: 1,
        acc:
          formData?.account?.length > 0 ? formData.account.join("','") : "-1",
        tsp: formData?.tsp?.length > 0 ? formData.tsp.join("','") : "-1",
        rout: formData?.route?.length > 0 ? formData.route.join("','") : "-1",
        rtype: formData.status,
      });

      if (response?.data?.resp?.error_code === "0") {
        setTableDidData(
          response?.data?.resp?.ivrsdidlist?.map((item, index) => ({
            ...item,
            id: index + 1,
            uuiv: `${index}-${uuidv4()}`,
          })) || []
        );
      } else {
        throw new Error(response.data.resp.message);
      }
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      setError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Common styling for the TextField used in Autocomplete
  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      backgroundColor: "#fff",
      "& fieldset": { borderColor: "#ced4da" },
      "&:hover fieldset": { borderColor: "#a1a1a1" },
      "&.Mui-focused fieldset": { borderColor: "#1976d2" },
    },
    "& .MuiInputLabel-root": { color: "#1976d2" },
  };

  // Helper: If more than one value is selected, exclude "-1" (All) from the chips
  const getDisplayValues = (selectedValues) => {
    if (selectedValues.length > 1 && selectedValues.includes("-1")) {
      return selectedValues.filter((val) => val !== "-1");
    }
    return selectedValues;
  };

  // Calculate display values for each filter
  const tspDisplayValues = getDisplayValues(formData.tsp);
  const accountDisplayValues = getDisplayValues(formData.account);
  const routeDisplayValues = getDisplayValues(formData.route);

  return (
    <>
      <Box mt={2} mr={2} textAlign="end">
        <Box
          p={2}
          sx={{
            width: "97%",
            backgroundColor: "#f5f5f5",
            borderRadius: "12px",
          }}
        >
          <Grid container alignItems="center" spacing={2} flexWrap="wrap">
            {/* TSP Filter */}
            <Grid item xs={12} sm={6} md={2.8}>
              <Autocomplete
                multiple
                options={dropdownData.tsp} // Always show full list in the dropdown
                getOptionLabel={(option) => option.nm || ""}
                value={dropdownData.tsp.filter((opt) =>
                  tspDisplayValues.includes(opt.uni)
                )}
                onChange={(event, newValue) => {
                  const selectedValues = newValue.map((item) => item.uni);
                  handleChange("tsp", selectedValues);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="TSP"
                    variant="outlined"
                    sx={textFieldSx}
                  />
                )}
              />
            </Grid>

            {/* Account Filter */}
            <Grid item xs={12} sm={6} md={2.8}>
              <Autocomplete
                multiple
                options={dropdownData.account}
                getOptionLabel={(option) => option.unm || ""}
                value={dropdownData.account.filter((opt) =>
                  accountDisplayValues.includes(opt.acuni)
                )}
                onChange={(event, newValue) =>
                  handleChange(
                    "account",
                    newValue.map((item) => item.acuni)
                  )
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Account"
                    variant="outlined"
                    sx={textFieldSx}
                  />
                )}
              />
            </Grid>

            {/* Route Filter */}
            <Grid item xs={12} sm={6} md={2.7}>
              <Autocomplete
                multiple
                options={dropdownData.route}
                getOptionLabel={(option) => option.rtnm || ""}
                value={dropdownData.route.filter((opt) =>
                  routeDisplayValues.includes(opt.runi)
                )}
                onChange={(event, newValue) =>
                  handleChange(
                    "route",
                    newValue.map((item) => item.runi)
                  )
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Routes"
                    variant="outlined"
                    sx={textFieldSx}
                  />
                )}
              />
            </Grid>

            {/* Status Filter */}
            <Grid item xs={12} sm={6} md={2.7}>
              <Autocomplete
                options={[
                  { label: "All", value: "-1" },
                  { label: "Active", value: "1" },
                  { label: "Suspended", value: "2" },
                  { label: "Expired", value: "3" },
                ]}
                getOptionLabel={(option) => option.label}
                value={
                  [
                    { label: "All", value: "-1" },
                    { label: "Active", value: "1" },
                    { label: "Suspended", value: "2" },
                    { label: "Expired", value: "3" },
                  ].find((opt) => opt.value === formData.status) || null
                }
                onChange={(event, newValue) => {
                  handleChange("status", newValue ? newValue.value : "-1");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Status"
                    variant="outlined"
                    sx={textFieldSx}
                    fullWidth
                  />
                )}
              />
            </Grid>

            {/* Show Button */}
            <Grid item xs={12} sm={6} md={1}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleShow}
                fullWidth
                sx={{ borderRadius: "8px", padding: "10px" }}
              >
                Show
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Box mt={0.5}>
        <IvrsDidListTable tableDidData={tableDidData} handleShow={handleShow} />
      </Box>
    </>
  );
};

export default FilterDrawer;

// import React, { useState, useEffect } from "react";
// import { Box, Button, TextField, Grid, Autocomplete } from "@mui/material";
// import axios from "axios";
// import IvrsDidListTable from "./Ivrs-did-table";
// import { v4 as uuidv4 } from "uuid";

// const FilterDrawer = () => {
//   const [dropdownData, setDropdownData] = useState({
//     tsp: [],
//     account: [],
//     route: [],
//   });

//   // "All" is represented by "-1"
//   const [formData, setFormData] = useState({
//     tsp: ["-1"],
//     account: ["-1"],
//     route: ["-1"],
//     status: "-1",
//   });

//   const [tableDidData, setTableDidData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
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

//   // Helper: When displaying the chips in the text field,
//   // hide "All" (i.e. "-1") if any other option is selected.
//   const getDisplayValues = (selectedValues) => {
//     if (selectedValues.length > 1 && selectedValues.includes("-1")) {
//       return selectedValues.filter((val) => val !== "-1");
//     }
//     return selectedValues;
//   };

//   const handleChange = (name, value) => {
//     // If no value is selected, default back to "All"
//     const newValue = value.length === 0 ? ["-1"] : value;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: newValue,
//     }));
//   };

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

//   // Common styling for the TextField in Autocomplete
//   const textFieldSx = {
//     "& .MuiOutlinedInput-root": {
//       borderRadius: "8px",
//       backgroundColor: "#fff",
//       "& fieldset": { borderColor: "#ced4da" },
//       "&:hover fieldset": { borderColor: "#a1a1a1" },
//       "&.Mui-focused fieldset": { borderColor: "#1976d2" },
//     },
//     "& .MuiInputLabel-root": { color: "#1976d2" },
//   };

//   return (
//     <>
//       <Box mt={2} mr={2} textAlign="end">
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
//             <Grid item xs={12} sm={6} md={2.8}>
//               <Autocomplete
//                 multiple
//                 options={dropdownData.tsp} // Dropdown always shows full list including "All"
//                 getOptionLabel={(option) => option.nm || ""}
//                 value={dropdownData.tsp.filter((opt) =>
//                   getDisplayValues(formData.tsp).includes(opt.uni)
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
//             <Grid item xs={12} sm={6} md={2.8}>
//               <Autocomplete
//                 multiple
//                 options={dropdownData.account}
//                 getOptionLabel={(option) => option.unm || ""}
//                 value={dropdownData.account.filter((opt) =>
//                   getDisplayValues(formData.account).includes(opt.acuni)
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
//             <Grid item xs={12} sm={6} md={2.7}>
//               <Autocomplete
//                 multiple
//                 options={dropdownData.route}
//                 getOptionLabel={(option) => option.rtnm || ""}
//                 value={dropdownData.route.filter((opt) =>
//                   getDisplayValues(formData.route).includes(opt.runi)
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
//                 sx={{ borderRadius: "8px", padding: "10px" }}
//               >
//                 Show
//               </Button>
//             </Grid>
//           </Grid>
//         </Box>
//       </Box>

//       <Box mt={0.5}>
//         <IvrsDidListTable tableDidData={tableDidData} handleShow={handleShow} />
//       </Box>
//     </>
//   );
// };

// export default FilterDrawer;
