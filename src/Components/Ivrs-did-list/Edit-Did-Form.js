import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  FormControl,
  Box,
  Typography,
  Autocomplete,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import MD5 from "crypto-js/md5";
import customParseFormat from "dayjs/plugin/customParseFormat";
import CloseIcon from "@mui/icons-material/Close";
dayjs.extend(customParseFormat);

const IvrsDidEditForm = ({
  setOpenEditDrawer,
  selectedDidData,
  handleShow,
}) => {
  // Initialize state with keys matching your API payload
  const [formData, setFormData] = useState({
    ...selectedDidData[0],
    // Ensure your date fields and description are stored with these keys:
    fdt: selectedDidData[0].fdt, // from date
    tdt: selectedDidData[0].tdt, // to date
    accuni: selectedDidData[0].accuni, // account id
    didtypuni: selectedDidData[0].didtypuni, // DID type id
    tspid: selectedDidData[0].tspid, // TSP id
    rtuni: selectedDidData[0].rtuni, // Route id
    descr: selectedDidData[0].descr, // description
    agtyp: selectedDidData[0].agtyp, // agent type
    // did and any other fields remain the same
  });

  const [dropdownData, setDropdownData] = useState({
    account: [],
    didType: [],
    tsp: [],
    did: [],
    route: [],
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const apiurl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [tspRes, routeRes, accountRes, didTypRes, didRes] =
          await Promise.all([
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
            axios.post(`${apiurl}/did_drp_edit`, {
              lml: "67a455659d796",
              mtyp: "5c2e5b697d91c",
              didtyp_uniq: formData.didtypuni,
              tspid: formData.tspid,
            }),
          ]);
        setDropdownData({
          tsp: tspRes?.data?.resp?.tsp_list || [],
          account: accountRes?.data?.resp?.acc_users_call_log || [],
          route: routeRes?.data?.resp?.route || [],
          didType: didTypRes?.data?.resp?.did_type || [],
          did: didRes?.data?.resp?.did || [],
        });
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, [apiurl, formData.didtypuni, formData.tspid]);

  // Map incoming names to the actual keys in formData
  const handleChange = (name, value) => {
    let key = name;
    if (name === "account") key = "accuni";
    else if (name === "didType") key = "didtypuni";
    else if (name === "tsp") key = "tspid";
    else if (name === "route") key = "rtuni";
    else if (name === "fromDate") key = "fdt";
    else if (name === "toDate") key = "tdt";
    else if (name === "description") key = "descr";
    else if (name === "agentType") key = "agtyp";

    console.log("handleChange - Name:", name, "Value:", value);
    setFormData((prev) => ({
      ...prev,
      [key]: value,
      // If you change DID type or TSP, you may want to reset the DID list:
      ...(name === "didType" || name === "tsp" ? { did: [] } : {}),
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log("DID unique:", formData?.diduni);
      const payload = {
        lml: "67a455659d796",
        k: MD5(formData.ivrsduniq).toString(),
        start: formData.fdt,
        end: formData.tdt,
        acc: formData.accuni,
        didtyp: formData.didtypuni,
        did: formData?.diduni,
        rout: formData.rtuni,
        des: formData.descr,
        agtyp: formData.agtyp,
      };

      console.log("Payload:", payload);
      const response = await axios.post(
        `${apiurl}/ivrs_did_update_v1`,
        payload
      );
      console.log("Response:", response.data);
      if (response?.data?.resp?.error_code === "0") {
        setTimeout(() => {
          handleShow();
          setOpenEditDrawer(false);
        }, 10);
        setSnackbar({
          open: true,
          message: "Did Added successfully.",
          severity: "success",
        });

        return true;
      } else {
        console.error("API Error:", response?.data?.message);
        setSnackbar({
          open: true,
          message: response?.data?.message || "API Error occurred.",
          severity: "error",
        });
        return false;
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSnackbar({
        open: true,
        message: "Something went wrong. Please try again.",
        severity: "error",
      });
      return false;
    }
  };
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
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
        <Box display="flex" justifyContent="space-between" mb={1.5}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Edit IVRS DID
          </Typography>
          <IconButton onClick={() => setOpenEditDrawer(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Account Dropdown */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Autocomplete
            readOnly
            options={dropdownData.account || []}
            getOptionLabel={(option) => option.unm || ""}
            value={
              dropdownData.account.find(
                (acc) => acc.acuni === formData.accuni
              ) || null
            }
            onChange={(event, newValue) =>
              handleChange("account", newValue?.acuni || "")
            }
            renderInput={(params) => (
              <TextField {...params} label="Account *" variant="outlined" />
            )}
          />
        </FormControl>

        {/* DID Type Dropdown */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Autocomplete
            readOnly
            options={dropdownData.didType || []}
            getOptionLabel={(option) => option.mdtnm || ""}
            value={
              dropdownData.didType.find(
                (did) => did.mdtuniq === formData.didtypuni
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
            readOnly
            options={dropdownData.tsp || []}
            getOptionLabel={(option) => option.nm || ""}
            value={
              dropdownData.tsp.find((tsp) => tsp.uni === formData.tspid) || null
            }
            onChange={(event, newValue) =>
              handleChange("tsp", newValue?.uni || "")
            }
            renderInput={(params) => (
              <TextField {...params} label="TSP *" variant="outlined" />
            )}
          />
        </FormControl>

        {/* DID Dropdown (Read Only) */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Autocomplete
            multiple
            options={dropdownData.did || []}
            getOptionLabel={(option) => option.dnum || ""}
            value={dropdownData.did.filter((opt) =>
              formData?.diduni?.includes(opt?.duni)
            )}
            disableClearable
            onOpen={(event) => event.stopPropagation()} // Prevent dropdown from opening
            onFocus={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.preventDefault()}
            readOnly
            renderInput={(params) => (
              <TextField
                {...params}
                label="DID"
                variant="outlined"
                inputProps={{ ...params.inputProps }}
              />
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
                (route) => route.runi === formData.rtuni
              ) || null
            }
            onChange={(event, newValue) =>
              handleChange("route", newValue?.runi || "")
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
              { label: "1st Number Agent", value: 0 },
              { label: "2nd Number Agent", value: 1 },
            ]}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            } // 🔥 IMPORTANT
            value={
              [
                { label: "1st Number Agent", value: 0 },
                { label: "2nd Number Agent", value: 1 },
              ].find((opt) => opt.value === formData.agtyp) || null
            }
            onChange={(event, newValue) =>
              handleChange("agentType", newValue?.value || "")
            }
            renderInput={(params) => (
              <TextField {...params} label="Agent Type *" variant="outlined" />
            )}
          />
        </FormControl>

        {/* Date Pickers */}
        <Box display="flex" alignItems="center">
          <DatePicker
            label="From Date"
            value={formData.fdt ? dayjs(formData.fdt, "DD-MM-YYYY") : null}
            format="DD-MM-YYYY"
            onChange={(newValue) =>
              handleChange(
                "fromDate",
                newValue ? dayjs(newValue).format("DD-MM-YYYY") : ""
              )
            }
            renderInput={(params) => (
              <TextField fullWidth sx={{ mb: 2 }} {...params} />
            )}
          />

          <Box p={1.8} mb={2} bgcolor="#d1d1cf">
            to
          </Box>

          <DatePicker
            label="To Date"
            value={formData.tdt ? dayjs(formData.tdt, "DD-MM-YYYY") : null}
            format="DD-MM-YYYY"
            onChange={(newValue) =>
              handleChange(
                "toDate",
                newValue ? dayjs(newValue).format("DD-MM-YYYY") : ""
              )
            }
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
          type="text"
          value={formData.descr}
          onChange={(e) => handleChange("description", e.target.value)}
          variant="outlined"
          multiline
          rows={4}
          sx={{
            mb: 1,
            "& .MuiInputBase-root textarea": {
              resize: "both",
            },
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Update
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenEditDrawer(false)}
          >
            Cancel
          </Button>
        </Box>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
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
    </LocalizationProvider>
  );
};

export default IvrsDidEditForm;
