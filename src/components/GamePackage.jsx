import React, { useEffect, useRef, useState } from "react";
import { ArrowDownUp, FilterIcon, Plus, X } from "lucide-react";
import Stepper from "./Stepper";
import PackageTable from "./PackageTable";
import StepperPage1 from "./StepperPage1";
import StepperPage2 from "./StepperPage2";
import { dummyPackages, dummyPrizepools } from "../data";
import { gameConfig } from "../data";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import Filter from "./Filter";

const defaultFiltered = gameConfig.map((item) => item["name"]);

const stepperArr = Array.from({ length: 2 });

function GamePackage() {
  const [showBubble, setShowBubble] = useState(false);
  const [packageRows, setPackageRows] = useState(dummyPackages);
  const [updatedPackage, setUpdatedPackage] = useState(packageRows || []);
  const [gameTypePrizepool, setGameTypePrizepool] = useState([]);
  const [accessNextPage, setAccessNextPage] = useState(false);
  const [selectedFilterBoxes, setSelectedFilterBoxes] = useState([]);
  const [filterType, setFilterType] = useState(defaultFiltered);
  const [activeFilter, setActiveFilter] = useState("gameType");
  const [currActiveTab, setCurrActiveTab] = useState(1);
  const [currActiveGame, setCurrActiveGame] = useState([]);
  const [packageKey, setPackageKey] = useState("");
  const [selectedPrizepoolId, setSelectedPrizepoolId] = useState("");

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
    { min: 0, max: 1, amount: 0, isMultiple: false },
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
          parseFloat(row.amount),
          row.isMultiple
        ),
      0
    );

    setTotalAmount(total);
    setAmountRemaining(total - usedAmount);
  }, [prizeData, userInteraction]);

  useEffect(() => {
    if (
      !selectedFilterBoxes.some((each) => each === "Ludo" || each === "Rummy")
    ) {
      setUpdatedPackage(packageRows);
    }
  }, [selectedFilterBoxes]);

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
    console.log(prizeData.length);
    if (amountRemaining !== 0 && prizeData.length === 0) {
      setPrizeData((prev) => [...prev, { min: "", max: "", amount: "" }]);
    }
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...prizeData];
    updated[index][field] = value;

    const cleaned = updated.filter(
      (row) => row.min !== "" || row.max !== "" || row.amount !== ""
    );

    const isGreater =
      (field === "min" || field === "max") &&
      parseInt(value) > parseInt(userInteraction.playersCount);

    if (isGreater) {
      toast.error(
        "Prizepool positions cannot exceed number of players in game"
      );
      return;
    }

    if (
      field === "min" &&
      index > 0 &&
      parseInt(value) <= parseInt(prizeData[index - 1].max)
    ) {
      toast.error("Min value must be greater than previous max");
      return;
    }

    setUserInteraction((prev) => ({ ...prev, errorText: "" }));
    setPrizeData(cleaned);

    if (field === "amount") {
      calculateAmount();
    }
  };

  const calculateMinMax = (min, max, amount, isMultiple) => {
    if (isMultiple) {
      if (!min || !max || !amount || max < min) {
        return 0;
      }

      const positions = max - min + 1;

      return amount * positions;
    }

    return amount;
  };

  const calculateAmount = () => {
    const updated = [...prizeData];

    const usedAmount = updated.reduce(
      (sum, row) =>
        sum +
        calculateMinMax(
          parseFloat(row.min),
          parseFloat(row.max),
          parseFloat(row.amount),
          row.isMultiple
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

  const handleCheckbox = (val, e) => {
    const { checked } = e.target;

    setSelectedFilterBoxes((prevSelected) => {
      const newSelected = checked
        ? [...prevSelected, val]
        : prevSelected.filter((item) => item !== val);

      const filtered = dummyPackages.filter((pkg) =>
        newSelected.includes(pkg[activeFilter])
      );

      if (activeFilter === "gameType") {
        const activeGames = gameConfig.filter((each) =>
          newSelected.includes(each.name)
        );

        setCurrActiveGame(activeGames);
      }

      setUpdatedPackage(filtered);
      return newSelected;
    });
  };

  const handleFilterClick = (val, type) => {
    const filtered = gameConfig
      .flatMap((item) => item[val])
      .filter((each, i, self) => self.indexOf(each) === i);

    setFilterType(filtered);
    setActiveFilter(type);
    setPackageKey(val);
  };

  const handleEntryFee = (e) => {
    setUserInteraction((prev) => ({ ...prev, errorText: "" }));
    const entryFee = Number(e.target.value) || 0;

    setUserInteraction((prev) => ({ ...prev, entryFee }));

    if (userInteraction.playersCount) {
      setTotalAmount(userInteraction.entryFee * userInteraction.playersCount);
    }
  };

  // const checkIsDisabled = (val) => {
  //   currActiveGame[packageKey].in;
  // };

  const arePrizePoolsEqual = (a = [], b = []) => {
    if (a.length !== b.length) return false;

    return a.every((item, index) => {
      const other = b[index];
      return (
        Number(item.min) === Number(other.min) &&
        Number(item.max) === Number(other.max) &&
        Number(item.amount) === Number(other.amount) &&
        Boolean(item.isMultiple) === Boolean(other.isMultiple)
      );
    });
  };

  const handleCreateRow = () => {
    setCurrActiveTab(1);
    dialogRef.current.close();

    const prizepoolObj = dummyPrizepools.find(
      (each) => each.id === selectedPrizepoolId
    );

    let id = prizepoolObj.id;

    if (prizepoolObj && arePrizePoolsEqual(prizepoolObj.prizepool, prizeData)) {
      id = prizepoolObj.id;
    } else {
      id = `prizepool-${dummyPrizepools.length + 1}`;
      dummyPrizepools.push({ id, prizeData });
      console.log({ id, prizeData });
    }

    const {
      currGame,
      mode,
      tier,
      entryFee,
      playersCount,
      minWaitTime,
      maxWaitTime,
    } = userInteraction;

    const newRow = {
      id: packageRows.length + 1,
      gameType: currGame.name,
      gameMode: mode,
      tier,
      entryFee,
      prizepool: id,
      players: playersCount,
      minQue: minWaitTime,
      maxQue: maxWaitTime,
    };

    setUpdatedPackage((prevRows) => [...prevRows, newRow]);
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
            setSelectedPrizepoolId={setSelectedPrizepoolId}
          />
        );
    }
  };

  return (
    <div className="font-helveticaBold relative h-screen w-full bg-[#0F0F13] text-[#FFFFFF]">
      <div className="border-b border-b-gray-300/10 py-6 px-10">
        <h1 className="text-3xl font-semibold">Current Packages</h1>
        <div className="flex items-center gap-5 justify-end">
          {/* <div
            onClick={handleFilterClick}
            className="inline-flex items-center gap-1 rounded-lg cursor-pointer"
          >
            <FilterIcon size={20} />
            <p>Filter</p>
          </div> */}
          <div className="relative text-sm font-light flex items-center gap-5">
            <div
              className="inline-flex items-center bg-[#1E1E24] py-2 px-3 rounded-2xl gap-2 cursor-pointer"
              onClick={handleAdd}
            >
              <Plus size={17} />
              <p>Add new package</p>
            </div>
            <div
              onMouseEnter={() => setShowBubble(true)}
              className="inline-flex items-center bg-[#1E1E24] py-2 px-3 rounded-2xl gap-2 cursor-pointer"
            >
              <FilterIcon size={15} />
              <p>Filter</p>
            </div>

            {showBubble && (
              <>
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-10"
                  onMouseLeave={() => setShowBubble(false)}
                >
                  <div className="w-0 h-0 mx-auto border-l-8 border-r-8 border-b-8 border-transparent border-b-white"></div>

                  <div className="bg-white rounded-lg shadow-md text-sm w-72 flex justify-between relative">
                    <div className="flex flex-col justify-between w-[50%] bg-slate-50 rounded-md">
                      <button
                        className={`w-full py-4 px-4 text-left transition-all ease duration-200 hover:bg-slate-100 rounded-md ${
                          activeFilter === "gameType" ? "bg-slate-200" : ""
                        } `}
                        onClick={() => handleFilterClick("name", "gameType")}
                      >
                        Game type
                      </button>
                      <button
                        className={`w-full py-4 px-4 text-left transition-all ease duration-200 hover:bg-slate-100 rounded-md ${
                          activeFilter === "gameMode" ? "bg-slate-200" : ""
                        } `}
                        onClick={() => handleFilterClick("modes", "gameMode")}
                      >
                        Game mode
                      </button>
                      <button
                        className={`w-full py-4 px-4 text-left transition-all ease duration-200 hover:bg-slate-100 rounded-md ${
                          activeFilter === "tier" ? "bg-slate-200" : ""
                        } `}
                        onClick={() => handleFilterClick("tiers", "tier")}
                      >
                        Tier
                      </button>
                      <button
                        className="w-full py-4 px-4 text-left transition-all ease duration-200 hover:bg-slate-100 rounded-md"
                        // onClick={() => handleFilterClick("modes")}
                      >
                        Entry fee
                      </button>
                      <button
                        className={`w-full py-4 px-4 text-left transition-all ease duration-200 hover:bg-slate-100 rounded-md ${
                          activeFilter === "players" ? "bg-slate-200" : ""
                        } `}
                        onClick={() =>
                          handleFilterClick("playerCount", "players")
                        }
                      >
                        Player count
                      </button>
                    </div>
                    {/* <div className="w-px h-40 bg-black" /> */}
                    <div className="w-[50%] p-5">
                      {filterType &&
                        filterType.map((each) => (
                          <div className="flex items-center gap-3 mb-3">
                            <input
                              type="checkbox"
                              className="border border-black"
                              checked={selectedFilterBoxes.includes(each)}
                              onChange={(e) => handleCheckbox(each, e)}
                              value={each}
                              disabled={
                                currActiveGame.length > 0 &&
                                packageKey &&
                                packageKey !== "name" &&
                                !currActiveGame.some((game) =>
                                  game[packageKey].includes(each)
                                )
                              }
                              id={each}
                            />
                            <label htmlFor={each}>{each}</label>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="inline-flex items-center bg-[#1E1E24] py-2 px-3 rounded-2xl gap-2 cursor-pointer">
              <ArrowDownUp size={15} />
              <p>Sort</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 py-6">
        <PackageTable
          data={filterType ? updatedPackage : packageRows}
          setData={setPackageRows}
          setPrizeData={setPrizeData}
        />
      </div>

      <dialog
        ref={dialogRef}
        className="relative w-[50%] max-h-max rounded-xl shadow-xl bg-[#0F0F13]"
      >
        <div className="flex flex-col justify-between h-full p-5">
          <div>
            <div className="text-end">
              <button onClick={handlePackageClose}>
                <X style={{ color: "white" }} />
              </button>
            </div>
            <div className="m-auto w-[70%]">
              <Stepper active={currActiveTab} arr={stepperArr} />
            </div>

            <div className="my-20 h-full w-[90%] m-auto">
              {displayFields(currActiveTab)}
            </div>
          </div>

          <div className="flex justify-end m-auto gap-4 w-[90%] mb-4">
            {/* <button 10="border border-stone-500 px-6 py-2 rounded-xl w-24">
                Cancel
              </button> */}
            {currActiveTab === stepperArr.length ? (
              <div className="flex gap-5">
                <button
                  className="border px-6 py-2 rounded-xl w-24 text-white border-[#DAFD24] text-sm"
                  onClick={handleBack}
                >
                  Back
                </button>
                <button
                  className="px-3 py-2 rounded-xl text-black w-24 bg-[#DAFD24] text-sm"
                  onClick={handleCreateRow}
                >
                  Create
                </button>
              </div>
            ) : (
              <button
                className={`${
                  accessNextPage
                    ? "bg-[#DAFD24] text-black"
                    : "bg-[#2e2d2d8a] text-[#ffffff23]"
                } px-6 py-3 rounded-2xl text-sm w-24`}
                onClick={handleNext}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </dialog>
      {/* <Filter active={filterActive} /> */}
      <ToastContainer position="top-right" autoClose={3000} className="z-50" />
    </div>
  );
}

export default GamePackage;
