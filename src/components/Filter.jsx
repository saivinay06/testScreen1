import React, { useEffect, useRef, useState } from "react";
import { gameConfig } from "../data";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

function Filter({
  setShowBubble,
  handleFilterClick,
  activeFilter,
  filterType,
  handleCheckbox,
  selectedFilterBoxes,
  currActiveGame,
  packageKey,
}) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-10"
      onMouseLeave={() => setShowBubble(false)}
    >
      <div className="w-0 h-0 mx-auto border-l-8 border-r-8 border-b-8 border-transparent border-b-[#39393c]"></div>

      <div className="bg-[#1C1C1C] rounded-lg shadow-md text-sm w-72 flex justify-between relative">
        <div className="flex flex-col justify-between w-[50%] bg-[#292929] rounded-md text-sm">
          <button
            className={`w-full py-4 px-4 text-left transition-all ease duration-200  ${
              activeFilter === "gameType" ? "bg-[#1E1E24] font-semibold" : ""
            } `}
            onClick={() => handleFilterClick("name", "gameType")}
          >
            Game type
          </button>
          <button
            className={`w-full py-4 px-4 text-left transition-all ease duration-200  rounded-md ${
              activeFilter === "gameMode" ? "bg-[#1E1E24] font-semibold" : ""
            } `}
            onClick={() => handleFilterClick("modes", "gameMode")}
          >
            Game mode
          </button>
          <button
            className={`w-full py-4 px-4 text-left transition-all ease duration-200  rounded-md ${
              activeFilter === "tier" ? "bg-[#1E1E24] font-semibold" : ""
            } `}
            onClick={() => handleFilterClick("tiers", "tier")}
          >
            Tier
          </button>
          <button
            className={`w-full py-4 px-4 text-left transition-all ease duration-200  rounded-md ${
              activeFilter === "players" ? "bg-[#1E1E24] font-semibold" : ""
            } `}
            onClick={() => handleFilterClick("playerCount", "players")}
          >
            Player count
          </button>
        </div>
        {/* <div className="w-px h-40 bg-black" /> */}
        <div className="w-[50%] p-5 flex flex-col gap-3">
          {filterType &&
            filterType.map((each) => (
              <div className="flex items-center gap-2 custom-checkbox">
                <input
                  type="checkbox"
                  checked={selectedFilterBoxes.includes(each)}
                  onChange={(e) => handleCheckbox(each, e)}
                  value={each}
                  disabled={
                    currActiveGame.length > 0 &&
                    packageKey &&
                    packageKey !== "name" &&
                    !currActiveGame.some((game) =>
                      game[packageKey].includes(each)
                    )
                  }
                  id={each}
                />
                <label
                  htmlFor={each}
                  className={`${
                    currActiveGame.length > 0 &&
                    packageKey &&
                    packageKey !== "name" &&
                    !currActiveGame.some((game) =>
                      game[packageKey].includes(each)
                    )
                      ? "opacity-50"
                      : ""
                  }`}
                  style={{
                    fontWeight: "lighter",
                    fontSize: "14px",
                  }}
                >
                  {each}
                </label>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Filter;
