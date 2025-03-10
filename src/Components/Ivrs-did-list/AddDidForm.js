import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  FormControl,
  Box,
  Typography,
  Autocomplete,
  IconButton,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Import UUID generator

const IvrsDidAddForm = ({ setOpenDrawer, handleShow }) => {
  const [formData, setFormData] = useState({
    account: "",
    didType: "",
    tsp: "",
    did: "",
    route: "",
    agentType: "1st number agent",
    fromDate: new Date(),
    toDate: new Date(),
    description: "",
  });

  const [dropdownData, setDropdownData] = useState({
    tsp: [],
    account: [],
    route: [],
    didType: [],
    did: [],
  });

  const apiurl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [tspRes, routeRes, accountRes, didTypRes] = await Promise.all([
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
          axios.post(`${apiurl}/did_typ_drp`, {
            lml: "67a455659d796",
            mtyp: "5c2e5b697d91c",
          }),
        ]);

        setDropdownData({
          tsp: tspRes?.data?.resp?.tsp_list || [],
          account: accountRes?.data?.resp?.acc_users_call_log || [],
          route: routeRes?.data?.resp?.route || [],
          didType: didTypRes?.data?.resp?.did_type || [],
          did: [],
        });
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  useEffect(() => {
    const fetchDid = async () => {
      if (!formData.didType || !formData.tsp) return;

      try {
        const didRes = await axios.post(`${apiurl}/did_drp_typ_tsp`, {
          lml: "67a455659d796",
          mtyp: "5c2e5b697d91c",
          didtyp_uniq: formData.didType,
          tspid: formData.tsp,
        });

        const didData = didRes?.data?.resp?.did;

        setDropdownData((prev) => ({
          ...prev,
          did: Array.isArray(didData) ? didData : didData ? [didData] : [], // Ensure it's always an array
        }));
      } catch (error) {
        console.error("Error fetching DID data:", error);
      }
    };

    fetchDid();
  }, [formData.didType, formData.tsp]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "didType" || name === "tsp" ? { did: [] } : {}), // 🔹 Reset DID if didType or tsp changes
    }));
  };

  const handleSubmit = async () => {
    try {
      // Ensure required fields are present before sending request
      if (
        !formData.did ||
        !formData.account ||
        !formData.didType ||
        !formData.route
      ) {
        console.error("Missing required fields");
        return;
      }

      // Generate a unique ID
      const uniqid = uuidv4();

      // Construct correct payload for API
      const payload = {
        lml: "67a455659d796",
        uuiv: uniqid,
        start: formData.fromDate
          ? new Date(formData.fromDate).toISOString().split("T")[0]
          : "",
        end: formData.toDate
          ? new Date(formData.toDate).toISOString().split("T")[0]
          : "",
        acc: formData.account.acuni,
        didtyp: formData.didType,
        did: formData?.did?.length > 0 ? formData?.did?.join(",") : "",
        rout: formData?.route?.runi,
        des: formData.description,
        agtyp: formData.agentType,
      };

      const response = await axios.post(`${apiurl}/ivrs_did_add_v2`, payload);

      if (response.data.resp.error_code !== "0") {
        console.error("API Error:", response.data.message);
      } else {
        // setData((prevData) => [...prevData, payload]);
        setOpenDrawer(false);
        handleShow();
        // Close drawer on success
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          maxWidth: 600,
          margin: "auto",
          p: 3,
          bgcolor: "#f5f5f5",
          borderRadius: 2,
        }}
      >
        <Box display={"flex"} justifyContent={"space-between"}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
            IVRS DID
          </Typography>
          <IconButton onClick={() => setOpenDrawer(false)}>
            <CancelIcon />
          </IconButton>
        </Box>

        {/* Account Dropdown */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Autocomplete
            options={dropdownData.account || []}
            getOptionLabel={(option) => option.unm || ""}
            value={
              dropdownData.account.find(
                (acc) => acc.acuni === formData.account.acuni
              ) || null
            }
            onChange={(event, newValue) =>
              handleChange("account", newValue || "")
            }
            renderInput={(params) => (
              <TextField {...params} label="Account *" variant="outlined" />
            )}
          />
        </FormControl>

        {/* DID Type Dropdown */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Autocomplete
            options={dropdownData.didType || []}
            getOptionLabel={(option) => option.mdtnm || ""}
            value={
              dropdownData.didType.find(
                (did) => did.mdtuniq === formData?.didType.mdtuniq
              ) || null
            }
            onChange={(event, newValue) =>
              handleChange("didType", newValue?.mdtuniq || "")
            }
            renderInput={(params) => (
              <TextField {...params} label="DID Type *" variant="outlined" />
            )}
          />
        </FormControl>

        {/* TSP Dropdown */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Autocomplete
            options={dropdownData.tsp || []}
            getOptionLabel={(option) => option.nm || ""}
            value={
              dropdownData.tsp.find((tsp) => tsp.uni === formData.tsp) || null
            }
            onChange={(event, newValue) =>
              handleChange("tsp", newValue?.uni || "")
            }
            renderInput={(params) => (
              <TextField {...params} label="TSP *" variant="outlined" />
            )}
          />
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <Autocomplete
            multiple
            options={dropdownData?.did || []}
            getOptionLabel={(option) => option.dnum || ""}
            value={dropdownData.did.filter((opt) =>
              formData.did.includes(opt.duni)
            )}
            onChange={(event, newValue) => {
              const selectedValues = newValue.map((item) => item.duni);
              handleChange("did", selectedValues);
            }}
            renderInput={(params) => (
              <TextField {...params} label="DID" variant="outlined" />
            )}
          />
        </FormControl>

        {/* Route Dropdown */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Autocomplete
            options={dropdownData.route || []}
            getOptionLabel={(option) => option.rtnm || ""}
            value={
              dropdownData.route.find(
                (route) => route.runi === formData.route.runi
              ) || null
            }
            onChange={(event, newValue) =>
              handleChange("route", newValue || "")
            }
            renderInput={(params) => (
              <TextField {...params} label="Route *" variant="outlined" />
            )}
          />
        </FormControl>

        {/* Agent Type Dropdown */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Autocomplete
            options={[
              { label: "1st Number Agent", value: "1st number agent" },
              { label: "2nd Number Agent", value: "2nd number agent" },
            ]}
            getOptionLabel={(option) => option.label}
            value={
              [
                { label: "1st Number Agent", value: "1st number agent" },
                { label: "2nd Number Agent", value: "2nd number agent" },
              ].find((opt) => opt.value === formData.agentType) || null
            }
            onChange={(event, newValue) =>
              handleChange("agentType", newValue?.value || "")
            }
            renderInput={(params) => (
              <TextField {...params} label="Agent Type *" variant="outlined" />
            )}
          />
        </FormControl>

        {/* From Date Picker */}
        <Box display={"flex"}>
          <DatePicker
            label="From Date"
            value={formData.fromDate}
            onChange={(newValue) => handleChange("fromDate", newValue)}
            renderInput={(params) => (
              <TextField fullWidth sx={{ mb: 2 }} {...params} />
            )}
          />
          <Box p={1.8} mb={2} bgcolor={"#d1d1cf"}>
            to
          </Box>
          {/* To Date Picker */}
          <DatePicker
            label="To Date"
            value={formData.toDate}
            onChange={(newValue) => handleChange("toDate", newValue)}
            renderInput={(params) => (
              <TextField fullWidth sx={{ mb: 2 }} {...params} />
            )}
          />
        </Box>

        {/* Description Field */}
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          variant="outlined"
          multiline
          rows={4}
          sx={{ mb: 2 }}
        />

        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save & New
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenDrawer(false)}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default IvrsDidAddForm;
