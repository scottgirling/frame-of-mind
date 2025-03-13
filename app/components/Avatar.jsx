import { Avatar as MuiAvatar } from "@mui/material";

export default function Avatar({ sx, avatarUrl, displayName, ...props }) {
  return ( avatarUrl ? <MuiAvatar
        {...props}
        sx={{
          ...sx,
          border: 2,
          borderColor: "primary.emphasis",
          bgcolor: "primary.light",
          color: "primary.main",
        }}
        src={avatarUrl}
      />
      :<MuiAvatar
        {...props}
        sx={{
          ...sx,
          border: 2,
          borderColor: "primary.emphasis",
          bgcolor: "primary.light",
          color: "primary.main",
        }}
      >{displayName && displayName[0].toUpperCase()}</MuiAvatar>
    
  );
}
