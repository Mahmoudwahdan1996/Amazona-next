import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";

const Input = ({ name, variant, id, label, type, changeHandler, value , placeholder }) => {
  return (
    <ListItem>
      <TextField
        name={name}
        variant={variant}
        fullWidth
        id={id}
        label={label}
        inputProps={type}
        onChange={changeHandler}
        value={value}
        required
        placeholder={placeholder}
      ></TextField>
    </ListItem>
  );
};

export default Input;
