import React, { useRef, useState } from "react";
import { FilterIcon, SortAsc, X } from "lucide-react";

const gameConfig = [
  {
    name: "Ludo",
    modes: ["Classic", "Tournament"],
    tiers: ["Bronze", "Silver", "Gold"],
  },
  {
    name: "Rummy",
    modes: ["Quick Match", "Points", "Pool"],
    tiers: ["Basic", "Pro", "Elite"],
  },
];

function GamePackage() {
  const dialogRef = useRef(null);

  const matchDialogRef = useRef(null);

  const [currGame, setCurrGame] = useState("");

  const handleAdd = () => {
    dialogRef.current?.showModal();
  };

  const handleClose = () => {
    dialogRef.current?.close();
  };

  const handleClick = (matchType) => {
    // dialogRef.current.close();
    if (matchType === "classic") {
      matchDialogRef.current?.showModal();
    }
  };

  const handlePackageClose = () => {
    matchDialogRef.current?.close();
  };

  const handleGameChange = (e) => {
    const findGameObj = gameConfig.find((each) => each.name === e.target.value);
    console.log(findGameObj);
    setCurrGame(findGameObj);
  };

  return (
    <div className="font-poppins h-screen w-full py-5 px-20">
      <div className="flex justify-end">
        <div className="flex items-center gap-8">
          <div className="inline-flex items-center gap-1 border border-stone-300 px-4 py-1 rounded-lg cursor-pointer">
            <FilterIcon size={20} />
            <p>Filter</p>
          </div>
          <div className="inline-flex items-center gap-1 border border-stone-300 px-4 py-1 rounded-lg cursor-pointer">
            <SortAsc />
            <p>Sort</p>
          </div>
        </div>
      </div>
      <h1 className="text-2xl mt-5 font-semibold">Current Packages</h1>
      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md my-2">
        <table className="table-auto w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-1 py-2">S.No</th>
              <th className="border border-gray-300 px-4 py-2">Game type</th>
              <th className="border border-gray-300 px-4 py-2">Game mode</th>
              <th className="border border-gray-300 px-4 py-2">Tier</th>
              <th className="border border-gray-300 px-4 py-2">Entry fee </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2">1</td>
              <td className="px-4 py-2">Ludo</td>
              <td className="px-4 py-2">classic</td>
              <td className="px-4 py-2">Gold</td>
              <td className="px-4 py-2">200</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="px-4 py-2">2</td>
              <td className="px-4 py-2">Rummy</td>
              <td className="px-4 py-2">Quick match</td>
              <td className="px-4 py-2">Bronze</td>
              <td className="px-4 py-2">100</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button
        className="border rounded-lg py-2 px-4 bg-blue-500 text-white"
        onClick={handleAdd}
      >
        Add new package
      </button>
      <dialog ref={dialogRef} className="w-[400px] rounded-xl p-2 shadow-xl">
        <div className="flex justify-end">
          <button className="" onClick={handleClose}>
            <X />
          </button>
        </div>
        <p className="mt-3 px-2">Which type of package do you want to add?</p>
        <div className="flex gap-5 mt-2 px-2 py-5">
          <button
            className="bg-blue-200 py-2 px-4 rounded-xl"
            onClick={() => handleClick("tournament")}
          >
            Tournament
          </button>
          <button
            className="bg-blue-200 py-2 px-4 rounded-xl"
            onClick={() => handleClick("classic")}
          >
            Classic game
          </button>
        </div>
      </dialog>
      <dialog
        ref={matchDialogRef}
        className="w-[40%] h-[50%] rounded-xl shadow-xl"
      >
        <div className="flex flex-col justify-between h-full p-5">
          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-xl">New package</h2>
              <button onClick={handlePackageClose}>
                <X />
              </button>
            </div>
            <div className="mt-5">
              <select
                onChange={handleGameChange}
                className="w-28 border border-stone-600 rounded-lg py-1"
              >
                <option value="">Game type</option>
                {gameConfig.map((obj, i) => (
                  <option key={i} value={obj.name}>
                    {obj.name}
                  </option>
                ))}
              </select>
              <select className="w-28 border border-stone-600 rounded-lg py-1">
                <option value="">Game mode</option>
                {currGame &&
                  currGame.modes.map((each, i) => (
                    <option key={i} value={each}>
                      {each}
                    </option>
                  ))}
              </select>
              <select className="w-28 border border-stone-600 rounded-lg py-1">
                <option value="">Tier</option>
                {currGame &&
                  currGame.tiers.map((each, i) => (
                    <option key={i} value={each}>
                      {each}
                    </option>
                  ))}
              </select>
              <input type="date" />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button className="border border-blue-200 px-6 py-2 rounded-xl">
              Cancel
            </button>
            <button className="bg-blue-200 px-6 py-2 rounded-xl">Next</button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default GamePackage;
