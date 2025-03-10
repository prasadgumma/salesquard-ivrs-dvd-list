// import React from "react";
// import PropTypes from "prop-types";
// import Box from "@mui/material/Box";
// import Select from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem";
// import IconButton from "@mui/material/IconButton";
// import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// const CustomPagination = ({
//   currentPage,
//   totalRows,
//   startIndex,
//   pageSize,
//   handlePageSizeChange,
//   handlePreviousPage,
//   handleNextPage,
//   totalPages,
// }) => {
//   return (
//     <Box
//       display="flex"
//       justifyContent="flex-end"
//       alignItems="center"
//       gap={3}
//       m={1.5}
//     >
//       {/* Page Size Selector */}
//       <Select
//         value={pageSize}
//         onChange={handlePageSizeChange}
//         size="medium"
//         variant="outlined"
//         sx={{ height: 35 }}
//       >
//         <MenuItem value={25}>25</MenuItem>
//         <MenuItem value={50}>50</MenuItem>
//         <MenuItem value={100}>100</MenuItem>
//         <MenuItem value="All">All</MenuItem>
//       </Select>

//       {/* Pagination Info */}
//       <Box sx={{ fontSize: 15 }}>
//         {pageSize === "All"
//           ? `1-${totalRows} of ${totalRows}` // Show all rows
//           : `${startIndex + 1}-${Math.min(
//               startIndex + pageSize,
//               totalRows
//             )} of ${totalRows}`}
//       </Box>

//       {/* Pagination Controls */}
//       {pageSize !== "All" && (
//         <Box>
//           <IconButton
//             onClick={handlePreviousPage}
//             disabled={currentPage === 1}
//             sx={{ padding: "4px", fontSize: "15px" }}
//           >
//             <ArrowBackIosIcon sx={{ fontSize: "12px" }} />
//           </IconButton>
//           <IconButton
//             onClick={handleNextPage}
//             disabled={currentPage === totalPages}
//             sx={{ padding: "4px", fontSize: "15px" }}
//           >
//             <ArrowForwardIosIcon sx={{ fontSize: "12px" }} />
//           </IconButton>
//         </Box>
//       )}
//     </Box>
//   );
// };

// // PropTypes validation
// CustomPagination.propTypes = {
//   currentPage: PropTypes.number.isRequired,
//   totalRows: PropTypes.number.isRequired,
//   startIndex: PropTypes.number.isRequired,
//   pageSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
//     .isRequired,
//   handlePageSizeChange: PropTypes.func.isRequired,
//   handlePreviousPage: PropTypes.func.isRequired,
//   handleNextPage: PropTypes.func.isRequired,
//   totalPages: PropTypes.number.isRequired,
// };

// CustomPagination.defaultProps = {
//   total: 0,
// };

// export default CustomPagination;

import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Typography } from "@mui/material";

const CustomPagination = ({
  currentPage,
  totalRows,
  startIndex,
  pageSize,
  handlePageSizeChange,
  handlePreviousPage,
  handleNextPage,
  totalPages,
}) => {
  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      alignItems="center"
      gap={3}
      m={1}
      sx={{
        backgroundColor: "#f7f7f7", // Light background for the entire pagination section
        borderRadius: "8px",
        padding: "10px",
      }}
    >
      {/* Page Size Selector */}
      <Box display={"flex"} gap={2}>
        <Typography
          variant="body2"
          sx={{ fontWeight: "600", color: "#555", mt: 1 }}
        >
          Items per page:
        </Typography>
        <Select
          value={pageSize}
          onChange={handlePageSizeChange}
          size="small"
          variant="outlined"
          sx={{
            height: 36,
            width: 80,
            borderRadius: "5px",
            borderColor: "#ddd",
            "&:hover": {
              borderColor: "#aaa",
            },
          }}
        >
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value="All">All</MenuItem>
        </Select>
      </Box>

      {/* Pagination Info */}
      <Box sx={{ fontSize: 17, color: "#333", fontWeight: "500" }}>
        {pageSize === "All"
          ? `1-${totalRows} of ${totalRows}` // Show all rows
          : `${startIndex + 1}-${Math.min(
              startIndex + pageSize,
              totalRows
            )} of ${totalRows}`}
      </Box>

      {/* Pagination Controls */}
      {pageSize !== "All" && (
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            sx={{
              padding: "8px",
              borderRadius: "4px",
              backgroundColor: currentPage === 1 ? "#f0f0f0" : "#007BFF",
              color: currentPage === 1 ? "#ccc" : "#fff",
              "&:hover": {
                backgroundColor: currentPage === 1 ? "#f0f0f0" : "#0056b3",
              },
            }}
          >
            <ArrowBackIosIcon sx={{ fontSize: "16px" }} />
          </IconButton>
          <IconButton
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            sx={{
              padding: "8px",
              borderRadius: "4px",
              backgroundColor:
                currentPage === totalPages ? "#f0f0f0" : "#007BFF",
              color: currentPage === totalPages ? "#ccc" : "#fff",
              "&:hover": {
                backgroundColor:
                  currentPage === totalPages ? "#f0f0f0" : "#0056b3",
              },
            }}
          >
            <ArrowForwardIosIcon sx={{ fontSize: "16px" }} />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

// PropTypes validation
CustomPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalRows: PropTypes.number.isRequired,
  startIndex: PropTypes.number.isRequired,
  pageSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  handlePageSizeChange: PropTypes.func.isRequired,
  handlePreviousPage: PropTypes.func.isRequired,
  handleNextPage: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired,
};

CustomPagination.defaultProps = {
  total: 0,
};

export default CustomPagination;
