import React, { useEffect, useRef, useState } from "react";
import { dummyPrizepools, gameConfig } from "../data";
import { IndianRupee, X } from "lucide-react";

function PackageTable({ data, setData }) {
  const [currentClicked, setCurrentClicked] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [currGame, setCurrGame] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [amountRemaining, setAmountRemaining] = useState();
  const [totalAmount, setTotalAmount] = useState();
  const dialogRef = useRef(null);

  useEffect(() => {
    if (currentClicked && dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, [currentClicked]);

  const handleRowClick = (id) => {
    const resultObj = data.find((each) => each.id === id);
    const getTableData = dummyPrizepools.find(
      (each) => each.id === resultObj.prizepool
    );
    const currentGame = gameConfig.find(
      (each) => each.name === resultObj.gameType
    );

    setCurrGame(currentGame);
    setTableData(getTableData.prizeData);
    setCurrentClicked(resultObj);
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
          className="relative w-[50%] p-5 max-h-max rounded-xl shadow-xl"
        >
          <div className="w-[55%] ml-auto flex justify-between items-center mb-6">
            <h1 className="text-center font-semibold text-2xl">
              {currentClicked.gameType}
            </h1>
            <X onClick={handleClose} className="cursor-pointer" />
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
                <p className="mb-3">
                  <strong>Game mode: </strong>
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
                <p className="mb-3">
                  <strong>Tier: </strong>
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
                <p className="mb-3">
                  <strong>Minimum wait time: </strong>
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
                <p className="mb-3">
                  <strong>Maximum wait time: </strong>
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
                <p>
                  <strong>Player count: </strong>
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
                <p>
                  <strong>Entry fee: </strong>
                  {currentClicked.entryFee}
                </p>
              )}
            </div>
            {errorText && <p>* {errorText}</p>}
            <div className="border border-gray-300 my-4 rounded-lg overflow-hidden">
              <table
                className="table-auto w-full"
                style={{ tableLayout: "fixed" }}
              >
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
                  {tableData.map((row, i) => (
                    <tr key={i}>
                      <td className="border px-2 py-1">
                        {isEdit ? (
                          <input
                            className="h-10 w-full focus:outline-none text-center"
                            type="number"
                            min="1"
                            value={row.min}
                            onChange={(e) =>
                              handleRowChange(i, "min", e.target.value)
                            }
                          />
                        ) : (
                          row.min
                        )}
                      </td>
                      <td className="border px-2 py-1">
                        {isEdit ? (
                          <input
                            className="h-10 w-full focus:outline-none text-center"
                            type="number"
                            min="1"
                            value={row.max}
                            onChange={(e) =>
                              handleRowChange(i, "max", e.target.value)
                            }
                          />
                        ) : (
                          row.max
                        )}
                      </td>
                      <td className="border px-2 py-1">
                        {isEdit ? (
                          <input
                            className="h-10 w-full focus:outline-none text-center"
                            type="number"
                            min="1"
                            value={row.amount}
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
            <button
              className="rounded-lg py-2 px-4 bg-black text-white text-sm"
              onClick={handleAddNewRow}
            >
              Add row
            </button>
          </div>
          <div className="flex items-center justify-end gap-3">
            <button
              className="bg-black
                px-6 py-2 rounded-xl text-white w-24"
              onClick={isEdit ? handleSave : handleEdit}
            >
              {isEdit ? "Save" : "Edit"}
            </button>
            <button
              className="bg-red-600
                px-6 py-2 rounded-xl text-white w-24"
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
