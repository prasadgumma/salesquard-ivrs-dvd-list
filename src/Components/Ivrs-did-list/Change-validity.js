// import React from "react";
// import { useForm, Controller } from "react-hook-form";
// import { Box, Button, TextField } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers";
// import axios from "axios";
// import { format } from "date-fns";
// import toast from "react-hot-toast";

// /**
//  * Props:
//  * - onClose: function to call when closing the modal
//  * - selectedRows: array of selected row objects
//  * - setSelectedRows: setter for selectedRows
//  * - selectedIvrsRows: array of IVRS row objects whose IDs we need for the payload
//  * - setSelectedIvrsRows: setter for selectedIvrsRows
//  * - data, setData: context data handlers for refreshing UI
//  */
// const ChangeValidityModel = ({
//   onClose,
//   setSelectedRows,
//   selectedIvrsRows,
//   setSelectedIvrsRows,
//   setData,
// }) => {
//   const { control, register, handleSubmit, reset } = useForm({
//     defaultValues: {
//       validDate: null,
//       description: "",
//     },
//   });

//   const apiurl = process.env.REACT_APP_API_URL || "";

//   const onSubmit = async (formData) => {
//     try {
//       // Format date as DD-MM-YYYY
//       const formattedDate = formData.validDate
//         ? format(formData.validDate, "dd-MM-yyyy")
//         : null;

//       // Unique IDs of selected IVRS rows
//       // const k = Array.from(new Set(selectedIvrsRows.map((r) => r.id)));

//       const payload = {
//         lml: "67a455659d796", // replace dynamically if needed
//         val_dt: formattedDate,
//         k: selectedIvrsRows,
//         val_desc: formData.description,
//       };

//       const response = await axios.post(
//         `${apiurl}/v1/ivrsdid_valdty_update_multiple`,
//         payload
//       );
//       console.log(response, "Val Res");
//       // Assuming error_code "0" means success
//       if (response?.data?.resp?.error_code === "0") {
//         toast.success("Validity updated successfully.");
//         // Update local context data immediately
//         setData((prev) =>
//           prev.map((row) =>
//             selectedIvrsRows.includes(row.ivrsduniq)
//               ? {
//                   ...row,
//                   tdt: formattedDate,
//                   sdec: formData.description,
//                   updatedAt: new Date().toLocaleString(),
//                 }
//               : row
//           )
//         );

//         // Clear selections
//         setSelectedRows([]);
//         setSelectedIvrsRows([]);
//         // Reset form
//         reset();
//         onClose();
//       } else {
//         toast.error("Failed to update validity.");
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);

//       toast.error("Submission error occurred.");
//     }
//   };

//   return (
//     <Box
//       component="form"
//       onSubmit={handleSubmit(onSubmit)}
//       noValidate
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         gap: 3,
//         width: 350,
//         p: 3,
//         backgroundColor: "#f0f4f8",
//         borderRadius: 4,
//         boxShadow: 3,
//       }}
//     >
//       <Controller
//         name="validDate"
//         control={control}
//         render={({ field }) => (
//           <DatePicker
//             label="Validity Date"
//             value={field.value}
//             onChange={field.onChange}
//             renderInput={(params) => <TextField fullWidth {...params} />}
//             slotProps={{
//               textField: {
//                 fullWidth: true,
//                 variant: "outlined",
//                 sx: {
//                   "& .MuiInputLabel-root": {
//                     color: "#1976d2",
//                     fontWeight: 600,
//                   },
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: "12px",
//                     backgroundColor: "#ffffff",
//                     "& fieldset": {
//                       borderColor: "#1976d2",
//                     },
//                     "&:hover fieldset": {
//                       borderColor: "#1565c0",
//                     },
//                     "&.Mui-focused fieldset": {
//                       borderColor: "#0d47a1",
//                     },
//                   },
//                   "& .MuiInputBase-input": {
//                     fontWeight: 500,
//                     fontSize: "0.95rem",
//                   },
//                 },
//               },
//             }}
//           />
//         )}
//       />

//       <TextField
//         fullWidth
//         label="Description"
//         variant="outlined"
//         multiline
//         rows={4}
//         {...register("description")}
//         inputProps={{ style: { resize: "both" } }}
//       />

//       <Box display="flex" justifyContent="center" gap={2}>
//         <Button type="submit" variant="contained">
//           Submit
//         </Button>
//         <Button
//           type="button"
//           variant="contained"
//           color="error"
//           onClick={onClose}
//         >
//           Cancel
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default ChangeValidityModel;

import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import axios from "axios";
import { format } from "date-fns";
import toast from "react-hot-toast";

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

  const apiurl = process.env.REACT_APP_API_URL || "";

  const onSubmit = async (formData) => {
    try {
      const formattedDate = formData.validDate
        ? format(formData.validDate, "dd-MM-yyyy")
        : null;

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

      if (response?.data?.resp?.error_code === "0") {
        toast.success("Validity updated successfully.");
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
        setSelectedRows([]);
        setSelectedIvrsRows([]);
        reset();
        onClose();
      } else {
        toast.error("Failed to update validity.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Submission error occurred.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{
        width: 350,
        p: 4,
        borderRadius: "16px",
        background: "linear-gradient(to right, #f8fbff, #eef4fb)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: "#0d47a1",
          textAlign: "center",
        }}
      >
        Update Validity
      </Typography>

      <Divider sx={{ borderColor: "#1976d2" }} />

      <Controller
        name="validDate"
        control={control}
        render={({ field }) => (
          <DatePicker
            label="Validity Date"
            value={field.value}
            onChange={field.onChange}
            renderInput={(params) => <TextField {...params} fullWidth />}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "outlined",
                sx: {
                  "& .MuiInputLabel-root": {
                    color: "#1976d2",
                    fontWeight: 500,
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#ffffff",
                    "& fieldset": {
                      borderColor: "#90caf9",
                    },
                    "&:hover fieldset": {
                      borderColor: "#42a5f5",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#0d47a1",
                    },
                  },
                  "& .MuiInputBase-input": {
                    fontWeight: 500,
                    fontSize: "1rem",
                  },
                },
              },
            }}
          />
        )}
      />

      <TextField
        label="Description"
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        {...register("description")}
        sx={{
          "& .MuiInputLabel-root": {
            color: "#1976d2",
            fontWeight: 500,
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#ffffff",
            "& fieldset": {
              borderColor: "#90caf9",
            },
            "&:hover fieldset": {
              borderColor: "#42a5f5",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#0d47a1",
            },
          },
          "& .MuiInputBase-input": {
            fontWeight: 500,
            fontSize: "1rem",
          },
        }}
      />

      <Stack direction="row" justifyContent="center" spacing={2} mt={2}>
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "#1976d2",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          Submit
        </Button>
        <Button
          type="button"
          variant="contained"
          color="error"
          onClick={onClose}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            borderRadius: "10px",
          }}
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

export default ChangeValidityModel;
