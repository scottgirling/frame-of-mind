import { Avatar as MuiAvatar } from "@mui/material";

export default function Avatar({ sx }) {
  return (
    <MuiAvatar
      sx={{
        ...sx,
        border: 2,
        borderColor: "primary.emphasis",
        bgcolor: "primary.light",
        color: "primary.main",
      }}
    ></MuiAvatar>
  );
}
