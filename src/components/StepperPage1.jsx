import React from "react";

function StepperPage1({
  handleGameChange,
  gameConfig,
  interaction,
  setInteraction,
}) {
  return (
    <div className="flex justify-between gap-12">
      <div className="flex flex-col gap-12">
        <div className="flex items-center justify-between gap-10 w-72">
          {/* <p className="font-medium">Game type :</p> */}
          <select
            onChange={handleGameChange}
            className="w-72 border border-stone-600 p-2 rounded-lg"
          >
            <option value="">Game type</option>
            {gameConfig.map((obj, i) => (
              <option key={i} value={obj.name}>
                {obj.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between gap-10 w-72">
          {/* <p className="font-medium">Game mode :</p> */}
          <select
            className="w-72 border border-stone-600 p-2 rounded-lg"
            onChange={(e) =>
              setInteraction((prev) => ({ ...prev, mode: e.target.value }))
            }
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
        <div className="flex items-center justify-between gap-10 w-72">
          {/* <p className="font-medium">Tier :</p> */}
          <select
            className="w-72 border border-stone-600 p-2 rounded-lg"
            onChange={(e) =>
              setInteraction((prev) => ({ ...prev, tier: e.target.value }))
            }
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
      <div className="flex flex-col gap-12">
        <div>
          <input
            type="number"
            placeholder="Min wait time (seconds)"
            name="minWaitTime"
            className="ml-2 w-72 p-2 pl-1 border border-stone-500 rounded-md focus:outline-none"
            onChange={(e) =>
              setInteraction((prev) => ({
                ...prev,
                minWaitTime: e.target.value,
              }))
            }
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Max wait time (seconds)"
            name="maxWaitTime"
            className="ml-2 w-72 p-2 pl-1 border border-stone-500 rounded-md focus:outline-none"
            onChange={(e) =>
              setInteraction((prev) => ({
                ...prev,
                maxWaitTime: e.target.value,
              }))
            }
          />
        </div>
      </div>
    </div>
  );
}

export default StepperPage1;
