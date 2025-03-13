// All objects that are required to be passed as JSON from backend.
export const echoes = [
  {
    text: "Michael Lyu is homesome.",
    images: ["/Navbar/brand.png", "/logo.png"],
    author: "David",
    date: "2024-04-08",
    id: 1,
    likeCount: 100,
    repostCount: 10,
    comments: [
      {
        text: "Great echo!",
        author: "Anthony",
        date: "2024-04-08",
      },
      {
        text: "Good.",
        author: "Gary",
        date: "2024-04-08",
      },
    ],
  },
  {
    text: "Love CSCI3100.",
    images: ["/Navbar/brand.png"],
    author: "Gary",
    date: "2024-04-03",
    id: 2,
    likeCount: 48,
    repostCount: 8,
  },
  {
    text: "Working on Backend.",
    author: "Anthony",
    date: "2024-04-05",
    id: 3,
    likeCount: 150,
    repostCount: 0,
  },
  {
    text: "Working on Backend.",
    images: ["/Navbar/brand.png"],
    author: "Amy",
    date: "2024-04-03",
    id: 2,
    likeCount: 500,
    repostCount: 3,
  },
];

export const users = [
  {
    name: "David",
    email: "1155174302@link.cuhk.edu.hk",
    birthday: "2000-01-02",
    gender: "Male",
    country: "Hong Kong",
    type: "Public",
    repostid: [3],
    admin: "true",
  },
  {
    name: "Anthony",
    email: "N/A",
    birthday: "2000-01-02",
    gender: "Male",
    country: "Hong Kong",
    type: "Private",
  },
  {
    name: "Gary",
    email: "N/A",
    birthday: "2000-01-02",
    gender: "Male",
    country: "Hong Kong",
    type: "Public",
  },
  {
    name: "Amy",
    email: "N/A",
    birthday: "2000-01-02",
    gender: "Male",
    country: "Hong Kong",
    type: "Public",
  },
  {
    name: "Bob",
    email: "N/A",
    birthday: "2000-01-02",
    gender: "Male",
    country: "Hong Kong",
    type: "Public",
  },
];

export const loggedInUser = {
  name: "David",
};

export const suspendedEchoes = {
  ids: [1, 2],
};

export const suspendedUsers = {
  names: ["David"],
};

export const recommendedUsers = {
  names: ["Anthony", "Gary", "Amy", "Bob"],
};

export const usersWhoRequested = {
  names: ["Gary", "Amy", "Anthony"],
};
