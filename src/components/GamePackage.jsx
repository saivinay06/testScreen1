import React, { useEffect, useRef, useState } from "react";
import { ArrowDownUp, FilterIcon, X } from "lucide-react";
import Stepper from "./Stepper";
import PackageTable from "./PackageTable";
import StepperPage1 from "./StepperPage1";
import StepperPage2 from "./StepperPage2";
import { dummyPackages } from "../data";
import { gameConfig } from "../data";

const stepperArr = Array.from({ length: 2 });

function GamePackage() {
  const [packageRows, setPackageRows] = useState(dummyPackages);
  const [gameTypePrizepool, setGameTypePrizepool] = useState([]);
  const [accessNextPage, setAccessNextPage] = useState(false);

  const [currActiveTab, setCurrActiveTab] = useState(1);

  const [userInteraction, setUserInteraction] = useState({
    currGame: "",
    mode: "",
    tier: "",
    maxWaitTime: "",
    minWaitTime: "",
    playersCount: "",
    entryFee: "",
    errorText: "",
  });
  const [amountRemaining, setAmountRemaining] = useState();
  const [totalAmount, setTotalAmount] = useState();
  const [prizeData, setPrizeData] = useState([
    { min: "1", max: "", amount: "" },
  ]);

  const dialogRef = useRef(null);

  useEffect(() => {
    const fee = parseFloat(userInteraction.entryFee) || 0;
    const players = parseInt(userInteraction.playersCount) || 0;
    const total = fee * players;
    const { currGame, mode, tier, maxWaitTime, minWaitTime } = userInteraction;

    if (currGame && mode && tier && maxWaitTime && minWaitTime) {
      setAccessNextPage(true);
    }

    const usedAmount = prizeData.reduce(
      (sum, row) =>
        sum +
        calculateMinMax(
          parseFloat(row.min),
          parseFloat(row.max),
          parseFloat(row.amount)
        ),
      0
    );

    setTotalAmount(total);
    setAmountRemaining(total - usedAmount);
  }, [prizeData, userInteraction]);

  const handleAdd = () => {
    dialogRef.current?.showModal();
  };

  const handlePackageClose = () => {
    dialogRef.current?.close();
  };

  const handleGameChange = (e) => {
    const findGameObj = gameConfig.find((each) => each.name === e.target.value);

    const gamePrizepool = packageRows.filter((each) =>
      findGameObj.playerCount.includes(each.players)
    );

    setGameTypePrizepool(gamePrizepool);

    setUserInteraction((prev) => ({ ...prev, currGame: findGameObj }));
  };

  const handleNext = () => {
    const { currGame, mode, tier, maxWaitTime, minWaitTime } = userInteraction;

    if (!currGame || !mode || !tier || !maxWaitTime || !minWaitTime) {
      return;
    }

    if (currActiveTab <= stepperArr.length) {
      // setAccessNextPage(true);
      setCurrActiveTab(currActiveTab + 1);
    }
  };

  const handleAddRow = () => {
    if (amountRemaining !== 0) {
      setPrizeData((prev) => [...prev, { min: "", max: "", amount: "" }]);
    }
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...prizeData];
    updated[index][field] = parseInt(value);

    const isGreater = parseInt(value) > parseInt(userInteraction.playersCount);

    if (!(field === "amount") && isGreater) {
      setUserInteraction((prev) => ({
        ...prev,
        errorText: `Prizepool positions cannot exceed number of players in game`,
      }));
      return;
    }

    if (
      field === "min" &&
      index > 0 &&
      Number(value) <= Number(prizeData[index - 1].max)
    ) {
      setUserInteraction((prev) => ({
        ...prev,
        errorText: "Min value must be greater than previous max",
      }));
      return;
    }

    setUserInteraction((prev) => ({ ...prev, errorText: "" }));
    setPrizeData(updated);

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
    const updated = [...prizeData];

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

  const handleBack = () => {
    if (currActiveTab > 1) {
      setCurrActiveTab(currActiveTab - 1);
    }
  };

  const handleEntryFee = (e) => {
    setUserInteraction((prev) => ({ ...prev, errorText: "" }));
    const entryFee = Number(e.target.value) || 0;

    setUserInteraction((prev) => ({ ...prev, entryFee }));

    if (userInteraction.playersCount) {
      setTotalAmount(userInteraction.entryFee * userInteraction.playersCount);
    }
  };

  const handleCreateRow = () => {
    setCurrActiveTab(1);
    dialogRef.current.close();

    const {
      currGame,
      mode,
      tier,
      entryFee,
      playersCount,
      minWaitTime,
      maxWaitTime,
    } = userInteraction;

    setPackageRows((prev) => {
      return [
        ...prev,
        {
          id: prev.length + 1,
          gameType: currGame.name,
          gameMode: mode,
          tier,
          entryFee,
          prizepool: prizeData,
          players: playersCount,
          minQue: minWaitTime,
          maxQue: maxWaitTime,
        },
      ];
    });
  };

  const displayFields = (step) => {
    switch (step) {
      case 1:
        return (
          <StepperPage1
            handleGameChange={handleGameChange}
            gameConfig={gameConfig}
            interaction={userInteraction}
            setInteraction={setUserInteraction}
          />
        );

      case 2:
        return (
          <StepperPage2
            interaction={userInteraction}
            setInteraction={setUserInteraction}
            handleEntryFee={handleEntryFee}
            handleRowChange={handleRowChange}
            handleAddRow={handleAddRow}
            totalAmount={totalAmount}
            prizeData={prizeData}
            amountRemaining={amountRemaining}
            setPrizeData={setPrizeData}
            packageRows={packageRows}
            gameTypePrizepool={gameTypePrizepool}
            calculateAmount={calculateAmount}
          />
        );
    }
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
            <ArrowDownUp />
            <p>Sort</p>
          </div>
        </div>
      </div>
      <h1 className="text-2xl mt-5 font-semibold">Current Packages</h1>
      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md my-2">
        <PackageTable data={packageRows} setData={setPackageRows} />
      </div>
      <button
        className="border rounded-xl py-2 px-4 bg-black text-white"
        onClick={handleAdd}
      >
        Add new package
      </button>
      <dialog
        ref={dialogRef}
        className="relative w-[50%] max-h-max rounded-xl shadow-xl"
      >
        <div className="flex flex-col justify-between h-full p-5">
          <div>
            <div className="text-end">
              <button onClick={handlePackageClose}>
                <X />
              </button>
            </div>
            <div className="m-auto w-[70%]">
              <Stepper active={currActiveTab} arr={stepperArr} />
            </div>

            <div className="my-12 h-full w-[90%] m-auto">
              {displayFields(currActiveTab)}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            {/* <button 10="border border-stone-500 px-6 py-2 rounded-xl w-24">
                Cancel
              </button> */}
            {currActiveTab === stepperArr.length ? (
              <div className="flex gap-5">
                <button
                  className="border border-black px-6 py-2 rounded-xl w-24"
                  onClick={handleBack}
                >
                  Back
                </button>
                <button
                  className="bg-black px-6 py-2 rounded-xl text-white w-24"
                  onClick={handleCreateRow}
                >
                  Create
                </button>
              </div>
            ) : (
              <button
                className={`${
                  accessNextPage ? "bg-black" : "bg-slate-200"
                } px-6 py-2 rounded-xl text-white w-24`}
                onClick={handleNext}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default GamePackage;
