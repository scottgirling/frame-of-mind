import { Avatar as MuiAvatar } from "@mui/material";

export default function Avatar({ sx, avatarUrl, displayName, ...props }) {
  return (
    <MuiAvatar
      {...props}
      sx={{
        ...sx,
        border: 2,
        borderColor: "primary.emphasis",
        bgcolor: "primary.light",
        color: "primary.main",
      }}
      src={avatarUrl || undefined}
    >
      {!avatarUrl && displayName?.charAt(0).toUpperCase()}
    </MuiAvatar>
  );
}
