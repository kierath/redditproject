import React from "react";
import {useNavigate} from "react-router-dom";
import "./CategoryChips.css";

const categories = [
    {label: "Trending", path: "/"},
    {label: "News", path: "/r/news"},
    {label: "Gaming", path: "/r/gaming"},
    {label: "Sports", path: "/r/sports"},
    {label: "Technology", path: "/r/technology"},
    {label: "Funny", path: "/r/funny"},
    {label: "Movies", path: "/r/movies"},
    {label: "Music", path: "/r/music"},
    {label: "Food", path: "/r/food"},
    {label: "Art", path: "/r/art"},
    {label: "AskReddit", path: "/r/AskReddit"},
];

export const CategoryChips = () => {
    const navigate = useNavigate();

    return (
    <div className="category-chips">
      {categories.map((cat) => (
        <button
          key={cat.label}
          className="chip"
          onClick={() => navigate(cat.path)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};