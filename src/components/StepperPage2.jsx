import React, { useState } from "react";
import { Trash, User, Users } from "lucide-react";

function StepperPage2({
  interaction,
  setInteraction,
  handleEntryFee,
  prizeData,
  setPrizeData,
  handleRowChange,
  totalAmount,
  amountRemaining,
  packageRows,
  gameTypePrizepool,
  setSelectedPrizepoolId,
  dummyPrizes,
  activePrizepoolId,
}) {
  const [isDisabled, setIsDisabled] = useState(false);

  const [selectedPrizepool, setSelectedPrizepool] = useState(null);

  const handlePrizepool = (e) => {
    setIsDisabled(true);

    const prizepoolId = e.target.value;

    if (prizepoolId === "Custom") {
      setSelectedPrizepool(null);
      setPrizeData([{ min: 0, max: 1, amount: 0, isMultiple: false }]);
      setInteraction((prev) => ({
        ...prev,
        playersCount: "",
        entryFee: "",
      }));
      return;
    }

    const findPackage = packageRows.find(
      (each) => each.prizepool === prizepoolId
    );

    setSelectedPrizepoolId(findPackage.prizepool);

    const { entryFee, players, prizepool } = findPackage;

    const prize = dummyPrizes.find((each) => each.id === prizepoolId);

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
      setPrizeData((prev) => [
        ...prev,
        { min: 0, max: 0, amount: 0, isMultiple: false },
      ]);
    }
  };

  const toggleSwitch = (index) => {
    setPrizeData((prev) => {
      return prev.map((row, i) =>
        i === index ? { ...row, isMultiple: !row.isMultiple } : row
      );
    });
  };

  const handleDeleteRow = (index) => {
    setPrizeData((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center w-50 border border-[#464646] px-3 bg-[#0F0F13] h-14 rounded-2xl">
          <select
            className="w-full h-full cursor-pointer bg-transparent text-[#464646] font-bold rounded-lg text-sm outline-none"
            onChange={handlePrizepool}
            value={selectedPrizepool?.prizepool || activePrizepoolId}
          >
            <option value="" disabled={isDisabled}>
              Existing prizepools
            </option>
            {gameTypePrizepool.map((each, i) => (
              <option key={i} value={each.prizepool}>
                {each.prizepool}
              </option>
            ))}
            <option>Custom</option>
          </select>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex justify-center items-center w-50 border border-[#464646] px-3 bg-[#0F0F13] h-14 rounded-2xl">
            <select
              className="w-full h-full cursor-pointer bg-transparent text-[#464646] rounded-lg font-bold text-sm outline-none"
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
          <div className="flex justify-center items-center w-48 border border-[#464646] px-3 bg-[#0F0F13] h-14 rounded-2xl">
            {/* <label>Entry fee</label> */}
            <input
              placeholder="Entry fee"
              type="number"
              min="0"
              className="w-full h-full cursor-pointer bg-transparent text-[#464646] rounded-lg font-bold text-sm outline-none"
              onChange={handleEntryFee}
              value={interaction.entryFee}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-10 mb-3">
        <h5 className="font-semibold text-lg text-[#ffffff]">Prizepool</h5>
      </div>

      <div className="border border-[#464646] rounded-2xl custom-scrollbar overflow-x-hidden overflow-y-scroll max-h-56 ">
        <table
          className="table-auto border-none min-w-[500px] w-full"
          style={{ tableLayout: "fixed" }}
        >
          <thead>
            <tr>
              <th
                className="px-4 py-5 border-r border-r-[#464646] text-[#ffffff] font-extralight"
                colSpan={2}
              >
                Positions
              </th>
              <th className="px-4 py-5 border-r border-r-[#464646] text-[#ffffff] font-extralight">
                Amount
              </th>
              <th className="text-[#ffffff] font-extralight w-[40px]"></th>
            </tr>
          </thead>
          <tbody>
            {prizeData.map((row, i) => (
              <tr key={i} className="group">
                {!row.isMultiple ? (
                  <td className="border border-[#464646] px-2 py-3" colSpan={2}>
                    <div className="relative flex items-center justify-between">
                      <input
                        className="h-10 w-full focus:outline-none text-center bg-transparent text-white"
                        type="number"
                        min="1"
                        value={row.max || ""}
                        onChange={(e) =>
                          handleRowChange(i, "max", e.target.value)
                        }
                      />

                      <div className="absolute right-1 flex items-center gap-4 mr-1">
                        <button
                          onClick={() => toggleSwitch(i)}
                          className={`relative w-16 h-7 flex items-center justify-between rounded-full transition-colors duration-300 ${
                            prizeData[i].isMultiple
                              ? "bg-[#1E1E24]"
                              : "bg-[#1E1E24]"
                          }`}
                        >
                          <div
                            className={`flex items-center justify-center w-[2.2rem] h-full rounded-full shadow-md transform duration-300 bg-[#DAFD24] z-10" ${
                              prizeData[i].isMultiple
                                ? "translate-x-8"
                                : "translate-x-0"
                            }`}
                          ></div>
                          <User
                            size={18}
                            className={`absolute left-[9px]`}
                            style={
                              prizeData[i].isMultiple
                                ? { color: "#A1A1A1" }
                                : { color: "black" }
                            }
                          />
                          <Users
                            size={18}
                            className="absolute right-1"
                            style={
                              prizeData[i].isMultiple
                                ? { color: "black" }
                                : { color: "#A1A1A1" }
                            }
                          />
                        </button>
                      </div>
                    </div>
                  </td>
                ) : (
                  <>
                    <td className="border border-[#464646] px-2 py-3">
                      <input
                        className="h-10 w-full focus:outline-none text-center text-white bg-transparent"
                        type="number"
                        min="1"
                        value={row.min || ""}
                        onChange={(e) =>
                          handleRowChange(i, "min", e.target.value)
                        }
                      />
                    </td>
                    <td className="relative border border-[#464646] px-2 py-3 flex items-center justify-between">
                      <input
                        className="h-10 w-full focus:outline-none text-center text-white bg-transparent"
                        type="number"
                        min="1"
                        value={row.max || ""}
                        onChange={(e) =>
                          handleRowChange(i, "max", e.target.value)
                        }
                      />

                      <div className="absolute right-1 flex items-center gap-4 mr-1">
                        <button
                          onClick={() => toggleSwitch(i)}
                          className={`relative w-16 h-7 flex items-center justify-between rounded-full transition-colors duration-300 ${
                            prizeData[i].isMultiple
                              ? "bg-[#1E1E24]"
                              : "bg-[#1E1E24]"
                          }`}
                        >
                          <div
                            className={`flex items-center justify-center w-[2.2rem] h-full rounded-full shadow-md transform duration-300 bg-[#DAFD24] z-10" ${
                              prizeData[i].isMultiple
                                ? "translate-x-8"
                                : "translate-x-0"
                            }`}
                          ></div>
                          <User
                            size={18}
                            className={`absolute left-[9px]`}
                            style={
                              prizeData[i].isMultiple
                                ? { color: "#A1A1A1" }
                                : { color: "black" }
                            }
                          />
                          <Users
                            size={18}
                            className="absolute right-1"
                            style={
                              prizeData[i].isMultiple
                                ? { color: "black" }
                                : { color: "#A1A1A1" }
                            }
                          />
                        </button>
                      </div>
                    </td>
                  </>
                )}
                <td className="border border-[#464646] px-2 py-1">
                  <input
                    className="h-10 w-full focus:outline-none text-center bg-transparent text-white"
                    type="number"
                    min="1"
                    value={row.amount || ""}
                    onChange={(e) =>
                      handleRowChange(i, "amount", e.target.value)
                    }
                  />
                </td>
                <td className="border border-[#464646] px-2 py-1 text-center">
                  <button
                    onClick={() => handleDeleteRow(i)}
                    className="opacity-0 group-hover:opacity-100 transition-all ease duration-300"
                    title="Delete Row"
                  >
                    <Trash className="text-white" size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mt-3">
        <button
          className="rounded-2xl py-3 px-4 bg-[#1E1E24] text-white text-[13px]"
          onClick={handleAddNewRow}
        >
          Add row
        </button>
        <div className="flex gap-5 text-sm text-white">
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
