import {
  Avatar,
  Box,
  Grid2 as Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { Check } from "@phosphor-icons/react";
import { FireSimple } from "@phosphor-icons/react/dist/ssr";

export default function DayStreak({ dayStreak, weekStreak }) {
  const daysArray = ["M", "T", "W", "Th", "F", "Sa", "Su"];
  const theme = useTheme();
  return (
    <>
      <Grid container spacing={0} columns={7} sx={{ textAlign: "center" }}>
        {daysArray.map((day, i) => {
          return (
            <Grid key={day} size={1}>
              <Typography
                color="primary.main"
                sx={{
                  transform: `rotate(${(i % 2 ? 5 : -5) + (i % 2)}deg)`,
                }}
              >
                {i + 1}
              </Typography>
            </Grid>
          );
        })}
        {daysArray.map((day, i) => {
          const colour = i < dayStreak ? "green.main" : "primary.light";
          const textColour = i < dayStreak ? "green.light" : "primary.medium";
          if (i < 6) {
            return (
              <Grid
                key={day}
                size={1}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: colour,
                    height: 40,
                    width: 40,
                    color: textColour,
                    mt: 1,
                    transform: `rotate(${(i % 2 ? 3 : -3) + (i % 2)}deg)`,
                  }}
                >
                  <Check weight="bold" />
                </Avatar>
              </Grid>
            );
          } else {
            return (
              <Grid
                key={day}
                size={1}
                sx={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FireSimple
                  weight="fill"
                  style={{
                    fontSize: 60,
                    display: "block",
                    color: theme.palette.primary.light,
                    transform: `rotate(5deg)`,
                  }}
                />
                <Typography
                  sx={{
                    position: "absolute",
                    color: textColour,
                    mt: 1,
                    transform: `rotate(-5deg)`,
                  }}
                >
                  {weekStreak + 1}
                </Typography>
              </Grid>
            );
          }
        })}
      </Grid>
    </>
  );
}
