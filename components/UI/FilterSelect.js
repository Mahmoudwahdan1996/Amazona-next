import classes from "../../utility/classes";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import ListItem from "@mui/material/ListItem";
import MenuItem from "@mui/material/MenuItem";

const FilterSelect = ({ text, value, changeHandler, items }) => {
  const desplayMenuItems = () => {
    if (text === "Prices") {
      return items.map((item) => (
        <MenuItem key={item.value} value={item.value}>
          {item.name}
        </MenuItem>
      ));
    } else {
      return (
        items &&
        items.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))
      );
    }
  };
  return (
    <ListItem>
      <Box sx={classes.fullWidth}>
        <Typography>{text}</Typography>
        <Select value={value} onChange={changeHandler} fullWidth>
          <MenuItem value="all">All</MenuItem>
          {desplayMenuItems()}
        </Select>
      </Box>
    </ListItem>
  );
};

export default FilterSelect;
