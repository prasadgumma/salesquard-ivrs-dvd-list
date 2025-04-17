// import React, { useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { Box, Button, Snackbar, TextField } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers";
// import axios from "axios";
// import { format } from "date-fns";

// /**
//  * Props:
//  * - onClose: function to call when closing the modal
//  * - selectedRows: array of selected row objects (not used here but passed for consistency)
//  * - setSelectedRows: setter for selectedRows
//  * - selectedIvrsRows: array of IVRS row objects whose IDs we need for the payload
//  * - setSelectedIvrsRows: setter for selectedIvrsRows (to clear after submit)
//  * - data, setData: optional context data handlers if you need to refresh UI
//  */
// const ChangeValidityModel = ({
//   onClose,
//   selectedRows,
//   setSelectedRows,
//   selectedIvrsRows,
//   setSelectedIvrsRows,
//   data,
//   setData,
// }) => {
//   const { control, register, handleSubmit, reset } = useForm({
//     defaultValues: {
//       validDate: null,
//       description: "",
//     },
//   });
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "",
//   });

//   // Make sure REACT_APP_API_URL is defined in your .env
//   const apiurl = process.env.REACT_APP_API_URL || "";

//   // const onSubmit = async (formData) => {
//   //   try {
//   //     // Format the picked date
//   //     const formattedDate = formData.validDate
//   //       ? format(formData.validDate, "dd-MM-yyyy")
//   //       : null;

//   //     const payload = {
//   //       lml: "67a455659d796", // replace or make dynamic as needed
//   //       val_dt: formattedDate,
//   //       k: selectedIvrsRows,
//   //       val_desc: formData.description,
//   //     };

//   //     const response = await axios.post(
//   //       `${apiurl}/v1/ivrsdid_valdty_update_multiple`,
//   //       payload
//   //     );

//   //     console.log("API Response:", response);

//   //     // Clear IVRS selections and optionally reset context
//   //     setSelectedIvrsRows([]);
//   //     // if needed, refresh data context:
//   //     // setData(prev => /* fetch or update with result */);

//   //     onClose();
//   //   } catch (error) {
//   //     console.error("API Error:", error);
//   //   }
//   // };

//   const onSubmit = async (formData) => {
//     try {
//       const selectedOption = formData.selectedOption;
//       const formattedDate = formData.validDate
//         ? format(formData.validDate, "dd-MM-yyyy")
//         : null;
//       const payload = {
//         lml: "67a455659d796", // replace or make dynamic as needed
//         val_dt: formattedDate,
//         k: selectedIvrsRows,
//         val_desc: formData.description,
//       };

//       const response = await axios.post(
//         `${apiurl}/v1/ivrsdid_valdty_update_multiple`,
//         payload
//       );

//       console.log(response, "Res");

//       if (response?.data?.resp?.error_code === "0") {
//         setSnackbar({
//           open: true,
//           message: "Route updated successfully.",
//           severity: "success",
//         });

//         // Immediately update local state:
//         setData((prevData) =>
//           prevData.map((row) =>
//             selectedIvrsRows.includes(row.ivrsduniq)
//               ? {
//                   ...row,
//                   // Update status to selected route's unique value (adjust as needed)
//                   tdt: selectedOption?.tdt || row.stat,
//                   // Set new description
//                   sdes: formData.description,
//                   // Update the timestamp
//                   sudt: new Date().toLocaleString(),
//                 }
//               : row
//           )
//         );

//         // Clear the selected IVRS rows.
//         setSelectedIvrsRows([]);
//         setSelectedRows([]);

//         // Trigger any additional update callback if provided.
//         // if (onUpdate && typeof onUpdate === "function") {
//         //   onUpdate(selectedOption, formData.description);
//         // }

//         // Reset the form fields.
//         reset();
//         // Close the modal.
//         onClose();
//       } else {
//         setSnackbar({
//           open: true,
//           message: "Failed to update route.",
//           severity: "error",
//         });
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       setSnackbar({
//         open: true,
//         message: "Error occurred during submission.",
//         severity: "error",
//       });
//     }
//   };
//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   return (
//     <Box
//       component="form"
//       onSubmit={handleSubmit(onSubmit)}
//       noValidate
//       sx={{ display: "flex", flexDirection: "column", gap: 2, width: 400 }}
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
//           variant="outlined"
//           color="error"
//           onClick={onClose}
//         >
//           Cancel
//         </Button>
//       </Box>
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         message={snackbar.message}
//       />
//     </Box>
//   );
// };

// export default ChangeValidityModel;

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
  selectedRows,
  setSelectedRows,
  selectedIvrsRows,
  setSelectedIvrsRows,
  data,
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
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: 400 }}
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
          variant="outlined"
          color="error"
          onClick={onClose}
        >
          Cancel
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </Box>
  );
};

export default ChangeValidityModel;
