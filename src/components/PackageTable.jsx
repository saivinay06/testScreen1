import React, { useEffect, useRef, useState } from "react";
import { dummyPrizepools, gameConfig } from "../data";
import { User, Users } from "lucide-react";
import { IndianRupee, X } from "lucide-react";

function PackageTable({
  data,
  setData,
  setPrizeData,
  dummyPrizes,
  handleEdit,
  previewRef,
}) {
  const [currentClicked, setCurrentClicked] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [currGame, setCurrGame] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [amountRemaining, setAmountRemaining] = useState();
  const [totalAmount, setTotalAmount] = useState();
  const [isPackageDelete, setIsPackageDelete] = useState(false);
  const [currentPackageId, setCurrentPackageId] = useState(null);
  const dialogRef = useRef(null);
  const confirmationRef = useRef(null);

  useEffect(() => {
    if (currentClicked && previewRef.current) {
      previewRef.current.showModal();
    }
  }, [currentClicked]);

  const handleRowClick = (id) => {
    const resultObj = data.find((each) => each.id === id);

    const getTableData = dummyPrizes.find(
      (each) => each.id === resultObj.prizepool
    );

    const currentGame = gameConfig.find(
      (each) => each.name === resultObj.gameType
    );

    setCurrentPackageId(id);
    setCurrGame(currentGame);
    setTableData(getTableData.prizeData);
    setCurrentClicked(resultObj);

    if (previewRef.current) {
      previewRef.current.showModal();
    }
  };

  const handleSave = () => {
    const updated = data.map((item) =>
      item.id === editedData.id ? editedData : item
    );

    updated.prizepool = editedData.prizepool;

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
    }
  };

  const handleDeletePackage = () => {
    confirmationRef.current.showModal();
  };

  const confirmationDelete = (val) => {
    if (val === "Yes") {
      setData((prev) => prev.filter((each) => each.id !== currentClicked.id));
      setCurrentClicked(null);
      setEditedData(null);
      setIsEdit(false);
      dialogRef.current?.close();
      confirmationRef.current.close();
    } else {
      confirmationRef.current.close();
    }
  };

  const toggleSwitch = (index) => {
    const updated = [...tableData];
    updated[index].isMultiple = !updated[index].isMultiple;
    setTableData(updated);
  };

  return (
    <>
      <table className="table-auto w-full">
        <thead className="text-[#A9A9B7] text-[16px]">
          <tr>
            <th className="text-start pb-8">Package_id</th>
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
              className="hover:bg-[#1E1E24] cursor-pointer text-center border-b border-b-gray-300/10 text-sm"
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
          ref={previewRef}
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
              <p className="mb-3 text-[#ffffffb6] text-sm">
                <strong className="text-white text-base">Game mode: </strong>
                {currentClicked.gameMode}
              </p>
              <p className="mb-3 text-[#ffffffb6] text-sm">
                <strong className="text-white text-base">Tier: </strong>
                {currentClicked.tier}
              </p>
            </div>
            <div className="flex flex-col items-start">
              <p className="mb-3 text-[#ffffffb6] text-sm">
                <strong className="text-white text-base">
                  Minimum wait time(Sec):{" "}
                </strong>
                {currentClicked.minQue}
              </p>

              <p className="mb-3 text-[#ffffffb6] text-sm">
                <strong className="text-white text-base">
                  Maximum wait time(Sec):{" "}
                </strong>
                {currentClicked.maxQue}
              </p>
            </div>
          </div>
          <div className="my-5">
            <div className="flex items-center gap-5 justify-end">
              <p className="mb-3 text-[#ffffffb6] text-sm">
                <strong className="text-white text-base">Player count: </strong>
                {currentClicked.players}
              </p>

              <p className="mb-3 text-[#ffffffb6] text-sm">
                <strong className="text-white text-base">Entry fee: </strong>
                {currentClicked.entryFee}
              </p>
            </div>

            <div className="border border-[#464646] rounded-2xl overflow-x-hidden overflow-y-scroll my-5 custom-scrollbar max-h-52">
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
                          className={`border border-[#464646] px-2 py-1 h-12 text-white text-center`}
                          colSpan={2}
                        >
                          {row.min}
                        </td>
                      ) : (
                        <>
                          <td className="border border-[#464646] px-2 py-1 text-white h-12 w-full bg-transparent text-center">
                            {row.min}
                          </td>
                          <td
                            className={`${
                              isEdit &&
                              "relative flex items-center justify-between"
                            } text-white h-12 border border-[#464646] px-2 py-1 text-center`}
                          >
                            {row.max}
                          </td>
                        </>
                      )}

                      <td className="border border-[#464646] px-2 py-1 text-center bg-transparent text-white">
                        {row.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <button
              className="bg-black
                px-6 py-2 rounded-xl text-white w-24 text-sm border border-[#ffffff]"
              onClick={() => handleEdit(currentClicked.id)}
            >
              Edit
            </button>
            <button
              onClick={handleDeletePackage}
              className="bg-red-600
                px-3 py-2 rounded-xl text-white w-24 text-sm"
            >
              Delete
            </button>
          </div>
        </dialog>
      )}
      <dialog ref={confirmationRef} className="p-5 rounded-xl relative">
        <div className="flex flex-col gap-5">
          <p>Are you sure you want to delete the package?</p>
          <div className="flex items-center gap-5 justify-end">
            <button
              onClick={() => confirmationDelete("Yes")}
              className="border border-black px-4 py-1 rounded-xl"
            >
              Yes
            </button>
            <button
              onClick={() => confirmationDelete("No")}
              className="border border-black px-4 py-1 rounded-xl"
            >
              No
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default PackageTable;
