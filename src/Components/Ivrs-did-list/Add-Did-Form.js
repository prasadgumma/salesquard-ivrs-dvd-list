import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import CloseIcon from "@mui/icons-material/Close";

const IvrsDidAddForm = ({ setOpenDrawer, handleShow }) => {
  const [dropdownData, setDropdownData] = useState({
    tsp: [],
    account: [],
    route: [],
    didType: [],
    did: [],
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const apiurl = process.env.REACT_APP_API_URL;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      account: null,
      didType: "",
      tsp: "",
      did: [],
      route: null,
      agentType: "1st number agent",
      fromDate: new Date(),
      toDate: new Date(),
      description: "",
    },
  });

  // Fetch static dropdown data when component mounts
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
  }, [apiurl]);

  // Watch for changes on DID Type and TSP to fetch new DID data
  const didTypeValue = watch("didType");
  const tspValue = watch("tsp");

  useEffect(() => {
    setValue("did", []);
    const fetchDid = async () => {
      if (!didTypeValue || !tspValue) return;

      try {
        const didRes = await axios.post(`${apiurl}/did_drp_typ_tsp`, {
          lml: "67a455659d796",
          mtyp: "5c2e5b697d91c",
          didtyp_uniq: didTypeValue,
          tspid: tspValue,
        });

        const didData = didRes?.data?.resp?.did;

        setDropdownData((prev) => ({
          ...prev,
          did: Array.isArray(didData) ? didData : didData ? [didData] : [],
        }));
      } catch (error) {
        console.error("Error fetching DID data:", error);
      }
    };

    fetchDid();
  }, [didTypeValue, tspValue, apiurl, setValue]);

  // onSubmit function that shows the Snackbar based on the API response
  const onSubmit = async (data) => {
    try {
      const payload = {
        lml: "67a455659d796",
        uuiv: uuidv4(),
        start: data.fromDate
          ? new Date(data.fromDate).toISOString().split("T")[0]
          : "",
        end: data.toDate
          ? new Date(data.toDate).toISOString().split("T")[0]
          : "",
        acc: data.account?.acuni,
        didtyp: data.didType,
        did:
          data.did && data.did.length > 0
            ? data.did.map((item) => item.duni).join(",")
            : "",
        rout: data.route?.runi,
        des: data.description,
        agtyp: data.agentType,
      };

      const response = await axios.post(`${apiurl}/ivrs_did_add_v2`, payload);

      if (response?.data?.resp?.error_code === "0") {
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

  const onSubmitClose = async (data) => {
    const success = await onSubmit(data);
    if (success) {
      // Wait 1 second so that the Snackbar is visible before closing the drawer
      setTimeout(() => {
        setOpenDrawer(false);
        handleShow();
      }, 1);
    }
  };

  const onSubmitReset = async (data) => {
    const success = await onSubmit(data);
    if (success) {
      reset();
      // handleShow();
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
            IVRS DID
          </Typography>
          <IconButton onClick={() => setOpenDrawer(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Account Dropdown */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Controller
            name="account"
            control={control}
            rules={{ required: "Account is required" }}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={dropdownData.account || []}
                getOptionLabel={(option) => option.unm || ""}
                onChange={(event, newValue) => field.onChange(newValue)}
                value={field.value}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Account *"
                    variant="outlined"
                    error={!!errors.account}
                    helperText={errors.account ? errors.account.message : ""}
                  />
                )}
              />
            )}
          />
        </FormControl>

        {/* DID Type Dropdown */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Controller
            name="didType"
            control={control}
            rules={{ required: "DID Type is required" }}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={dropdownData.didType || []}
                getOptionLabel={(option) => option.mdtnm || ""}
                onChange={(event, newValue) =>
                  field.onChange(newValue ? newValue.mdtuniq : "")
                }
                value={
                  dropdownData.didType.find(
                    (did) => did.mdtuniq === field.value
                  ) || null
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="DID Type *"
                    variant="outlined"
                    error={!!errors.didType}
                    helperText={errors.didType ? errors.didType.message : ""}
                  />
                )}
              />
            )}
          />
        </FormControl>

        {/* TSP Dropdown */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Controller
            name="tsp"
            control={control}
            rules={{ required: "TSP is required" }}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={dropdownData.tsp || []}
                getOptionLabel={(option) => option.nm || ""}
                onChange={(event, newValue) =>
                  field.onChange(newValue ? newValue.uni : "")
                }
                value={
                  dropdownData.tsp.find((tsp) => tsp.uni === field.value) ||
                  null
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="TSP *"
                    variant="outlined"
                    error={!!errors.tsp}
                    helperText={errors.tsp ? errors.tsp.message : ""}
                  />
                )}
              />
            )}
          />
        </FormControl>

        {/* DID Multiple Selection */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Controller
            name="did"
            control={control}
            rules={{ required: "At least one DID must be selected" }}
            render={({ field }) => (
              <Autocomplete
                multiple
                options={dropdownData.did || []}
                getOptionLabel={(option) => option.dnum || ""}
                onChange={(event, newValue) => field.onChange(newValue)}
                value={field.value}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="DID"
                    variant="outlined"
                    error={!!errors.did}
                    helperText={errors.did ? errors.did.message : ""}
                  />
                )}
              />
            )}
          />
        </FormControl>

        {/* Route Dropdown */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Controller
            name="route"
            control={control}
            rules={{ required: "Route is required" }}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={dropdownData.route || []}
                getOptionLabel={(option) => option.rtnm || ""}
                onChange={(event, newValue) => field.onChange(newValue)}
                value={
                  dropdownData.route.find(
                    (route) => route.runi === field.value?.runi
                  ) || null
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Route *"
                    variant="outlined"
                    error={!!errors.route}
                    helperText={errors.route ? errors.route.message : ""}
                  />
                )}
              />
            )}
          />
        </FormControl>

        {/* Agent Type Dropdown */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Controller
            name="agentType"
            control={control}
            rules={{ required: "Agent Type is required" }}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={[
                  { label: "1st Number Agent", value: "1st number agent" },
                  { label: "2nd Number Agent", value: "2nd number agent" },
                ]}
                getOptionLabel={(option) => option.label}
                onChange={(event, newValue) =>
                  field.onChange(newValue ? newValue.value : "")
                }
                value={
                  [
                    { label: "1st Number Agent", value: "1st number agent" },
                    { label: "2nd Number Agent", value: "2nd number agent" },
                  ].find((opt) => opt.value === field.value) || null
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Agent Type *"
                    variant="outlined"
                    error={!!errors.agentType}
                    helperText={
                      errors.agentType ? errors.agentType.message : ""
                    }
                  />
                )}
              />
            )}
          />
        </FormControl>

        {/* Date Pickers */}
        <Box display="flex" sx={{ mb: 2 }}>
          <Controller
            name="fromDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="From Date"
                value={field.value}
                onChange={(newValue) => field.onChange(newValue)}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            )}
          />
          <Box
            p={1.8}
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "#d1d1cf",
              mx: 1,
            }}
          >
            to
          </Box>
          <Controller
            name="toDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="To Date"
                value={field.value}
                onChange={(newValue) => field.onChange(newValue)}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            )}
          />
        </Box>

        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          multiline
          rows={4}
          sx={{
            mb: 1,
            "& .MuiInputBase-root textarea": {
              resize: "both",
            },
          }}
          {...register("description")}
        />

        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmitClose)}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmitReset)}
          >
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

export default IvrsDidAddForm;
