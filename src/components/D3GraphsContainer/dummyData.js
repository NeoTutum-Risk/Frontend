export const continentDummyData = [
  {
    name: "Asia",
    value: "v1-B",
  },
  {
    name: "Africa",
    value: "v8-G",
  },
  {
    name: "Europe",
    value: "v3-I",
  },
  {
    name: "North America",
    value: "v8-G",
  },
  {
    name: "South America",
    value: "v5-D",
  },
  {
    name: "Australia/Oceania",
    value: "v10-A",
  },
  {
    name: "Antarctica",
    value: "v1-H",
  },
];

export const treeMapDummyData = [
  {
    name: "Origin",
    parent: "",
    value: "",
  },
  {
    name: "Asia",
    parent: "Origin",
    value: 12,
  },
  {
    name: "Africa",
    parent: "Origin",
    value: 23,
    children: [
      {
        name: "Origin",
        parent: "",
        value: "",
      },
      {
        name: "Africa_CPM.DI.1",
        parent: "Origin",
        value: 56,
        children: [
          {
            name: "Origin",
            parent: "",
            value: "",
          },
          {
            name: "Africa_CPM.DI.1.V1",
            parent: "Origin",
            value: 47,
          },
          {
            name: "Africa_CPM.DI.1.V2",
            parent: "Origin",
            value: 29,
          },
          {
            name: "Africa_CPM.DI.1.V3",
            parent: "Origin",
            value: 60,
          },
          {
            name: "Africa_CPM.DI.1.V4",
            parent: "Origin",
            value: 55,
          },
        ],
      },
      {
        name: "Africa_CPM.DI.2",
        parent: "Origin",
        value: 93,
      },
      {
        name: "Africa_CPM.DI.3",
        parent: "Origin",
        value: 43,
      },
      {
        name: "Africa_CPM.DI.4",
        parent: "Origin",
        value: 29,
      },
    ],
  },
  {
    name: "Europe",
    parent: "Origin",
    value: 11,
    children: [
      {
        name: "Origin",
        parent: "",
        value: "",
      },
      {
        name: "Europe_CPM.DI.1",
        parent: "Origin",
        value: 56,
      },
      {
        name: "Europe_CPM.DI.2",
        parent: "Origin",
        value: 34,
      },
    ],
  },
  {
    name: "North America",
    parent: "Origin",
    value: 40,
    children: [
      {
        name: "Origin",
        parent: "",
        value: "",
      },
      {
        name: "North_America_CPM.DI.1",
        parent: "Origin",
        value: 56,
      },
      {
        name: "North_America_CPM.DI.2",
        parent: "Origin",
        value: 80,
      },
    ],
  },
  {
    name: "South America",
    parent: "Origin",
    value: 30,
  },
  {
    name: "Australia/Oceania",
    parent: "Origin",
    value: 25,
  },
  {
    name: "Antarctica",
    parent: "Origin",
    value: 6,
  },
];

export const DUMMY_DATA = [
  {
    id: "d1",
    region: "USA",
    continent: "North America",
    value: 10,
    children: [
      { id: "d1.c1", region: "Texas", value: 20 },
      { id: "d1.c2", region: "pennsylvania", value: 30 },
    ],
  },
  { id: "d2", region: "India", continent: "Asia", value: 12 },
  { id: "d3", region: "China", continent: "Asia", value: 11 },
  { id: "d4", region: "Germany", continent: "Europe", value: 6 },
  {
    id: "d5",
    region: "Egypt",
    continent: "Africa",
    value: 15,
    children: [
      {
        id: "d5.c1",
        region: "Alexandria",
        value: 50,
        children: [
          { id: "d5.c1.c1", region: "Smouha", value: 5 },
          { id: "d5.c1.c2", region: "Gleem", value: 66 },
          { id: "d5.c1.c3", region: "Sidi-Gaber", value: 23 },
          { id: "d5.c1.c4", region: "Miami", value: 54 },
        ],
      },
      {
        id: "d5.c2",
        region: "Cairo",
        value: 10,
        children: [
          { id: "d5.c2.c1", region: "New Cairo", value: 76 },
          { id: "d5.c2.c2", region: "Al Sheikh Zayd", value: 54 },
          { id: "d5.c2.c3", region: "Nasr City", value: 45 },
        ],
      },
      { id: "d1.c3", region: "Giza", value: 20 },
    ],
  },
  {
    id: "d6",
    region: "Canada",
    continent: "North America",
    value: 78,
  },
  {
    id: "d7",
    region: "Cameron",
    continent: "Africa",
    value: 23,
  },
  {
    id: "d8",
    region: "England",
    continent: "Europe",
    value: 76,
  },
  {
    id: "d9",
    region: "Morocco",
    continent: "Africa",
    value: 43,
  },
];

export const connectedScatterDummyData = [
    {
      label: "0.56 - 0.648",
      value: 0.000402133297039506654,
    },
    {
      label: "0.648 - 0.736",
      value: 0.005615725131330697,
    },
    {
      label: "0.736 - 0.758",
      value: 0.004637819673000948,
    },
    {
      label: "0.758 - 0.78",
      value: 0.007488502587615634,
    },
    {
      label: "0.78 - 0.802",
      value: 0.011582934193117846,
    },
    {
      label: "0.802 - 0.824",
      value: 0.01715978033259942,
    },
    {
      label: "0.824 - 0.846",
      value: 0.02434489109009399,
    },
    {
      label: "0.846 - 0.868",
      value: 0.03307108178699752,
    },
    {
      label: "0.868 - 0.89",
      value: 0.04301107263502687,
    },
    {
      label: "0.89 - 0.912",
      value: 0.05354998212422668,
    },
    {
      label: "0.912 - 0.934",
      value: 0.06381864788174335,
    },
    {
      label: "0.934 - 0.9560000000000001",
      value: 0.07279730522518615,
    },
    {
      label: "0.9560000000000001 - 0.9780000000000001",
      value: 0.07947665381251827,
    },
    {
      label: "0.9780000000000001 - 1.0",
      value: 0.08304347022950312,
    },
    {
      label: "1.0 - 1.022",
      value: 0.08304347022950312,
    },
    {
      label: "1.022 - 1.044",
      value: 0.07947665381251827,
    },
    {
      label: "1.044 - 1.066",
      value: 0.07279730522518615,
    },
    {
      label: "1.066 - 1.088",
      value: 0.06381864788174335,
    },
    {
      label: "1.088 - 1.11",
      value: 0.05354998212422668,
    },
    {
      label: "1.11 - 1.1320000000000001",
      value: 0.04301107263502687,
    },
    {
      label: "1.1320000000000001 - 1.1540000000000001",
      value: 0.03307108178699752,
    },
    {
      label: "1.1540000000000001 - 1.176",
      value: 0.02434489109009399,
    },
    {
      label: "1.176 - 1.198",
      value: 0.01715978033259942,
    },
    {
      label: "1.198 - 1.22",
      value: 0.011582934193117846,
    },
    {
      label: "1.22 - 1.242",
      value: 0.007488502587615634,
    },
    {
      label: "1.242 - 1.264",
      value: 0.004637819673000948,
    },
    {
      label: "1.264 - 1.352",
      value: 0.005615725131330697,
    },
    {
      label: "1.352 - 1.44",
      value: 0.000402133297039506654,
    },
  ];

export const heatmapDummyData = [
  {
    group: "A",
    variable: "v1",
    value: 1,
  },
  {
    group: "A",
    variable: "v2",
    value: 23,
  },
  {
    group: "A",
    variable: "v3",
    value: 15,
  },
  {
    group: "A",
    variable: "v4",
    value: 21,
  },
  {
    group: "A",
    variable: "v5",
    value: 13,
  },
  {
    group: "A",
    variable: "v6",
    value: 17,
  },
  {
    group: "A",
    variable: "v7",
    value: 18,
  },
  {
    group: "A",
    variable: "v8",
    value: 30,
  },
  {
    group: "A",
    variable: "v9",
    value: 29,
  },
  {
    group: "A",
    variable: "v10",
    value: 20,
  },
  {
    group: "B",
    variable: "v1",
    value: 28,
  },
  {
    group: "B",
    variable: "v2",
    value: 5,
  },
  {
    group: "B",
    variable: "v3",
    value: 1,
  },
  {
    group: "B",
    variable: "v4",
    value: 3,
  },
  {
    group: "B",
    variable: "v5",
    value: 6,
  },
  {
    group: "B",
    variable: "v6",
    value: 10,
  },
  {
    group: "B",
    variable: "v7",
    value: 8,
  },
  {
    group: "B",
    variable: "v8",
    value: 31,
  },
  {
    group: "B",
    variable: "v9",
    value: 35,
  },
  {
    group: "B",
    variable: "v10",
    value: 60,
  },
  {
    group: "C",
    variable: "v1",
    value: 24,
  },
  {
    group: "C",
    variable: "v2",
    value: 23,
  },
  {
    group: "C",
    variable: "v3",
    value: 53,
  },
  {
    group: "C",
    variable: "v4",
    value: 52,
  },
  {
    group: "C",
    variable: "v5",
    value: 42,
  },
  {
    group: "C",
    variable: "v6",
    value: 32,
  },
  {
    group: "C",
    variable: "v7",
    value: 35,
  },
  {
    group: "C",
    variable: "v8",
    value: 38,
  },
  {
    group: "C",
    variable: "v9",
    value: 67,
  },
  {
    group: "C",
    variable: "v10",
    value: 61,
  },
  {
    group: "D",
    variable: "v1",
    value: 2,
  },
  {
    group: "D",
    variable: "v2",
    value: 7,
  },
  {
    group: "D",
    variable: "v3",
    value: 33,
  },
  {
    group: "D",
    variable: "v4",
    value: 34,
  },
  {
    group: "D",
    variable: "v5",
    value: 55,
  },
  {
    group: "D",
    variable: "v6",
    value: 50,
  },
  {
    group: "D",
    variable: "v7",
    value: 51,
  },
  {
    group: "D",
    variable: "v8",
    value: 69,
  },
  {
    group: "D",
    variable: "v9",
    value: 91,
  },
  {
    group: "D",
    variable: "v10",
    value: 95,
  },
  {
    group: "E",
    variable: "v1",
    value: 4,
  },
  {
    group: "E",
    variable: "v2",
    value: 23,
  },
  {
    group: "E",
    variable: "v3",
    value: 35,
  },
  {
    group: "E",
    variable: "v4",
    value: 48,
  },
  {
    group: "E",
    variable: "v5",
    value: 66,
  },
  {
    group: "E",
    variable: "v6",
    value: 79,
  },
  {
    group: "E",
    variable: "v7",
    value: 80,
  },
  {
    group: "E",
    variable: "v8",
    value: 90,
  },
  {
    group: "E",
    variable: "v9",
    value: 120,
  },
  {
    group: "E",
    variable: "v10",
    value: 110,
  },
  {
    group: "F",
    variable: "v1",
    value: 22,
  },
  {
    group: "F",
    variable: "v2",
    value: 29,
  },
  {
    group: "F",
    variable: "v3",
    value: 34,
  },
  {
    group: "F",
    variable: "v4",
    value: 55,
  },
  {
    group: "F",
    variable: "v5",
    value: 61,
  },
  {
    group: "F",
    variable: "v6",
    value: 66,
  },
  {
    group: "F",
    variable: "v7",
    value: 64,
  },
  {
    group: "F",
    variable: "v8",
    value: 73,
  },
  {
    group: "F",
    variable: "v9",
    value:114,
  },
  {
    group: "F",
    variable: "v10",
    value: 150,
  },
  {
    group: "G",
    variable: "v1",
    value: 5,
  },
  {
    group: "G",
    variable: "v2",
    value: 10,
  },
  {
    group: "G",
    variable: "v3",
    value: 37,
  },
  {
    group: "G",
    variable: "v4",
    value: 49,
  },
  {
    group: "G",
    variable: "v5",
    value: 76,
  },
  {
    group: "G",
    variable: "v6",
    value: 82,
  },
  {
    group: "G",
    variable: "v7",
    value: 100,
  },
  {
    group: "G",
    variable: "v8",
    value: 150,
  },
  {
    group: "G",
    variable: "v9",
    value: 130,
  },
  {
    group: "G",
    variable: "v10",
    value: 134,
  },
  {
    group: "H",
    variable: "v1",
    value: 8,
  },
  {
    group: "H",
    variable: "v2",
    value: 9,
  },
  {
    group: "H",
    variable: "v3",
    value: 52,
  },
  {
    group: "H",
    variable: "v4",
    value: 58,
  },
  {
    group: "H",
    variable: "v5",
    value: 69,
  },
  {
    group: "H",
    variable: "v6",
    value: 90,
  },
  {
    group: "H",
    variable: "v7",
    value: 112,
  },
  {
    group: "H",
    variable: "v8",
    value: 130,
  },
  {
    group: "H",
    variable: "v9",
    value: 150,
  },
  {
    group: "H",
    variable: "v10",
    value: 143,
  },
  {
    group: "I",
    variable: "v1",
    value: 13,
  },
  {
    group: "I",
    variable: "v2",
    value: 33,
  },
  {
    group: "I",
    variable: "v3",
    value: 66,
  },
  {
    group: "I",
    variable: "v4",
    value: 95,
  },
  {
    group: "I",
    variable: "v5",
    value: 100,
  },
  {
    group: "I",
    variable: "v6",
    value: 110,
  },
  {
    group: "I",
    variable: "v7",
    value: 130,
  },
  {
    group: "I",
    variable: "v8",
    value: 138,
  },
  {
    group: "I",
    variable: "v9",
    value: 140,
  },
  {
    group: "I",
    variable: "v10",
    value: 145,
  },
  {
    group: "J",
    variable: "v1",
    value: 4,
  },
  {
    group: "J",
    variable: "v2",
    value: 31,
  },
  {
    group: "J",
    variable: "v3",
    value: 90,
  },
  {
    group: "J",
    variable: "v4",
    value: 104,
  },
  {
    group: "J",
    variable: "v5",
    value: 108,
  },
  {
    group: "J",
    variable: "v6",
    value: 121,
  },
  {
    group: "J",
    variable: "v7",
    value: 125,
  },
  {
    group: "J",
    variable: "v8",
    value: 133,
  },
  {
    group: "J",
    variable: "v9",
    value: 146,
  },
  {
    group: "J",
    variable: "v10",
    value: 150,
  },
];
