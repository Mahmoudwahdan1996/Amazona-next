import React from "react";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

const TotalCard = ({ Price, handler, textone, texttwo, val, textButton }) => {
  return (
    <Card>
      <List>
        <ListItem>
          <Grid container>
            <Grid item xs={6}>
              <Typography>{textone}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>${Price}</Typography>
            </Grid>
          </Grid>
        </ListItem>
        <ListItem>
          <Grid container>
            <Grid item xs={6}>
              <Typography>{texttwo}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>{val}</Typography>
            </Grid>
          </Grid>
        </ListItem>
        <ListItem>
          <Button fullWidth variant="contained" onClick={handler}>
            {textButton}
          </Button>
        </ListItem>
      </List>
    </Card>
  );
};

export default TotalCard;
