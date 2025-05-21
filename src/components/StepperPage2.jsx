import React, { useState } from "react";
import { dummyPrizepools } from "../data";

function StepperPage2({
  interaction,
  setInteraction,
  handleEntryFee,
  prizeData,
  setPrizeData,
  handleRowChange,
  handleAddRow,
  totalAmount,
  amountRemaining,
  packageRows,
  gameTypePrizepool,
}) {
  const [selectedPrizepool, setSelectedPrizepool] = useState(null);

  const handlePrizepool = (e) => {
    const prizepoolId = e.target.value;
    console.log(prizepoolId);
    console.log(packageRows);

    const findPackage = packageRows.find(
      (each) => each.prizepool === prizepoolId
    );

    console.log(findPackage);

    const { entryFee, players, prizepool } = findPackage;

    const prize = dummyPrizepools.find((each) => each.id === prizepoolId);

    setPrizeData(prize.prizeData);
    setSelectedPrizepool(findPackage);

    setInteraction((prev) => ({
      ...prev,
      entryFee,
      playersCount: players,
    }));
  };

  const handleAddNewRow = () => {
    if (amountRemaining > 0) {
      setPrizeData((prev) => [...prev, { min: "", max: "", amount: "" }]);

      setSelectedPrizepool((prev) => {
        if (!prev) return null;
        const updatedPrizepool = { ...prev };
        updatedPrizepool.prizepool.prizeData = [
          ...updatedPrizepool.prizepool.prizeData,
          { min: "", max: "", amount: "" },
        ];
        return updatedPrizepool;
      });
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <select
          className="w-44 border border-stone-500 p-2 rounded-lg"
          onChange={handlePrizepool}
        >
          <option value="" selected>
            Existing prizepools
          </option>
          {gameTypePrizepool.map((each, i) => (
            <option key={each.prizepool} value={each.prizepool}>{`Prizepool ${
              i + 1
            }`}</option>
          ))}
        </select>
        <div className="flex items-center gap-5">
          <div className="flex items-center justify-between gap-10">
            <select
              className="ml-2 w-32 p-2 text-sm pl-1 border border-stone-500 rounded-md focus:outline-none"
              value={interaction.playersCount}
              onChange={(e) =>
                setInteraction((prev) => ({
                  ...prev,
                  playersCount: parseInt(e.target.value),
                }))
              }
            >
              <option value="">Player count</option>
              {interaction.currGame &&
                interaction.currGame.playerCount.map((each, i) => (
                  <option key={i} value={each}>
                    {each}P
                  </option>
                ))}
            </select>
          </div>
          <div>
            {/* <label>Entry fee</label> */}
            <input
              placeholder="Entry fee"
              type="number"
              min="0"
              className="ml-2 w-32 p-2 text-sm pl-1 border border-stone-500 rounded-md focus:outline-none"
              onChange={handleEntryFee}
              defaultValue={selectedPrizepool && selectedPrizepool.entryFee}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-10 mb-2">
        <h5 className="font-semibold text-lg">Prizepool</h5>
        {interaction.errorText && (
          <p className="text-red-500 text-sm">* {interaction.errorText}</p>
        )}
      </div>

      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <table className="table-auto w-full" style={{ tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th
                className="border px-4 py-2 text-gray-800 font-medium"
                colSpan="2"
              >
                Positions
              </th>
              <th className="border border-b-white px-4 py-2 text-gray-800 font-medium">
                Amount
              </th>
            </tr>
            <tr>
              <th className="border px-4 py-2 text-gray-800 font-medium">
                Minimum
              </th>
              <th className="border px-4 py-2 text-gray-800 font-medium">
                Maximum
              </th>
              <th className="border px-4 py-2 text-gray-800 font-medium">
                (Rupee)
              </th>
            </tr>
          </thead>
          <tbody>
            {prizeData.map((row, i) => (
              <tr key={i}>
                <td className="border px-2 py-1">
                  <input
                    className="h-10 w-full focus:outline-none text-center"
                    type="number"
                    min="1"
                    value={row.min}
                    onChange={(e) => handleRowChange(i, "min", e.target.value)}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    className="h-10 w-full focus:outline-none text-center"
                    type="number"
                    min="1"
                    value={row.max}
                    onChange={(e) => handleRowChange(i, "max", e.target.value)}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    className="h-10 w-full focus:outline-none text-center"
                    type="number"
                    min="1"
                    value={row.amount}
                    onChange={(e) =>
                      handleRowChange(i, "amount", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between my-3">
        <button
          className="rounded-lg py-2 px-4 bg-black text-white text-sm"
          onClick={handleAddNewRow}
        >
          Add row
        </button>
        <div className="flex gap-5">
          <p>
            Total: <span>{totalAmount}</span>
          </p>
          <p>
            Remaining: <span>{amountRemaining}</span>
          </p>
        </div>
      </div>
    </>
  );
}

export default StepperPage2;
