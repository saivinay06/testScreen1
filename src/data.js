export const dummyPackages = [
  {
    id: 1,
    gameType: "Ludo",
    gameMode: "Classic",
    tier: "Bronze",
    entryFee: 50,
    prizepool: "prizepool_1",
    players: 2,
    minQue: 3,
    maxQue: 8,
  },
  {
    id: 2,
    gameType: "Rummy",
    gameMode: "Points",
    tier: "Pro",
    entryFee: 100,
    prizepool: "prizepool_2",
    players: 4,
    minQue: 5,
    maxQue: 10,
  },
  {
    id: 3,
    gameType: "Rummy",
    gameMode: "Pool",
    tier: "Elite",
    entryFee: 120,
    prizepool: "prizepool_3",
    players: 6,
    minQue: 6,
    maxQue: 10,
  },
  {
    id: 4,
    gameType: "Ludo",
    gameMode: "Tournament",
    tier: "Gold",
    entryFee: 150,
    prizepool: "prizepool_4",
    players: 4,
    minQue: 5,
    maxQue: 10,
  },
  {
    id: 5,
    gameType: "Rummy_1",
    gameMode: "Quick Match",
    tier: "Basic",
    entryFee: 200,
    prizepool: "prizepool_1",
    players: 8,
    minQue: 4,
    maxQue: 9,
  },
];

export const dummyPrizepools = [
  {
    id: "prizepool_1",
    prizeData: [
      { min: 1, max: 1, amount: 70 },
      { min: 2, max: 2, amount: 30 },
    ],
  },
  {
    id: "prizepool_2",
    prizeData: [
      { min: 1, max: 1, amount: 250 },
      { min: 2, max: 3, amount: 100 },
      { min: 4, max: 4, amount: 50 },
    ],
  },
  {
    id: "prizepool_3",
    prizeData: [
      { min: 1, max: 1, amount: 400 },
      { min: 2, max: 3, amount: 200 },
      { min: 4, max: 6, amount: 120 },
    ],
  },
  {
    id: "prizepool_4",
    prizeData: [
      { min: 1, max: 1, amount: 400 },
      { min: 2, max: 3, amount: 150 },
      { min: 4, max: 5, amount: 50 },
    ],
  },
  {
    id: "prizepool_5",
    prizeData: [
      { min: 1, max: 1, amount: 900 },
      { min: 2, max: 2, amount: 400 },
      { min: 3, max: 4, amount: 300 },
      { min: 5, max: 8, amount: 300 },
    ],
  },
];

export const gameConfig = [
  {
    name: "Ludo",
    modes: ["Classic", "Tournament"],
    tiers: ["Bronze", "Silver", "Gold"],
    playerCount: [2, 4],
  },
  {
    name: "Rummy",
    modes: ["Quick Match", "Points", "Pool"],
    tiers: ["Basic", "Pro", "Elite"],
    playerCount: [2, 4, 6, 8],
  },
];
