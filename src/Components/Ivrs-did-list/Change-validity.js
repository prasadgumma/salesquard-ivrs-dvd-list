import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Box, Button, Snackbar, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import axios from "axios";
import { format } from "date-fns";

/**
 * Props:
 * - onClose: function to call when closing the modal
 * - selectedRows: array of selected row objects
 * - setSelectedRows: setter for selectedRows
 * - selectedIvrsRows: array of IVRS row objects whose IDs we need for the payload
 * - setSelectedIvrsRows: setter for selectedIvrsRows
 * - data, setData: context data handlers for refreshing UI
 */
const ChangeValidityModel = ({
  onClose,
  setSelectedRows,
  selectedIvrsRows,
  setSelectedIvrsRows,
  setData,
}) => {
  const { control, register, handleSubmit, reset } = useForm({
    defaultValues: {
      validDate: null,
      description: "",
    },
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const apiurl = process.env.REACT_APP_API_URL || "";

  const onSubmit = async (formData) => {
    try {
      // Format date as DD-MM-YYYY
      const formattedDate = formData.validDate
        ? format(formData.validDate, "dd-MM-yyyy")
        : null;

      // Unique IDs of selected IVRS rows
      // const k = Array.from(new Set(selectedIvrsRows.map((r) => r.id)));

      const payload = {
        lml: "67a455659d796", // replace dynamically if needed
        val_dt: formattedDate,
        k: selectedIvrsRows,
        val_desc: formData.description,
      };

      const response = await axios.post(
        `${apiurl}/v1/ivrsdid_valdty_update_multiple`,
        payload
      );

      // Assuming error_code "0" means success
      if (response?.data?.resp?.error_code === "0") {
        setSnackbar({
          open: true,
          message: "Validity updated successfully.",
          severity: "success",
        });

        // Update local context data immediately
        setData((prev) =>
          prev.map((row) =>
            selectedIvrsRows.includes(row.ivrsduniq)
              ? {
                  ...row,
                  tdt: formattedDate,
                  sdec: formData.description,
                  updatedAt: new Date().toLocaleString(),
                }
              : row
          )
        );

        // Clear selections
        setSelectedRows([]);
        setSelectedIvrsRows([]);
        // Reset form
        reset();
        onClose();
      } else {
        setSnackbar({
          open: true,
          message: "Failed to update validity.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSnackbar({
        open: true,
        message: "Submission error occurred.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
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
      <Controller
        name="validDate"
        control={control}
        render={({ field }) => (
          <DatePicker
            label="Validity Date"
            value={field.value}
            onChange={field.onChange}
            renderInput={(params) => <TextField fullWidth {...params} />}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "outlined",
                sx: {
                  "& .MuiInputLabel-root": {
                    color: "#1976d2",
                    fontWeight: 600,
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#ffffff",
                    "& fieldset": {
                      borderColor: "#1976d2",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1565c0",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#0d47a1",
                    },
                  },
                  "& .MuiInputBase-input": {
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  },
                },
              },
            }}
          />
        )}
      />

      <TextField
        fullWidth
        label="Description"
        variant="outlined"
        multiline
        rows={4}
        {...register("description")}
        inputProps={{ style: { resize: "both" } }}
      />

      <Box display="flex" justifyContent="center" gap={2}>
        <Button type="submit" variant="contained">
          Submit
        </Button>
        <Button
          type="button"
          variant="contained"
          color="error"
          onClick={onClose}
        >
          Cancel
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </Box>
  );
};

export default ChangeValidityModel;
