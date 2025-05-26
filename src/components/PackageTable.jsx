import React, { useEffect, useRef, useState } from "react";
import { dummyPrizepools, gameConfig } from "../data";
import { User, Users } from "lucide-react";
import { IndianRupee, X } from "lucide-react";

function PackageTable({ data, setData, setPrizeData }) {
  const [currentClicked, setCurrentClicked] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [currGame, setCurrGame] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [amountRemaining, setAmountRemaining] = useState();
  const [totalAmount, setTotalAmount] = useState();
  const dialogRef = useRef(null);

  const handleRowClick = (id) => {
    setCurrentClicked(null);
    const resultObj = data.find((each) => each.id === id);
    console.log(resultObj);

    const getTableData = dummyPrizepools.find(
      (each) => each.id === resultObj.prizepool
    );
    console.log(getTableData);
    const currentGame = gameConfig.find(
      (each) => each.name === resultObj.gameType
    );

    setCurrGame(currentGame);
    setTableData(getTableData.prizeData);
    setCurrentClicked(resultObj);

    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const handleEdit = () => {
    setEditedData({ ...currentClicked });
    setIsEdit(true);
  };

  const handleSave = () => {
    const updated = data.map((item) =>
      item.id === editedData.id ? editedData : item
    );

    updated.prizepool = editedData.prizepool;

    console.log(editedData);

    setData(updated);
    setIsEdit(false);
    setCurrentClicked(editedData);
    setEditedData(null);
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...tableData];
    updated[index][field] = parseInt(value);

    const isGreater = parseInt(value) > parseInt(currentClicked.players);

    if (!(field === "amount") && isGreater) {
      // setUserInteraction((prev) => ({
      //   ...prev,
      //   errorText: `Prizepool positions cannot exceed number of players in game`,
      // }));
      setErrorText(
        "Prizepool positions cannot exceed number of players in game"
      );
      return;
    }

    if (
      field === "min" &&
      index > 0 &&
      Number(value) <= Number(tableData[index - 1].max)
    ) {
      // setUserInteraction((prev) => ({
      //   ...prev,
      //   errorText: "Min value must be greater than previous max",
      // }));
      setErrorText("Min value must be greater than previous max");
      return;
    }

    // setUserInteraction((prev) => ({ ...prev, errorText: "" }));
    setErrorText("");
    setTableData(updated);

    if (field === "amount") {
      calculateAmount();
    }
  };

  const calculateMinMax = (min, max, amount) => {
    if (isNaN(min) || isNaN(max) || isNaN(amount) || max < min) {
      return 0;
    }
    const positions = max - min + 1;
    return amount * positions;
  };

  const calculateAmount = () => {
    const updated = [...tableData];

    const usedAmount = updated.reduce(
      (sum, row) =>
        sum +
        calculateMinMax(
          parseFloat(row.min),
          parseFloat(row.max),
          parseFloat(row.amount)
        ),
      0
    );

    setAmountRemaining((totalAmount || 0) - usedAmount);
  };

  const handleClose = () => {
    dialogRef.current.close();
  };

  const handleEntryFee = (e) => {
    // setUserInteraction((prev) => ({ ...prev, errorText: "" }));
    setErrorText("");
    const entryFee = Number(e.target.value) || 0;

    // setUserInteraction((prev) => ({ ...prev, entryFee }));
    setEditedData((prev) => ({ ...prev, entryFee }));

    if (editedData.players) {
      setTotalAmount(editedData.entryFee * editedData.players);
    }
  };

  const handleAddNewRow = () => {
    if (amountRemaining > 0) {
      setTableData((prev) => [...prev, { min: "", max: "", amount: "" }]);

      // setSelectedPrizepool((prev) => {
      //   if (!prev) return null;
      //   const updatedPrizepool = { ...prev };
      //   updatedPrizepool.prizepool.prizeData = [
      //     ...updatedPrizepool.prizepool.prizeData,
      //     { min: "", max: "", amount: "" },
      //   ];
      //   return updatedPrizepool;
      // });
    }
  };

  const toggleSwitch = (index) => {
    setPrizeData((prev) => {
      return prev.map((row, i) =>
        i === index ? { ...row, isMultiple: !row.isMultiple } : row
      );
    });
  };

  return (
    <>
      <table className="table-auto w-full">
        <thead className="text-[#A9A9B7] text-[16px]">
          <tr>
            <th className="text-start pb-8">S.no</th>
            <th className="text-start pb-8">Game Type</th>
            <th className="text-start pb-8">Game Mode</th>
            <th className="text-start pb-8">Tier</th>
            <th className="text-end pb-8">Entry Fee </th>
          </tr>
        </thead>
        <tbody className="">
          {data.map((each, i) => (
            <tr
              key={each.id}
              onClick={() => handleRowClick(each.id)}
              className="hover:bg-slate-200 cursor-pointer text-center border-b border-b-gray-300/10 text-sm"
            >
              <td className="text-start pb-5">{each.id}</td>
              <td className="text-start text-[#A9A9B7] pb-5">
                {each.gameType}
              </td>
              <td className="text-start pb-5">{each.gameMode}</td>
              <td className="text-start text-[#A9A9B7] pb-5">{each.tier}</td>
              <td className="flex justify-end items-center pb-5">
                <IndianRupee size={15} />
                {each.entryFee}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {currentClicked && (
        <dialog
          ref={dialogRef}
          className="relative w-[50%] p-5 max-h-max rounded-xl shadow-xl bg-[#0F0F13]"
        >
          <div className="w-[55%] ml-auto flex justify-between items-center mb-6">
            <h1 className="text-center font-semibold text-2xl text-[#ffffff]">
              {currentClicked.gameType}
            </h1>
            <X onClick={handleClose} className="cursor-pointer text-white" />
          </div>

          <div className={`flex ${isEdit ? "justify-between" : "flex-col"}`}>
            <div className="">
              {isEdit ? (
                <div className="mb-3">
                  <select
                    className="w-72 border border-stone-600 p-2 rounded-lg"
                    defaultValue={currentClicked.gameMode}
                    onChange={(e) =>
                      setEditedData((prev) => ({
                        ...prev,
                        gameMode: e.target.value,
                      }))
                    }
                  >
                    <option value="">Game mode</option>
                    {currGame &&
                      currGame.modes.map((each, i) => (
                        <option key={i} value={each}>
                          {each}
                        </option>
                      ))}
                  </select>
                </div>
              ) : (
                <p className="mb-3 text-[#ffffffb6] text-sm">
                  <strong className="text-white text-base">Game mode: </strong>
                  {currentClicked.gameMode}
                </p>
              )}
              {isEdit ? (
                <div className="mb-3">
                  {/* <p className="font-medium">Tier :</p> */}
                  <select
                    className="w-72 border border-stone-600 p-2 rounded-lg"
                    defaultValue={currentClicked.tier}
                    onChange={(e) =>
                      setEditedData((prev) => ({
                        ...prev,
                        tier: e.target.value,
                      }))
                    }
                    // onChange={(e) =>
                    //   setInteraction((prev) => ({
                    //     ...prev,
                    //     tier: e.target.value,
                    //   }))
                    // }
                  >
                    <option value="">Tier</option>
                    {currGame &&
                      currGame.tiers.map((each, i) => (
                        <option key={i} value={each}>
                          {each}
                        </option>
                      ))}
                  </select>
                </div>
              ) : (
                <p className="mb-3 text-[#ffffffb6] text-sm">
                  <strong className="text-white text-base">Tier: </strong>
                  {currentClicked.tier}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              {isEdit ? (
                <input
                  type="number"
                  placeholder="Min wait time (seconds)"
                  name="minWaitTime"
                  className="ml-2 w-72 p-2 pl-1 border border-stone-500 rounded-md focus:outline-none mb-3"
                  defaultValue={currentClicked.minQue}
                  onChange={(e) =>
                    setEditedData((prev) => ({
                      ...prev,
                      minQue: e.target.value,
                    }))
                  }
                  // onChange={(e) =>
                  //   setInteraction((prev) => ({
                  //     ...prev,
                  //     minWaitTime: e.target.value,
                  //   }))
                  // }
                />
              ) : (
                <p className="mb-3 text-[#ffffffb6] text-sm">
                  <strong className="text-white text-base">
                    Minimum wait time:{" "}
                  </strong>
                  {currentClicked.minQue}
                </p>
              )}
              {isEdit ? (
                <input
                  type="number"
                  placeholder="Max wait time (seconds)"
                  name="maxWaitTime"
                  className="ml-2 w-72 p-2 pl-1 border border-stone-500 rounded-md focus:outline-none"
                  defaultValue={currentClicked.maxQue}
                  onChange={(e) =>
                    setEditedData((prev) => ({
                      ...prev,
                      maxQue: e.target.value,
                    }))
                  }
                  // onChange={(e) =>
                  //   setInteraction((prev) => ({
                  //     ...prev,
                  //     maxWaitTime: e.target.value,
                  //   }))
                  // }
                />
              ) : (
                <p className="mb-3 text-[#ffffffb6] text-sm">
                  <strong className="text-white text-base">
                    Maximum wait time:{" "}
                  </strong>
                  {currentClicked.maxQue}
                </p>
              )}
            </div>
          </div>
          <div className="my-5">
            <div className="flex items-center gap-5 justify-end">
              {isEdit ? (
                <select
                  className="ml-2 w-32 p-2 text-sm pl-1 border border-stone-500 rounded-md focus:outline-none"
                  defaultValue={currentClicked.players}
                  onChange={(e) =>
                    setEditedData((prev) => ({
                      ...prev,
                      players: e.target.value,
                    }))
                  }
                  // value={interaction.playersCount}
                  // onChange={(e) =>
                  //   setInteraction((prev) => ({
                  //     ...prev,
                  //     playersCount: parseInt(e.target.value),
                  //   }))
                  // }
                >
                  <option value="">Player count</option>
                  {currGame &&
                    currGame.playerCount.map((each, i) => (
                      <option key={i} value={each}>
                        {each}P
                      </option>
                    ))}
                </select>
              ) : (
                <p className="mb-3 text-[#ffffffb6] text-sm">
                  <strong className="text-white text-base">
                    Player count:{" "}
                  </strong>
                  {currentClicked.players}
                </p>
              )}
              {isEdit ? (
                <input
                  placeholder="Entry fee"
                  type="number"
                  min="0"
                  className="ml-2 w-32 p-2 text-sm pl-1 border border-stone-500 rounded-md focus:outline-none"
                  defaultValue={currentClicked.entryFee}
                  onChange={handleEntryFee}
                  // onChange={handleEntryFee}
                  // defaultValue={selectedPrizepool && selectedPrizepool.entryFee}
                />
              ) : (
                <p className="mb-3 text-[#ffffffb6] text-sm">
                  <strong className="text-white text-base">Entry fee: </strong>
                  {currentClicked.entryFee}
                </p>
              )}
            </div>

            <div className="border border-[#464646] rounded-2xl overflow-hidden my-5">
              <table
                className="table-auto w-full"
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
                    <th className="px-4 py-5 text-[#ffffff] font-extralight">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, i) => (
                    <tr key={i}>
                      {!row.isMultiple ? (
                        <td
                          className={`border border-[#464646] px-2 py-1 text-white`}
                          colSpan={2}
                        >
                          {isEdit ? (
                            <div className="relative flex items-center justify-between">
                              <input
                                className="h-10 w-full focus:outline-none text-center bg-transparent text-white"
                                type="number"
                                min="1"
                                value={row.min}
                                onChange={(e) =>
                                  handleRowChange(i, "min", e.target.value)
                                }
                              />
                              <div className="absolute right-1 flex items-center gap-4 mr-1">
                                <button
                                  onClick={() => toggleSwitch(i)}
                                  className={`relative w-16 h-7 flex items-center justify-between rounded-full transition-colors duration-300 ${
                                    tableData[i].isMultiple
                                      ? "bg-[#1E1E24]"
                                      : "bg-[#1E1E24]"
                                  }`}
                                >
                                  <div
                                    className={`flex items-center justify-center w-[2.2rem] h-full rounded-full shadow-md transform duration-300 bg-[#DAFD24] z-10" ${
                                      tableData[i].isMultiple
                                        ? "translate-x-8"
                                        : "translate-x-0"
                                    }`}
                                  ></div>
                                  <User
                                    size={18}
                                    className={`absolute left-[9px]`}
                                    style={
                                      tableData[i].isMultiple
                                        ? { color: "#A1A1A1" }
                                        : { color: "black" }
                                    }
                                  />
                                  <Users
                                    size={18}
                                    className="absolute right-1"
                                    style={
                                      tableData[i].isMultiple
                                        ? { color: "black" }
                                        : { color: "#A1A1A1" }
                                    }
                                  />
                                </button>
                              </div>
                            </div>
                          ) : (
                            row.min
                          )}
                        </td>
                      ) : (
                        <>
                          <td className="border border-[#464646] px-2 py-1 text-white h-10 w-full bg-transparent text-center">
                            {isEdit ? (
                              <input
                                className="h-10 w-full focus:outline-none text-center text-white bg-transparent"
                                type="number"
                                min="1"
                                value={row.max || ""}
                                onChange={(e) =>
                                  handleRowChange(i, "max", e.target.value)
                                }
                              />
                            ) : (
                              row.min
                            )}
                          </td>
                          <td
                            className={`${
                              isEdit &&
                              "relative flex items-center justify-between"
                            } text-white h-12 border border-[#464646] px-2 py-1 text-center`}
                          >
                            {isEdit ? (
                              <>
                                <input
                                  className="h-full w-full focus:outline-none text-center text-white bg-transparent"
                                  type="number"
                                  min="1"
                                  value={row.max}
                                  onChange={(e) =>
                                    handleRowChange(i, "max", e.target.value)
                                  }
                                />
                                <div className="absolute right-1 flex items-center gap-4 mr-1">
                                  <button
                                    onClick={() => toggleSwitch(i)}
                                    className={`relative w-16 h-7 flex items-center justify-between rounded-full transition-colors duration-300 ${
                                      tableData[i].isMultiple
                                        ? "bg-[#1E1E24]"
                                        : "bg-[#1E1E24]"
                                    }`}
                                  >
                                    <div
                                      className={`flex items-center justify-center w-[2.2rem] h-full rounded-full shadow-md transform duration-300 bg-[#DAFD24] z-10" ${
                                        tableData[i].isMultiple
                                          ? "translate-x-8"
                                          : "translate-x-0"
                                      }`}
                                    ></div>
                                    <User
                                      size={18}
                                      className={`absolute left-[9px]`}
                                      style={
                                        tableData[i].isMultiple
                                          ? { color: "#A1A1A1" }
                                          : { color: "black" }
                                      }
                                    />
                                    <Users
                                      size={18}
                                      className="absolute right-1"
                                      style={
                                        tableData[i].isMultiple
                                          ? { color: "black" }
                                          : { color: "#A1A1A1" }
                                      }
                                    />
                                  </button>
                                </div>
                              </>
                            ) : (
                              row.max
                            )}
                          </td>
                        </>
                      )}

                      <td className="border border-[#464646] px-2 py-1 text-center bg-transparent text-white">
                        {isEdit ? (
                          <input
                            className="h-10 w-full focus:outline-none text-center bg-transparent text-white"
                            type="number"
                            min="1"
                            value={row.amount || ""}
                            onChange={(e) =>
                              handleRowChange(i, "amount", e.target.value)
                            }
                          />
                        ) : (
                          row.amount
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {isEdit && (
              <button
                className="rounded-2xl py-3 px-4 bg-[#1E1E24] text-white text-[13px]"
                onClick={handleAddNewRow}
              >
                Add row
              </button>
            )}
          </div>
          <div className="flex items-center justify-end gap-3">
            <button
              className="bg-black
                px-6 py-2 rounded-xl text-white w-24 text-sm border border-[#DAFD24]"
              onClick={isEdit ? handleSave : handleEdit}
            >
              {isEdit ? "Save" : "Edit"}
            </button>
            <button
              className="bg-red-600
                px-3 py-2 rounded-xl text-white w-24 text-sm"
            >
              Delete
            </button>
          </div>
        </dialog>
      )}
    </>
  );
}

export default PackageTable;
