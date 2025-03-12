"use client";
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  FormControl,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
export function FilterBar({ onFilterChange, userId }) {
  const [filters, setFilters] = useState({
    sortBy: "completedAt",
    showMyComics: false,
    comicType: "all",
  });
  const handleSortChange = (event) => {
    const newFilters = {
      ...filters,
      sortBy: event.target.value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  //handles my comics toggle
  const handleMyComicsToggle = () => {
    const newFilters = {
      ...filters,
      showMyComics: !filters.showMyComics,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  //handles the type of the comic toggle
  const handleComicTypeToggle = (event, newValue) => {
    if (newValue !== null) {
      const newFilters = {
        ...filters,
        comicType: newValue,
      };
      setFilters(newFilters);
      onFilterChange(newFilters);
    }
  };
  return (
    <AppBar
      position="static"
      sx={{ bgcolor: "light.main" }}
      variant="contained"
    >
      <Toolbar sx={{ gap: 2, display: "flex", flexWrap: "wrap" }}>
        <FormControl sx={{ minWidth: 180 }}>
          <Select
            value={filters.sortBy}
            onChange={handleSortChange}
            displayEmpty
            variant="standard"
          >
            <MenuItem value="completedAt">Most Recent</MenuItem>
            <MenuItem value="likes">Most Liked</MenuItem>
            <MenuItem value="theme">Theme (A-Z)</MenuItem>
          </Select>
        </FormControl>
        {userId && (
          <ToggleButton
            value="myComics"
            selected={filters.showMyComics}
            onChange={handleMyComicsToggle}
            sx={{ mx: 1 }}
          >
            My Comics
          </ToggleButton>
        )}
        <ToggleButtonGroup
          value={filters.comicType}
          exclusive
          onChange={handleComicTypeToggle}
          aria-label="comic type"
        >
         
          <ToggleButton value="solo" aria-label="show solo comics">
            Solo
          </ToggleButton>
          <ToggleButton value="team" aria-label="show team comics">
            Team
          </ToggleButton>
          <ToggleButton value="all" aria-label="show all comics">
            All
          </ToggleButton>
        </ToggleButtonGroup>
      </Toolbar>
    </AppBar>
  );
}
