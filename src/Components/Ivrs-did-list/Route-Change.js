import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Grid,
  Button,
  TextField,
  Autocomplete,
  Box,
  // Snackbar,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";

const RouteChangeModel = ({
  onClose,
  setSelectedRows,
  selectedIvrsRows,
  setSelectedIvrsRows,
  setData,
  onUpdate, // Optional callback to trigger after update
}) => {
  const { control, register, handleSubmit, reset } = useForm({
    defaultValues: {
      selectedOption: null,
      description: "",
    },
  });

  const [dropdownOptions, setDropdownOptions] = useState([]);

  const apiurl = process.env.REACT_APP_API_URL;

  // Fetch dropdown options when the component mounts
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const response = await axios.post(`${apiurl}/route_drp_acc_did`, {
          lml: "67a455659d796",
          mtyp: "5c2e5b697d91c",
        });
        if (response?.data?.resp?.route) {
          setDropdownOptions(response.data.resp.route);
        }
      } catch (error) {
        console.error("Error fetching dropdown options:", error);

        toast.error("Error fetching dropdown options:");
      }
    };
    fetchDropdownOptions();
  }, [apiurl]);

  const onSubmit = async (formData) => {
    try {
      const selectedOption = formData.selectedOption;

      const response = await axios.post(
        `${apiurl}/v1/ivrsdid_route_update_multiple`,
        {
          lml: "67a455659d796", // Session token
          route_uni: selectedOption?.runi, // Pass the unique value (runi)
          k: selectedIvrsRows, // The selected IVRS rows (IDs)
          rout_desc: formData.description, // The description from the form
        }
      );
      console.log(response, "Res");

      if (response?.data?.resp?.error_code === "0") {
        toast.success("Route updated successfully");
        // Immediately update local state:
        setData((prevData) =>
          prevData.map((row) =>
            selectedIvrsRows.includes(row.ivrsduniq)
              ? {
                  ...row,
                  // Update status to selected route's unique value (adjust as needed)
                  rtnm: selectedOption?.rtnm || row.stat,
                  // Set new description
                  sdes: formData.description,
                  // Update the timestamp
                  sudt: new Date().toLocaleString(),
                }
              : row
          )
        );

        // Clear the selected IVRS rows.
        setSelectedIvrsRows([]);
        setSelectedRows([]);

        // Trigger any additional update callback if provided.
        if (onUpdate && typeof onUpdate === "function") {
          onUpdate(selectedOption, formData.description);
        }

        // Reset the form fields.
        reset();
        // Close the modal.
        onClose();
      } else {
        toast.error("Failed to update route.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      toast.error("Error occurred during submission.");
    }
  };

  const handleClose = () => {
    onClose();
    reset(); // Reset the form when closing
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: 350,
        p: 3,
        backgroundColor: "#f0f4f8",
        borderRadius: 4,
        boxShadow: 3,
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Controller
              name="selectedOption"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={dropdownOptions}
                  getOptionLabel={(option) => option.rtnm || ""}
                  value={field.value}
                  onChange={(_event, newValue) => field.onChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Route Option"
                      fullWidth
                      size="small"
                    />
                  )}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              multiline
              rows={4}
              {...register("description")}
            />
          </Grid>

          <Grid item xs={12} container spacing={2} justifyContent="flex-end">
            <Grid item>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Grid>
            <Grid item>
              <Button
                type="button"
                variant="contained"
                color="error"
                onClick={handleClose}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default RouteChangeModel;
