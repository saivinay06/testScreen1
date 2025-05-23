import React, { useEffect, useRef, useState } from "react";
import { gameConfig } from "../data";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

function Filter({ active }) {
  const dialogRef = useRef(null);
  const [currGame, setCurrGame] = useState();
  const [range, setRange] = useState([0, 150]);

  const [selectedGameTypes, setSelectedGameTypes] = useState([]);

  const handleType = (e) => {
    const { value, checked } = e.target;
    setSelectedGameTypes((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  useEffect(() => {
    if (active) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [active]);

  const selectedGames = gameConfig.filter((game) =>
    selectedGameTypes.includes(game.name)
  );

  const allModes = selectedGames
    .flatMap((game) => game.modes)
    .filter((mode, index, self) => self.indexOf(mode) === index);

  const allTiers = selectedGames
    .flatMap((game) => game.tiers)
    .filter((tier, index, self) => self.indexOf(tier) === index);

  console.log(range);

  return (
    <dialog
      ref={dialogRef}
      className="p-5 max-h-[50%] rounded-xl shadow-xl w-[30%]"
    >
      <div className="mb-5">
        <p>
          <strong>Game type</strong>
        </p>
        {gameConfig.map((each, i) => (
          <div key={i} className="flex gap-3 items-center">
            <input
              id={each.name}
              type="checkbox"
              name="gameType"
              value={each.name}
              onChange={handleType}
              checked={selectedGameTypes.includes(each.name)}
            />
            <label htmlFor={each.name}>{each.name}</label>
          </div>
        ))}
      </div>
      <div className="mb-5">
        <p>
          <strong>Game mode</strong>
        </p>
        {allModes?.map((each, i) => (
          <div key={i} className="flex gap-3 items-center">
            <input id={each} type="checkbox" name="gameMode" value={each} />
            <label htmlFor={each}>{each}</label>
          </div>
        ))}
      </div>
      <div className="mb-5">
        <p>
          <strong>Tier</strong>
        </p>
        {allTiers?.map((each, i) => (
          <div key={i} className="flex gap-3 items-center">
            <input id={each} type="checkbox" name="gameTier" value={each} />
            <label htmlFor={each}>{each}</label>
          </div>
        ))}
      </div>
      <div>
        <p>
          <strong>Entry fee</strong>
        </p>
        <div className="w-80 p-5">
          <Slider
            range
            min={0}
            max={100}
            defaultValue={range}
            onChange={setRange}
          />
          <div className="flex justify-between mt-2">
            <span>{range[0]}</span>
            <span>{range[1]}</span>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default Filter;
