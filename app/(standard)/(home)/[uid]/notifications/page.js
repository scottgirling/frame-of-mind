"use client";

import { useSearchParams } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { Box, Typography } from "@mui/material";
import {
  CheckCircle,
  FireSimple,
  HandWaving,
  Heart,
} from "@phosphor-icons/react";
import { ChatCircle, FilePlus } from "@phosphor-icons/react/dist/ssr";
import PaperBox from "@/app/components/PaperBox";

export default function NotificationsPage() {
  const searchParams = useSearchParams();
  const user_id = searchParams.get("user_id");
  const [authUser, loading, error] = useAuthState(auth);

  // Loading state:
  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error.message}</Typography>;
  }

  if (!authUser) {
    return (
      <Typography>You need to be logged in to view notifications.</Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        {authUser.displayName}'s notifications:
      </Typography>
      <PaperBox
        colour="light"
        variant="main"
        sx={{
          py: 2,
          m: 3,
          borderRadius: "12px",
        }}
      >
        <Box sx={{ m: 3, borderBottom: "1px solid grey", paddingBottom: 2 }}>
          <Typography
            sx={{
              backgroundColor: "#A0C878",
              border: "1px solid #A0C878",
              borderRadius: "12px",
              padding: 0.5,
              width: "max-content",
              marginBottom: 1,
            }}
          >
            Community
          </Typography>
          <Typography>
            <ChatCircle size={24} /> Thomai mentioned you in a panel comment
          </Typography>
          <Typography
            sx={{ fontSize: ".75rem", fontStyle: "italic", marginTop: 1 }}
          >
            VIEW
          </Typography>
          <Typography sx={{ fontSize: ".75rem", textAlign: "right" }}>
            12/03/22 - 09:27am
          </Typography>
        </Box>

        <Box sx={{ m: 3, borderBottom: "1px solid grey", paddingBottom: 2 }}>
          <Typography
            sx={{
              backgroundColor: "#7AB2D3",
              border: "1px solid #7AB2D3",
              borderRadius: "12px",
              padding: 0.5,
              width: "max-content",
              marginBottom: 1,
            }}
          >
            Create
          </Typography>

          <Typography>
            <CheckCircle size={24} /> The Growth comic you have contributed to
            has been finished by Holly!
          </Typography>
          <Typography
            sx={{ fontSize: ".75rem", fontStyle: "italic", marginTop: 1 }}
          >
            VIEW
          </Typography>
          <Typography
            sx={{ fontSize: ".75rem", position: "right", textAlign: "right" }}
          >
            11/03/22 - 16:17pm
          </Typography>
        </Box>

        <Box sx={{ m: 3, borderBottom: "1px solid grey", paddingBottom: 2 }}>
          <Typography
            sx={{
              backgroundColor: "#FFAB5B",
              border: "1px solid #FFAB5B",
              borderRadius: "12px",
              padding: 0.5,
              width: "max-content",
              marginBottom: 1,
            }}
          >
            Streak
          </Typography>
          <Typography>
            <FireSimple size={24} /> Your 4 day streak is on fire - don't stop
            drawing!
          </Typography>
          <Typography
            sx={{ fontSize: ".75rem", fontStyle: "italic", marginTop: 1 }}
          >
            VIEW
          </Typography>
          <Typography sx={{ fontSize: ".75rem", textAlign: "right" }}>
            11/03/22 - 14:25pm
          </Typography>
        </Box>

        <Box sx={{ m: 3, borderBottom: "1px solid grey", paddingBottom: 2 }}>
          <Typography
            sx={{
              backgroundColor: "#A0C878",
              border: "1px solid #A0C878",
              borderRadius: "12px",
              padding: 0.5,
              width: "max-content",
              marginBottom: 1,
            }}
          >
            Community
          </Typography>
          <Typography>
            <Heart size={24} /> Scott has liked your comic panel!
          </Typography>
          <Typography
            sx={{ fontSize: ".75rem", fontStyle: "italic", marginTop: 1 }}
          >
            VIEW
          </Typography>
          <Typography sx={{ fontSize: ".75rem", textAlign: "right" }}>
            11/03/22 - 10:41am
          </Typography>
        </Box>

        <Box sx={{ m: 3, borderBottom: "1px solid grey", paddingBottom: 2 }}>
          <Typography
            sx={{
              backgroundColor: "#7AB2D3",
              border: "1px solid #7AB2D3",
              borderRadius: "12px",
              padding: 0.5,
              width: "max-content",
              marginBottom: 1,
            }}
          >
            Create
          </Typography>
          <Typography>
            <FilePlus size={24} /> Harrie has added a panel to one of your
            comics{" "}
          </Typography>
          <Typography
            sx={{ fontSize: ".75rem", fontStyle: "italic", marginTop: 1 }}
          >
            VIEW
          </Typography>
          <Typography sx={{ fontSize: ".75rem", textAlign: "right" }}>
            11/03/22 - 12:13pm
          </Typography>
        </Box>

        <Box sx={{ m: 3, borderBottom: "1px solid grey", paddingBottom: 2 }}>
          <Typography
            sx={{
              backgroundColor: "#FAFFC5",
              border: "1px solid #FAFFC5",
              borderRadius: "12px",
              padding: 0.5,
              width: "max-content",
              marginBottom: 1,
            }}
          >
            Friend request
          </Typography>

          <Typography>
            <HandWaving size={24} /> Kyle has added you as a friend! Send a wave
          </Typography>
          <Typography
            sx={{ fontSize: ".75rem", fontStyle: "italic", marginTop: 1 }}
          >
            VIEW
          </Typography>
          <Typography sx={{ fontSize: ".75rem", textAlign: "right" }}>
            10/03/22 - 17:08pm
          </Typography>
        </Box>
      </PaperBox>
    </Box>
  );
}
