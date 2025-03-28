// import React from "react";
// import { useForm, Controller } from "react-hook-form";
// import { Box, Button, TextField } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers";

// const ChangeValidityModel = ({ onClose }) => {
//   const { control, register, handleSubmit } = useForm({
//     defaultValues: {
//       fromDate: null,
//       toDate: null,
//       description: "",
//     },
//   });

//   const onSubmit = (data) => {
//     console.log("Form Data:", data);
//   };
//   const HandleClose = () => {
//     onClose();
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <Box display="flex" sx={{ mb: 2 }}>
//         <Controller
//           name="fromDate"
//           control={control}
//           render={({ field }) => (
//             <DatePicker
//               label="From Date"
//               value={field.value}
//               onChange={(newValue) => field.onChange(newValue)}
//               renderInput={(params) => <TextField fullWidth {...params} />}
//             />
//           )}
//         />
//         <Box
//           p={1.8}
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             bgcolor: "#d1d1cf",
//             mx: 0.5,
//           }}
//         >
//           to
//         </Box>
//         <Controller
//           name="toDate"
//           control={control}
//           render={({ field }) => (
//             <DatePicker
//               label="To Date"
//               value={field.value}
//               onChange={(newValue) => field.onChange(newValue)}
//               renderInput={(params) => <TextField fullWidth {...params} />}
//             />
//           )}
//         />
//       </Box>
//       <TextField
//         fullWidth
//         label="Description"
//         variant="outlined"
//         multiline
//         rows={4}
//         sx={{ mb: 2 }}
//         {...register("description")}
//       />
//       <Box display="flex" gap={2}>
//         <Button
//           type="submit"
//           variant="contained"
//           color="primary"
//           onClick={HandleClose}
//         >
//           Submit
//         </Button>
//         <Button
//           type="reset"
//           variant="outlined"
//           onClose={onClose}
//           color="secondary"
//           onClick={HandleClose}
//         >
//           Cancel
//         </Button>
//       </Box>
//     </form>
//   );
// };

// export default ChangeValidityModel;

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
        sx={{ mb: 2 }}
        {...register("description")}
      />
      <Box display="flex" gap={2}>
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
          variant="outlined"
          color="secondary"
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
