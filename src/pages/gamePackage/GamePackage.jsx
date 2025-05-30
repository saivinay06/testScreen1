import React, { useEffect, useRef, useState } from "react";
import { ArrowDownUp, FilterIcon, Plus, X } from "lucide-react";
import Stepper from "../../components/Stepper";
import PackageTable from "../../components/PackageTable";
import StepperPage1 from "../../components/StepperPage1";
import StepperPage2 from "../../components/StepperPage2";
import { dummyPackages, dummyPrizepools } from "../../data";
import { gameConfig } from "../../data";
import { toast } from "react-toastify";
import Filter from "../../components/Filter";

const defaultFiltered = gameConfig.map((item) => item["name"]);

const stepperArr = Array.from({ length: 2 });

function GamePackage() {
  const [showBubble, setShowBubble] = useState(false);
  const [dummyPrizes, setDummyPrizes] = useState(dummyPrizepools);
  const [packageRows, setPackageRows] = useState(dummyPackages);
  const [updatedPackage, setUpdatedPackage] = useState(packageRows || []);
  const [filteredPPackage, setFilteredPPackage] = useState(packageRows || []);
  const [gameTypePrizepool, setGameTypePrizepool] = useState([]);
  const [accessNextPage, setAccessNextPage] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    gameType: [],
    tier: [],
    gameMode: [],
    playerCount: [],
  });

  const [filterType, setFilterType] = useState(defaultFiltered);
  const [activeFilter, setActiveFilter] = useState("gameType");
  const [currActiveTab, setCurrActiveTab] = useState(1);
  const [currActiveGame, setCurrActiveGame] = useState([]);
  const [packageKey, setPackageKey] = useState("");
  const [selectedPrizepoolId, setSelectedPrizepoolId] = useState("");
  const [packageToEdit, setPackageToEdit] = useState("");
  const [activePrizepoolId, setActivePrizepoolId] = useState(null);
  const [submitEdit, setSubmitEdit] = useState(false);
  const [currPrizepoolData, setCurrPrizepoolData] = useState([]);

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

  const previewRef = useRef(null);

  useEffect(() => {
    const fee = parseFloat(userInteraction.entryFee) || 0;
    const players = parseInt(userInteraction.playersCount) || 0;
    const total = fee * players;
    const { currGame, mode, tier, maxWaitTime, minWaitTime } = userInteraction;

    if (currGame && mode && tier && maxWaitTime && minWaitTime) {
      setAccessNextPage(true);
    } else {
      setAccessNextPage(false);
    }

    const usedAmount =
      prizeData.reduce(
        (sum, row) =>
          sum +
          calculateMinMax(
            parseFloat(row.min),
            parseFloat(row.max),
            parseFloat(row.amount),
            row.isMultiple
          ),
        0
      ) || 0;

    setTotalAmount(total);
    setAmountRemaining(total - usedAmount);
  }, [prizeData, userInteraction, updatedPackage]);

  const handleAdd = () => {
    dialogRef.current?.showModal();
  };

  const handlePackageClose = () => {
    dialogRef.current?.close();
  };

  const handleGameChange = (e) => {
    if (e.target.value) {
      const findGameObj = gameConfig.find(
        (each) => each.name === e.target.value
      );

      const gamePrizepool = packageRows.filter((each) =>
        findGameObj.playerCount.includes(each.players)
      );

      setGameTypePrizepool(gamePrizepool);

      setUserInteraction((prev) => ({ ...prev, currGame: findGameObj }));
    }
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

    const usedAmount =
      updated.reduce(
        (sum, row) =>
          sum +
          calculateMinMax(
            parseFloat(row.min),
            parseFloat(row.max),
            parseFloat(row.amount),
            row.isMultiple
          ),
        0
      ) || 0;

    setAmountRemaining((totalAmount || 0) - usedAmount);
  };

  const handleBack = () => {
    if (currActiveTab > 1) {
      setCurrActiveTab(currActiveTab - 1);
    }
  };

  const applyAllFilters = (filters) => {
    let filtered = [...updatedPackage];

    if (filters.gameType.length > 0) {
      filtered = filtered.filter((pkg) =>
        filters.gameType.includes(pkg.gameType)
      );
    }

    if (filters.tier.length > 0) {
      filtered = filtered.filter((pkg) => filters.tier.includes(pkg.tier));
    }

    if (filters.gameMode.length > 0) {
      filtered = filtered.filter((pkg) =>
        filters.gameMode.includes(pkg.gameMode)
      );
    }

    if (filters.playerCount.length > 0) {
      filtered = filtered.filter((pkg) =>
        filters.playerCount.includes(pkg.players)
      );
    }

    setFilteredPPackage(filtered);

    if (filters.gameType.length > 0) {
      const activeGames = gameConfig.filter((each) =>
        filters.gameType.includes(each.name)
      );
      setCurrActiveGame(activeGames);
    }
  };

  const handleCheckbox = (val, e) => {
    const { checked } = e.target;

    setActiveFilters((prevFilters) => {
      const updatedTypeFilter = checked
        ? [...prevFilters[activeFilter], val]
        : prevFilters[activeFilter].filter((item) => item !== val);

      const newFilters = {
        ...prevFilters,
        [activeFilter]: updatedTypeFilter,
      };

      applyAllFilters(newFilters);
      return newFilters;
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
    const entryFee = Number(e.target.value) || "";

    setUserInteraction((prev) => ({ ...prev, entryFee }));

    if (userInteraction.playersCount) {
      setTotalAmount(userInteraction.entryFee * userInteraction.playersCount);
    }
  };

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
    let id;

    if (selectedPrizepoolId) {
      const prizepoolObj = dummyPrizes.find(
        (each) => each.id === selectedPrizepoolId
      );

      if (
        prizepoolObj &&
        arePrizePoolsEqual(prizepoolObj.prizepool, prizeData)
      ) {
        id = prizepoolObj.id;
      } else {
        id = `prizepool-${dummyPrizes.length + 1}`;
        setDummyPrizes((prev) => [...prev, { id, prizeData }]);
      }
    } else {
      id = `prizepool-${dummyPrizes.length + 1}`;
      setDummyPrizes((prev) => [...prev, { id, prizeData }]);
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
      id: filteredPPackage.length + 1,
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
    setFilteredPPackage((prev) => [...prev, newRow]);

    setUserInteraction({
      currGame: "",
      mode: "",
      tier: "",
      maxWaitTime: "",
      minWaitTime: "",
      playersCount: "",
      entryFee: "",
      errorText: "",
    });

    setAmountRemaining(0);

    setPrizeData([{ min: 0, max: 1, amount: 0, isMultiple: false }]);
  };

  const handleEdit = (packageId) => {
    const packageToEdit = updatedPackage.find((row) => row.id === packageId);
    const activeGame = gameConfig.find(
      (game) => game.name === packageToEdit.gameType
    );

    setUserInteraction((prev) => {
      return {
        ...prev,
        currGame: activeGame,
        mode: packageToEdit.gameMode,
        tier: packageToEdit.tier,
        maxWaitTime: packageToEdit.maxQue,
        minWaitTime: packageToEdit.minQue,
        playersCount: packageToEdit.players,
        entryFee: packageToEdit.entryFee,
      };
    });

    const gamePrizepool = updatedPackage.filter((each) =>
      activeGame.playerCount.includes(each.players)
    );

    const activePrizepoolData = dummyPrizes.find(
      (prize) => prize.id === packageToEdit.prizepool
    );

    setSubmitEdit(true);

    setPrizeData(activePrizepoolData.prizeData);

    setGameTypePrizepool(gamePrizepool);

    setCurrPrizepoolData(activePrizepoolData);

    setActivePrizepoolId(packageToEdit.prizepool);

    dialogRef.current.showModal();
    previewRef.current.close();
    setCurrActiveTab(1);
    setPackageToEdit(packageToEdit);
  };

  const handleSubmitEdit = () => {
    let id;

    if (arePrizePoolsEqual(currPrizepoolData.prizepool, prizeData)) {
      id = currPrizepoolData.id;
    } else {
      id = `prizepool-${dummyPrizes.length + 1}`;
      setDummyPrizes((prev) => [...prev, { id, prizeData }]);
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

    const updatedRow = {
      ...packageToEdit,
      gameType: currGame.name,
      gameMode: mode,
      tier,
      entryFee,
      prizepool: id,
      players: playersCount,
      minQue: minWaitTime,
      maxQue: maxWaitTime,
    };

    setUpdatedPackage((prevPackages) =>
      prevPackages.map((pkg) =>
        pkg.id === packageToEdit.id ? updatedRow : pkg
      )
    );

    dialogRef.current.close();
    setCurrActiveTab(1);
    setSubmitEdit(false);
    setPrizeData([{ min: 0, max: 1, amount: 0, isMultiple: false }]);
    setAmountRemaining(0);
    setUserInteraction({
      currGame: "",
      mode: "",
      tier: "",
      maxWaitTime: "",
      minWaitTime: "",
      playersCount: "",
      entryFee: "",
      errorText: "",
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
            setSelectedPrizepoolId={setSelectedPrizepoolId}
            dummyPrizes={dummyPrizes}
            activePrizepoolId={activePrizepoolId}
          />
        );
    }
  };

  return (
    <div className="font-poppins relative h-screen w-full bg-[#0F0F13] text-[#FFFFFF]">
      <div className="border-b border-b-gray-300/10 py-6 px-10">
        <h1 className="text-3xl font-semibold font-helveticaBold ">
          Current Packages
        </h1>
        <div className="flex items-center gap-5 justify-end mr-20">
          <div className="text-sm font-light flex items-center gap-5">
            <div
              className="inline-flex items-center bg-[#1E1E24] py-2 px-3 rounded-2xl gap-2 cursor-pointer"
              onClick={handleAdd}
            >
              <Plus size={17} />
              <p>Add new package</p>
            </div>
            <div
              onMouseEnter={() => setShowBubble(true)}
              className="relative inline-flex items-center bg-[#1E1E24] py-2 px-3 rounded-2xl gap-2 cursor-pointer"
            >
              <FilterIcon size={15} />
              <p>Filter</p>
              {showBubble && (
                <>
                  <Filter
                    activeFilter={activeFilter}
                    setShowBubble={setShowBubble}
                    handleFilterClick={handleFilterClick}
                    filterType={filterType}
                    activeFilters={activeFilters}
                    handleCheckbox={handleCheckbox}
                    currActiveGame={currActiveGame}
                    packageKey={packageKey}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 py-6">
        <PackageTable
          data={filteredPPackage}
          setData={setUpdatedPackage}
          setPrizeData={setPrizeData}
          dummyPrizes={dummyPrizes}
          handleEdit={handleEdit}
          previewRef={previewRef}
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

            <div className="my-10 h-full w-[90%] m-auto">
              {displayFields(currActiveTab)}
            </div>
          </div>

          <div className="flex justify-end m-auto gap-4 w-[90%] mb-2">
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
                  className={`px-3 py-2 rounded-xl w-24 cursor-pointer ${
                    amountRemaining === 0 && userInteraction.playersCount
                      ? "text-black bg-[#DAFD24]"
                      : "bg-[#2e2d2d8a] text-[#ffffff23]"
                  } text-sm`}
                  disabled={
                    amountRemaining !== 0 && !userInteraction.playersCount
                  }
                  onClick={submitEdit ? handleSubmitEdit : handleCreateRow}
                >
                  {submitEdit ? "Submit" : "Create"}
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
    </div>
  );
}

export default GamePackage;
