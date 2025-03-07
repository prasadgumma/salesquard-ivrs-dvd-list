import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Grid, Autocomplete } from "@mui/material";
import axios from "axios";
import IvrsDidListTable from "./Ivrs-did-table";
import { v4 as uuidv4 } from "uuid";

const FilterDrawer = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [dropdownData, setDropdownData] = useState({
    tsp: [],
    account: [],
    route: [],
  });

  const [formData, setFormData] = useState({
    tsp: ["-1"], // Ensuring it's an array for multi-select
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

  const handleChange = (name, value) => {
    if (name === "status") {
      // Status is a single value, so no need to use filter
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      // Handle multi-select filters (TSP, Account, Route)
      if (value.includes("-1")) {
        setFormData((prev) => ({
          ...prev,
          [name]: ["-1"], // Reset to ["-1"] if "All" is selected
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value.filter((v) => v !== "-1"), // Filter out "-1" if other values are selected
        }));
      }
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
        rtype: formData.status, // Passing the status correctly here
      });

      if (response?.data?.resp?.error_code === "0") {
        setOpenDrawer(false);
        setTableDidData(
          response?.data?.resp?.ivrsdidlist?.map((item, index) => ({
            ...item,
            id: index + 1, // You can use this as the serial number if needed
            uuiv: `${index}-${uuidv4()}`, // Generates a unique value combining the index and a UUID
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

  return (
    <>
      <Box mt={2} mr={2} textAlign="end">
        <Box p={2} sx={{ width: "97%", backgroundColor: "#fff" }}>
          <Grid container alignItems="center" spacing={2} flexWrap="wrap">
            {/* TSP Filter */}
            <Grid item xs={12} sm={6} md={2.8}>
              <Autocomplete
                multiple
                options={dropdownData?.tsp || []}
                getOptionLabel={(option) => option.nm || ""}
                value={dropdownData.tsp.filter((opt) =>
                  formData.tsp.includes(opt.uni)
                )}
                onChange={(event, newValue) => {
                  const selectedValues = newValue.map((item) => item.uni);
                  handleChange("tsp", selectedValues);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="TSP" variant="outlined" />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2.8}>
              <Autocomplete
                multiple
                options={dropdownData?.account || []}
                getOptionLabel={(option) => option.unm || ""}
                value={dropdownData.account.filter((opt) =>
                  formData.account.includes(opt.acuni)
                )}
                onChange={(event, newValue) =>
                  handleChange(
                    "account",
                    newValue.map((item) => item.acuni)
                  )
                }
                renderInput={(params) => (
                  <TextField {...params} label="Account" variant="outlined" />
                )}
              />
            </Grid>

            {/* Route Filter */}
            <Grid item xs={12} sm={6} md={2.7}>
              <Autocomplete
                multiple
                options={dropdownData?.route || []}
                getOptionLabel={(option) => option.rtnm || ""}
                value={dropdownData.route.filter((opt) =>
                  formData.route.includes(opt.runi)
                )}
                onChange={(event, newValue) =>
                  handleChange(
                    "route",
                    newValue.map((item) => item.runi)
                  )
                }
                renderInput={(params) => (
                  <TextField {...params} label="Routes" variant="outlined" />
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
              >
                Show
              </Button>
            </Grid>
          </Grid>
        </Box>
        {/* </Drawer> */}
      </Box>

      <Box mt={0.5}>
        <IvrsDidListTable tableDidData={tableDidData} handleShow={handleShow} />
      </Box>
    </>
  );
};

export default FilterDrawer;
