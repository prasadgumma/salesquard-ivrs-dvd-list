import React from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";

const ColumnVisibilityToggle = ({
  columns,
  columnVisibilityModel,
  onVisibilityChange,
}) => {
  const handleToggle = (field) => {
    // Update the visibility model by toggling the selected column's visibility.
    const newModel = {
      ...columnVisibilityModel,
      [field]: !columnVisibilityModel[field],
    };
    onVisibilityChange(newModel);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Column Visibility Options
      </Typography>
      <FormGroup>
        {columns.map((col) => (
          <FormControlLabel
            key={col.field}
            control={
              <Checkbox
                checked={columnVisibilityModel[col.field]}
                onChange={() => handleToggle(col.field)}
              />
            }
            label={col.headerName}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default ColumnVisibilityToggle;
