import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Grid, Button, TextField, Autocomplete, Box } from "@mui/material";

const options = [
  { label: "Cloud Tel - Transactional", value: "option1" },
  { label: "Cloud Tel - Promotional", value: "option2" },
  { label: "Cloud Tel - Optin", value: "option3" },
];

const RouteChangeModel = ({ onClose }) => {
  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      selectedOption: null,
      description: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };
  const handleClose = () => {
    onClose();
  };

  return (
    <Box sx={{ width: "80%", margin: "0 auto" }}>
      {/* This Box increases the form width to 80% of its container and centers it */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Controller
              name="selectedOption"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={options}
                  getOptionLabel={(option) => option.label || ""}
                  value={field.value}
                  onChange={(_event, newValue) => field.onChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Option"
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
              sx={{
                mb: 1,
                "& .MuiInputBase-root textarea": {
                  resize: "both",
                },
              }}
              {...register("description")}
            />
          </Grid>
          <Grid item xs={12} container spacing={2} justifyContent="flex-end">
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleClose}
              >
                Submit
              </Button>
            </Grid>
            <Grid item>
              <Button
                type="reset"
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
