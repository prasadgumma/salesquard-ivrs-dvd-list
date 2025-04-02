// API Integrated Code
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Box, Button, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import axios from "axios";

const ChangeValidityModel = ({ onClose }) => {
  const [changeValidityData, setChangeValidityData] = useState();
  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      fromDate: null,
      toDate: null,
      description: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      // Prepare the payload in the required format
      const payload = {
        changeValidity: [
          {
            fromdate: data.fromDate,
            todate: data.toDate,
            description: data.description,
          },
        ],
      };

      const response = await axios.post(
        "http://localhost:7979/changeValidity",
        payload
      );
      setChangeValidityData(response.data);
      console.log("API Response:", response);

      onClose();
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const HandleClose = () => {
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" sx={{ mb: 2 }}>
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
      {/* <TextField
        fullWidth
        label="Description"
        variant="outlined"
        multiline
        rows={4}
        sx={{ mb: 2 }}
        {...register("description")}
      /> */}
      <TextField
        fullWidth
        label="Description"
        variant="outlined"
        multiline
        rows={4}
        // sx={{ mb: 2 }}
        sx={{
          mb: 1,
          "& .MuiInputBase-root textarea": {
            resize: "both",
          },
        }}
        {...register("description")}
        inputProps={{ style: { resize: "both" } }} // allows both vertical and horizontal resizing
      />

      <Box display="flex" gap={2} justifyContent={"center"}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClose={onClose}
        >
          Submit
        </Button>
        <Button
          type="reset"
          variant="contained"
          color="error"
          onClose={onClose}
          onClick={HandleClose}
        >
          Cancel
        </Button>
      </Box>
    </form>
  );
};

export default ChangeValidityModel;
