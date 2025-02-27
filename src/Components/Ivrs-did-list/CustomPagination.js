// import React from "react";
// import PropTypes from "prop-types"; // Import PropTypes for validation
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
//   total,
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

// // Define PropTypes for validation
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
//   total: PropTypes.number,
// };

// // Set default values for optional props
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
      m={1.5}
    >
      {/* Page Size Selector */}
      <Select
        value={pageSize}
        onChange={handlePageSizeChange}
        size="medium"
        variant="outlined"
        sx={{ height: 35 }}
      >
        <MenuItem value={25}>25</MenuItem>
        <MenuItem value={50}>50</MenuItem>
        <MenuItem value={100}>100</MenuItem>
        <MenuItem value="All">All</MenuItem>
      </Select>

      {/* Pagination Info */}
      <Box sx={{ fontSize: 15 }}>
        {pageSize === "All"
          ? `1-${totalRows} of ${totalRows}` // Show all rows
          : `${startIndex + 1}-${Math.min(
              startIndex + pageSize,
              totalRows
            )} of ${totalRows}`}
      </Box>

      {/* Pagination Controls */}
      {pageSize !== "All" && (
        <Box>
          <IconButton
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            sx={{ padding: "4px", fontSize: "15px" }}
          >
            <ArrowBackIosIcon sx={{ fontSize: "12px" }} />
          </IconButton>
          <IconButton
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            sx={{ padding: "4px", fontSize: "15px" }}
          >
            <ArrowForwardIosIcon sx={{ fontSize: "12px" }} />
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
