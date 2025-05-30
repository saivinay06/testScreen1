import React, { useEffect, useState } from "react";

function StepperPage1({
  handleGameChange,
  gameConfig,
  interaction,
  setInteraction,
}) {
  return (
    <div className="flex flex-col justify-between gap-16">
      <div className="flex justify-between gap-3">
        <div className="flex justify-center items-center w-52 border border-[#464646] px-3 bg-[#0F0F13] h-14 rounded-2xl">
          {/* <p className="font-medium">Game type :</p> */}
          <select
            onChange={handleGameChange}
            className="w-full h-full cursor-pointer bg-transparent text-[#464646] rounded-lg font-bold text-sm outline-none"
            value={interaction.currGame?.name || ""}
          >
            <option value="">Game type</option>
            {gameConfig.map((obj, i) => (
              <option key={i} value={obj.name}>
                {obj.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-5 items-center h-15">
          <div className="flex justify-center items-center w-48 border border-[#464646] px-3 bg-[#0F0F13] h-14 rounded-2xl">
            {/* <p className="font-medium">Game mode :</p> */}
            <select
              className="w-full h-full cursor-pointer bg-transparent text-[#464646] rounded-lg font-bold text-sm outline-none"
              onChange={(e) =>
                setInteraction((prev) => ({ ...prev, mode: e.target.value }))
              }
              value={interaction.mode || ""}
            >
              <option value="">Game mode</option>
              {interaction.currGame &&
                interaction.currGame.modes.map((each, i) => (
                  <option key={i} value={each}>
                    {each}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex justify-center items-center w-48 border border-[#464646] px-3 bg-[#0F0F13] h-14 rounded-2xl">
            {/* <p className="font-medium">Tier :</p> */}
            <select
              className="w-full h-full cursor-pointer bg-transparent text-[#464646] rounded-lg font-bold text-sm outline-none"
              onChange={(e) =>
                setInteraction((prev) => ({ ...prev, tier: e.target.value }))
              }
              value={interaction.tier || ""}
            >
              <option value="">Tier</option>
              {interaction.currGame &&
                interaction.currGame.tiers.map((each, i) => (
                  <option key={i} value={each}>
                    {each}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-12">
        <div className="w-[50%] border border-[#464646] bg-[#0F0F13] p-4 rounded-2xl">
          <input
            type="number"
            placeholder="Min wait time (seconds)"
            name="minWaitTime"
            className="w-full h-full bg-transparent text-[#ffffff] rounded-lg font-bold text-sm focus:outline-none"
            onChange={(e) =>
              setInteraction((prev) => ({
                ...prev,
                minWaitTime: e.target.value,
              }))
            }
            value={interaction.minWaitTime}
          />
        </div>
        <div className="w-[50%] border border-[#464646] bg-[#0F0F13] p-4 rounded-2xl">
          <input
            type="number"
            placeholder="Max wait time (seconds)"
            name="maxWaitTime"
            className="w-full h-full bg-transparent text-white rounded-lg font-bold text-sm focus:outline-none"
            onChange={(e) =>
              setInteraction((prev) => ({
                ...prev,
                maxWaitTime: e.target.value,
              }))
            }
            value={interaction.maxWaitTime}
          />
        </div>
      </div>
    </div>
  );
}

export default StepperPage1;
