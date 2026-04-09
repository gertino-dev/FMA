export const LOCAL_MEDIA_IMAGES = [
  "/image/WhatsApp Image 2026-04-08 at 19.31.06.jpeg",
  "/image/WhatsApp Image 2026-04-08 at 19.31.06 (1).jpeg",
  "/image/WhatsApp Image 2026-04-08 at 19.31.06 (2).jpeg",
  "/image/WhatsApp Image 2026-04-08 at 19.31.07.jpeg",
  "/image/WhatsApp Image 2026-04-08 at 19.31.07 (1).jpeg",
  "/image/WhatsApp Image 2026-04-08 at 19.31.07 (2).jpeg",
  "/image/WhatsApp Image 2026-04-08 at 19.31.08.jpeg",
  "/image/WhatsApp Image 2026-04-08 at 19.31.09.jpeg",
  "/image/WhatsApp Image 2026-04-08 at 19.31.09 (1).jpeg",
  "/image/WhatsApp Image 2026-04-08 at 19.31.09 (2).jpeg",
  "/image/WhatsApp Image 2026-04-08 at 19.31.10.jpeg",
  "/image/WhatsApp Image 2026-04-08 at 19.31.21.jpeg",
  "/image/WhatsApp Image 2026-04-08 at 19.31.21 (1).jpeg",
  "/image/WhatsApp Image 2026-04-08 at 19.31.21 (2).jpeg",
  "/image/WhatsApp Image 2026-04-08 at 19.31.22.jpeg",
];

const pickImage = (n: number) => LOCAL_MEDIA_IMAGES[(n - 1) % LOCAL_MEDIA_IMAGES.length];

export const ATHLETES = [
  {
    id: 1,
    name: "Sidonie Fiadanantsoa",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "100m Haies",
    rank: 1,
    performance: "12.85s",
    image: pickImage(1)
  },
  {
    id: 2,
    name: "Claudine Nomenjanahary",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "100m / 200m",
    rank: 2,
    performance: "11.42s / 23.45s",
    image: pickImage(2)
  },
  {
    id: 3,
    name: "Franck Todisoa",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "200m",
    rank: 3,
    performance: "20.80s",
    image: pickImage(3)
  },
  {
    id: 4,
    name: "Lorrie Haoniriana",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "100m",
    rank: 4,
    performance: "11.60s",
    image: pickImage(4)
  },
  {
    id: 5,
    name: "Tsiry Manampisoa",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "400m",
    rank: 5,
    performance: "46.90s",
    image: pickImage(5)
  },
  {
    id: 6,
    name: "Eliane Saholinirina",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "3000m Steeple",
    rank: 6,
    performance: "9:44.50",
    image: pickImage(6)
  },
  {
    id: 7,
    name: "Ali Kamé",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "Décathlon",
    rank: 7,
    performance: "7685 pts",
    image: pickImage(7)
  },
  {
    id: 8,
    name: "Vanessa Embony",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "100m / 200m",
    rank: 8,
    performance: "11.62s",
    image: pickImage(8)
  },
  {
    id: 9,
    name: "Jean-Louis Ravelomanantsoa",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "100m",
    rank: 9,
    performance: "10.18s",
    image: pickImage(9)
  },
  {
    id: 10,
    name: "Rosa Rakotozafy",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "100m Haies",
    rank: 10,
    performance: "12.84s",
    image: pickImage(10)
  },
  {
    id: 11,
    name: "Toussaint Rabenala",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "Triple Saut",
    rank: 11,
    performance: "17.05m",
    image: pickImage(11)
  },
  {
    id: 12,
    name: "Doris Ratsimbazafy",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "Lancer de Poids",
    rank: 12,
    performance: "15.20m",
    image: pickImage(12)
  },
  {
    id: 13,
    name: "RAKOTONARY Zo Henintsoa",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "100m",
    rank: 1,
    performance: "12''52",
    image: pickImage(13)
  },
  {
    id: 14,
    name: "NOMENJANAHARY Francia",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "3000m",
    rank: 2,
    performance: "10'26''56",
    image: pickImage(14)
  },
  {
    id: 15,
    name: "RAZANAMANDROSO Florentine",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "100m",
    rank: 3,
    performance: "12''76",
    image: pickImage(15)
  },
  {
    id: 16,
    name: "RABEARISON Franck",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "400m Haies",
    rank: 1,
    performance: "53''67",
    image: pickImage(1)
  },
  {
    id: 17,
    name: "REMANDRO Patrice",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "400m Plat",
    rank: 1,
    performance: "48''33",
    image: pickImage(2)
  },
  {
    id: 18,
    name: "RANDRIANARIVOSON Jean Val",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "800m",
    rank: 1,
    performance: "1'57''05",
    image: pickImage(3)
  },
  {
    id: 19,
    name: "EMBONY Andy",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "200m",
    rank: 1,
    performance: "26''1",
    image: pickImage(4)
  },
  {
    id: 20,
    name: "ANDRIANJAFY Anna",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "400m Haies",
    rank: 1,
    performance: "1'05''82",
    image: pickImage(5)
  },
  {
    id: 21,
    name: "RAZANAJOELINA Fazia",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "800m",
    rank: 1,
    performance: "2'28''89",
    image: pickImage(6)
  },
  {
    id: 22,
    name: "ERIC Justin",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "100m",
    rank: 1,
    performance: "10''7",
    image: pickImage(7)
  },
  {
    id: 23,
    name: "HERY Manassé",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "Longueur",
    rank: 1,
    performance: "6m69",
    image: pickImage(8)
  },
  {
    id: 24,
    name: "RABETINIAINA Mickaël",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "800m",
    rank: 1,
    performance: "2'01''65",
    image: pickImage(9)
  },
  {
    id: 25,
    name: "RAKOTONDRAMARO Anjaratiana",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "200m",
    rank: 1,
    performance: "26''9",
    image: pickImage(10)
  },
  {
    id: 26,
    name: "RASOANIRINA Patricia",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "100m Haies",
    rank: 1,
    performance: "17''91",
    image: pickImage(11)
  },
  {
    id: 27,
    name: "HENDRITIANA Annah",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "2000m Steeple",
    rank: 1,
    performance: "8'29''66",
    image: pickImage(12)
  },
  {
    id: 28,
    name: "RATIARIVO Ryaz",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "110m Haies",
    rank: 1,
    performance: "15''65",
    image: pickImage(13)
  },
  {
    id: 29,
    name: "NATOLOJANAHARY Amed J",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "800m",
    rank: 1,
    performance: "2'01''50",
    image: pickImage(14)
  },
  {
    id: 30,
    name: "RAMIARAMANITRA Fanomezantsoa",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "Longueur",
    rank: 1,
    performance: "5m82",
    image: pickImage(15)
  },
  {
    id: 31,
    name: "RANDRIANARISOA Mamisoa",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "400m Plat",
    rank: 2,
    performance: "49''50",
    image: pickImage(1)
  },
  {
    id: 32,
    name: "RANDRIAMANDRESY Elia",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "400m Haies",
    rank: 2,
    performance: "57''75",
    image: pickImage(2)
  },
  {
    id: 33,
    name: "RAHERINANTENAINA Faniry",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "400m Haies",
    rank: 3,
    performance: "1'01''60",
    image: pickImage(3)
  },
  {
    id: 34,
    name: "TSIRAVAY Junior",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "100m",
    rank: 2,
    performance: "11''5",
    image: pickImage(4)
  },
  {
    id: 35,
    name: "RANDRIANOMENITOMPO Brutho",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "100m",
    rank: 3,
    performance: "11''90",
    image: pickImage(5)
  },
  {
    id: 36,
    name: "LADRY Simon",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "100m",
    rank: 1,
    performance: "11''10",
    image: pickImage(6)
  },
  {
    id: 37,
    name: "RASOAMANAMBINA Esperance",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "100m",
    rank: 3,
    performance: "12''80",
    image: pickImage(7)
  },
  {
    id: 38,
    name: "RAKOTONIAINA Tsilavina",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "100m",
    rank: 2,
    performance: "11''1",
    image: pickImage(8)
  },
  {
    id: 39,
    name: "VONJNAINA Angela",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "100m",
    rank: 3,
    performance: "11''2",
    image: pickImage(9)
  },
  {
    id: 40,
    name: "RAFENOMANGA Niaina",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "800m",
    rank: 2,
    performance: "2'04''15",
    image: pickImage(10)
  },
  {
    id: 41,
    name: "RANDRIANASOLO Fanirintsoa",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "800m",
    rank: 3,
    performance: "2'06''05",
    image: pickImage(11)
  },
  {
    id: 42,
    name: "RAKOTOARIMANANA Adrien",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "Longueur",
    rank: 2,
    performance: "5m19",
    image: pickImage(12)
  },
  {
    id: 43,
    name: "HAJAMALALA Fifaliana",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "Longueur",
    rank: 3,
    performance: "4m83",
    image: pickImage(13)
  },
  {
    id: 44,
    name: "RASOAMANANTENA Angela",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "400m Haies",
    rank: 2,
    performance: "1'16''12",
    image: pickImage(14)
  },
  {
    id: 45,
    name: "RADONIAINA Natacha",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "400m Haies",
    rank: 3,
    performance: "1'29''43",
    image: pickImage(15)
  },
  {
    id: 46,
    name: "RAFARASOA Mialy",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "200m",
    rank: 2,
    performance: "26''6",
    image: pickImage(1)
  },
  {
    id: 47,
    name: "NAMBINDRAZANA Fazinah",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "200m",
    rank: 3,
    performance: "27''4",
    image: pickImage(2)
  },
  {
    id: 48,
    name: "RABENARIVO Bernard",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "110m",
    rank: 2,
    performance: "16''09",
    image: pickImage(3)
  },
  {
    id: 49,
    name: "RAHAJANANDRASANA Allan",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "110m",
    rank: 3,
    performance: "19''52",
    image: pickImage(4)
  },
  {
    id: 50,
    name: "RAZAFIMBOLOLONA Harena",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "800m",
    rank: 2,
    performance: "2'04''73",
    image: pickImage(5)
  },
  {
    id: 51,
    name: "RAHARINIAINA Feno",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "800m",
    rank: 3,
    performance: "2'09''20",
    image: pickImage(6)
  },
  {
    id: 52,
    name: "HARENASOA Stéphanat",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "200m",
    rank: 2,
    performance: "27''3",
    image: pickImage(7)
  },
  {
    id: 53,
    name: "LEBEGUE Candicia",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "200m",
    rank: 3,
    performance: "27''8",
    image: pickImage(8)
  },
  {
    id: 54,
    name: "RATOVOARIMANONJA Fabrice",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "100m Haies",
    rank: 1,
    performance: "11''1",
    image: pickImage(9)
  },
  {
    id: 55,
    name: "RATIANARIVO Benjamin",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "100m Haies",
    rank: 2,
    performance: "11''4",
    image: pickImage(10)
  },
  {
    id: 56,
    name: "RIVONIAINA Sarobidy",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "100m Haies",
    rank: 3,
    performance: "11''5",
    image: pickImage(11)
  },
  {
    id: 57,
    name: "ANJARATIANA MAMISOA",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "100m",
    rank: 1,
    performance: "13''05",
    image: pickImage(12)
  },
  {
    id: 58,
    name: "HARENASOA STEPHANIE",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "100m",
    rank: 2,
    performance: "13''25",
    image: pickImage(13)
  },
  {
    id: 59,
    name: "VELO IVANAH",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "100m",
    rank: 4,
    performance: "13''62",
    image: pickImage(14)
  },
  {
    id: 60,
    name: "MAMINIAINA ANTHONIO",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "400m Haies",
    rank: 2,
    performance: "1'00''30",
    image: pickImage(15)
  },
  {
    id: 61,
    name: "DRAKY MAYA CHRISTINA",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "2000m Steeple",
    rank: 2,
    performance: "8'33''10",
    image: pickImage(1)
  },
  {
    id: 62,
    name: "HERINIAINA ELYSE",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "3000m",
    rank: 1,
    performance: "8'42''5",
    image: pickImage(2)
  },
  {
    id: 63,
    name: "TSIMA TAHIANJANAHARY",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "3000m",
    rank: 2,
    performance: "9'11''72",
    image: pickImage(3)
  },
  {
    id: 64,
    name: "FIDEL HAVELOMA",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "3000m",
    rank: 3,
    performance: "9'29''35",
    image: pickImage(4)
  },
  {
    id: 65,
    name: "RATSIORISOA ALAIN",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "3000m",
    rank: 4,
    performance: "9'56''51",
    image: pickImage(5)
  },
  {
    id: 66,
    name: "RALISINIRINA MARTHE",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "3000m",
    rank: 2,
    performance: "10'41''91",
    image: pickImage(6)
  },
  {
    id: 67,
    name: "SENDRANIRINA M P",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "3000m",
    rank: 3,
    performance: "11'48''60",
    image: pickImage(7)
  },
  {
    id: 68,
    name: "RAFIDISON ODILE",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "Poids",
    rank: 1,
    performance: "8m52",
    image: pickImage(8)
  },
  {
    id: 69,
    name: "RASOLOHERITIANA LINA",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "800m",
    rank: 1,
    performance: "2'21''06",
    image: pickImage(9)
  },
  {
    id: 70,
    name: "HAINGONIAINA FRANCOISE",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "800m",
    rank: 2,
    performance: "2'27''37",
    image: pickImage(10)
  },
  {
    id: 71,
    name: "FINIAVANA HAMINTSOA",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "800m",
    rank: 2,
    performance: "2'48''84",
    image: pickImage(11)
  },
  {
    id: 72,
    name: "RALISOA JOHANA SYLVIENAH",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "100m",
    rank: 3,
    performance: "13''18",
    image: pickImage(12)
  },
  {
    id: 73,
    name: "RAVONIARINIANJA M Elina",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "800m",
    rank: 2,
    performance: "2'54''57",
    image: pickImage(13)
  },
  {
    id: 74,
    name: "RASOARIMALALA Fanomezantsoa",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "800m",
    rank: 3,
    performance: "2'56''57",
    image: pickImage(14)
  },
  {
    id: 75,
    name: "ANDRIANARIVONY Haranasoa",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "3000 SC",
    rank: 1,
    performance: "10'43''3",
    image: pickImage(15)
  },
  {
    id: 76,
    name: "RAHERINIAINA Njiva",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "3000 SC",
    rank: 2,
    performance: "10'51''2",
    image: pickImage(1)
  },
  {
    id: 77,
    name: "RASOLOFOSON Herinavalona",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "3000 SC",
    rank: 3,
    performance: "11'04''7",
    image: pickImage(2)
  },
  {
    id: 78,
    name: "RANARISON Odon",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "Longueur",
    rank: 1,
    performance: "6m69",
    image: pickImage(3)
  },
  {
    id: 79,
    name: "RAZAFIMAMONJY Fanomezantsoa",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "Longueur",
    rank: 2,
    performance: "6m63",
    image: pickImage(4)
  },
  {
    id: 80,
    name: "ANDRIAMIFIDY Diana",
    country: "Madagascar",
    flag: "🇲🇬",
    discipline: "Longueur",
    rank: 3,
    performance: "6m24",
    image: pickImage(5)
  }
];

export const COMPETITIONS = [
  {
    id: 202601,
    title: "TESTS épreuves pistes en vue des compétitions internationales",
    location: "Antananarivo (Tana)",
    date: "15 mars 2026",
    category: "National",
    status: "À venir",
    image: pickImage(13)
  },
  {
    id: 202602,
    title: "Championnat du monde en salle",
    location: "Torun (Pologne)",
    date: "20 au 22 mars 2026",
    category: "International",
    status: "À venir",
    image: pickImage(14)
  },
  {
    id: 202603,
    title: "Meeting St Denis",
    location: "La Réunion",
    date: "20 avril 2026",
    category: "International",
    status: "À venir",
    image: pickImage(15)
  },
  {
    id: 202604,
    title: "Course sur route « La vache qui rit » (2km, 4km, 15km)",
    location: "Antananarivo (Tana)",
    date: "26 avril 2026",
    category: "National",
    status: "À venir",
    image: pickImage(1)
  },
  {
    id: 202605,
    title: "Championnats de Madagascar Trails (Court et Long) — UTOP",
    location: "Antananarivo (Tana)",
    date: "1 au 3 mai 2026",
    category: "National",
    status: "À venir",
    image: pickImage(2)
  },
  {
    id: 202606,
    title: "24e Championnats d'Afrique seniors",
    location: "Accra (Ghana)",
    date: "12 au 17 mai 2026",
    category: "International",
    status: "À venir",
    image: pickImage(3)
  },
  {
    id: 202607,
    title: "SACA Championnats d'Afrique Austral U18 / U20",
    location: "Maurice",
    date: "05 au 07 juin 2026",
    category: "International",
    status: "À venir",
    image: pickImage(4)
  },
  {
    id: 202608,
    title: "Championnats de Madagascar Jeunes Piste",
    location: "Antananarivo (Tana)",
    date: "31 juillet au 02 août 2026",
    category: "National",
    status: "À venir",
    image: pickImage(5)
  },
  {
    id: 202609,
    title: "Championnats de Madagascar Séniors + Épreuves combinées (Piste)",
    location: "Antananarivo (Tana)",
    date: "07 au 09 août 2026",
    category: "National",
    status: "À venir",
    image: pickImage(6)
  },
  {
    id: 202610,
    title: "Sémi-marathon VIMA",
    location: "Majunga",
    date: "30 août 2026",
    category: "National",
    status: "À venir",
    image: pickImage(7)
  },
  {
    id: 202611,
    title: "Marathon International",
    location: "Antananarivo (Tana)",
    date: "10 au 11 octobre 2026",
    category: "National",
    status: "À venir",
    image: pickImage(8)
  },
  {
    id: 202612,
    title: "4e Youth Olympic Games",
    location: "Dakar",
    date: "31 octobre au 13 novembre 2026",
    category: "International",
    status: "À venir",
    image: pickImage(9)
  },
  {
    id: 202613,
    title: "Relais Marathon St Benoit",
    location: "La Réunion",
    date: "11 novembre 2026",
    category: "International",
    status: "À venir",
    image: pickImage(10)
  }
];

export const RESULTS_COMPETITIONS = [
  {
    id: 202603,
    title:
      "CHAMPIONNATS D’AFRIQUE SACA REGION SUD U18 U20 (MAURICE)\nCHAMPIONNATS D’AFRIQUE SENIORS (ACCRA GHANA)",
    location: "—",
    date: "14 ET 15 MARS 2026",
    category: "Sélection",
    status: "Résultats",
    image: pickImage(13),
  },
  {
    id: 2026032,
    title: "RESULTATS TEST 14 ET 15 MARS 2026\nU18 / U20 — ORDRE DE MÉRITE",
    location: "Madagascar",
    date: "14 ET 15 MARS 2026",
    category: "Ordre de mérite",
    status: "Résultats",
    image: pickImage(14),
  },
];

export const RANKINGS = [
  { id: 1, athlete: "REMANDRO Patrice", country: "Madagascar", category: "Senior Hommes", discipline: "400m Plat", points: 1021, trend: "up" },
  { id: 2, athlete: "RANDRIANARISOA Mamisoa", country: "Madagascar", category: "Senior Hommes", discipline: "400m Plat", points: 948, trend: "up" },
  { id: 3, athlete: "RABEARISON Franck", country: "Madagascar", category: "Senior Hommes", discipline: "400m Plat", points: 937, trend: "up" },

  { id: 4, athlete: "RABEARISON Franck", country: "Madagascar", category: "Senior Hommes", discipline: "400m Haies", points: 955, trend: "up" },
  { id: 5, athlete: "RANDRIAMANDRESY Elia", country: "Madagascar", category: "Senior Hommes", discipline: "400m Haies", points: 778, trend: "stable" },
  { id: 6, athlete: "RAHERINANTENAINA Faniry", country: "Madagascar", category: "Senior Hommes", discipline: "400m Haies", points: 627, trend: "stable" },

  { id: 7, athlete: "LADRY Simon", country: "Madagascar", category: "Senior Hommes", discipline: "100m", points: 857, trend: "up" },
  { id: 8, athlete: "TSIRAVAY Junior", country: "Madagascar", category: "Senior Hommes", discipline: "100m", points: 707, trend: "stable" },
  { id: 9, athlete: "RANDRIANOMENITOMPO Brutho", country: "Madagascar", category: "Senior Hommes", discipline: "100m", points: 640, trend: "stable" },

  { id: 10, athlete: "RAKOTONARY Zo Henintsoa", country: "Madagascar", category: "Senior Dames", discipline: "100m", points: 891, trend: "up" },
  { id: 11, athlete: "RAZANAMANDROSO Florentine", country: "Madagascar", category: "Senior Dames", discipline: "100m", points: 846, trend: "up" },
  { id: 12, athlete: "RASOAMANAMBINA Esperance", country: "Madagascar", category: "Senior Dames", discipline: "100m", points: 839, trend: "up" },

  { id: 13, athlete: "ERIC Justin", country: "Madagascar", category: "U20 Hommes", discipline: "100m", points: 934, trend: "up" },
  { id: 14, athlete: "RAKOTONIAINA Tsilavina", country: "Madagascar", category: "U20 Hommes", discipline: "100m", points: 817, trend: "stable" },
  { id: 15, athlete: "VONJNAINA Angela", country: "Madagascar", category: "U20 Hommes", discipline: "100m", points: 789, trend: "stable" },

  { id: 16, athlete: "RABETINIAINA Mickaël", country: "Madagascar", category: "U20 Hommes", discipline: "800m", points: 721, trend: "up" },
  { id: 17, athlete: "RAFENOMANGA Niaina", country: "Madagascar", category: "U20 Hommes", discipline: "800m", points: 662, trend: "stable" },
  { id: 18, athlete: "RANDRIANASOLO Fanirintsoa", country: "Madagascar", category: "U20 Hommes", discipline: "800m", points: 619, trend: "stable" },

  { id: 19, athlete: "HERY Manassé", country: "Madagascar", category: "U20 Hommes", discipline: "Longueur", points: 856, trend: "up" },
  { id: 20, athlete: "RAKOTOARIMANANA Adrien", country: "Madagascar", category: "U20 Hommes", discipline: "Longueur", points: 541, trend: "stable" },
  { id: 21, athlete: "HAJAMALALA Fifaliana", country: "Madagascar", category: "U20 Hommes", discipline: "Longueur", points: 467, trend: "stable" },

  { id: 22, athlete: "ANDRIANJAFY Anna", country: "Madagascar", category: "U20 Dames", discipline: "400m Haies", points: 859, trend: "up" },
  { id: 23, athlete: "RASOAMANANTENA Angela", country: "Madagascar", category: "U20 Dames", discipline: "400m Haies", points: 605, trend: "stable" },
  { id: 24, athlete: "RADONIAINA Natacha", country: "Madagascar", category: "U20 Dames", discipline: "400m Haies", points: 343, trend: "stable" },

  { id: 25, athlete: "EMBONY Andy", country: "Madagascar", category: "U20 Filles", discipline: "200m", points: 831, trend: "up" },
  { id: 26, athlete: "RAFARASOA Mialy", country: "Madagascar", category: "U20 Filles", discipline: "200m", points: 789, trend: "up" },
  { id: 27, athlete: "NAMBINDRAZANA Fazinah", country: "Madagascar", category: "U20 Filles", discipline: "200m", points: 723, trend: "stable" },

  { id: 28, athlete: "RATIARIVO Ryaz", country: "Madagascar", category: "U18 Garçons", discipline: "110m", points: 789, trend: "up" },
  { id: 29, athlete: "RABENARIVO Bernard", country: "Madagascar", category: "U18 Garçons", discipline: "110m", points: 722, trend: "stable" },
  { id: 30, athlete: "RAHAJANANDRASANA Allan", country: "Madagascar", category: "U18 Garçons", discipline: "110m", points: 302, trend: "down" },

  { id: 31, athlete: "NATOLOJANAHARY Amed J", country: "Madagascar", category: "U18 Garçons", discipline: "800m", points: 724, trend: "up" },
  { id: 32, athlete: "RAZAFIMBOLOLONA Harena", country: "Madagascar", category: "U18 Garçons", discipline: "800m", points: 649, trend: "stable" },
  { id: 33, athlete: "RAHARINIAINA Feno", country: "Madagascar", category: "U18 Garçons", discipline: "800m", points: 551, trend: "stable" },

  { id: 34, athlete: "RAKOTONDRAMARO Anjaratiana", country: "Madagascar", category: "U18 Filles", discipline: "200m", points: 764, trend: "up" },
  { id: 35, athlete: "HARENASOA Stéphanat", country: "Madagascar", category: "U18 Filles", discipline: "200m", points: 739, trend: "stable" },
  { id: 36, athlete: "LEBEGUE Candicia", country: "Madagascar", category: "U18 Filles", discipline: "200m", points: 691, trend: "stable" },

  { id: 37, athlete: "RATOVOARIMANONJA Fabrice", country: "Madagascar", category: "U18 Garçons", discipline: "100m Haies", points: 817, trend: "up" },
  { id: 38, athlete: "RATIANARIVO Benjamin", country: "Madagascar", category: "U18 Garçons", discipline: "100m Haies", points: 734, trend: "stable" },
  { id: 39, athlete: "RIVONIAINA Sarobidy", country: "Madagascar", category: "U18 Garçons", discipline: "100m Haies", points: 707, trend: "stable" }
];

export const NEWS = [
  {
    id: 1,
    title: "Sidonie Fiadanantsoa brille aux Championnats d'Afrique",
    category: "Performance",
    date: "Il y a 2 heures",
    image: pickImage(1)
  },
  {
    id: 2,
    title: "Nouveaux records nationaux battus à Alarobia",
    category: "Records",
    date: "Il y a 5 heures",
    image: pickImage(2)
  },
  {
    id: 3,
    title: "Préparation intense pour les Jeux des Îles 2027",
    category: "National",
    date: "Hier",
    image: pickImage(3)
  },
  {
    id: 4,
    title: "Inauguration du nouveau centre de haute performance",
    category: "Infrastructure",
    date: "2 jours",
    image: pickImage(4)
  },
  {
    id: 5,
    title: "L'athlétisme scolaire en plein essor à Madagascar",
    category: "Jeunesse",
    date: "3 jours",
    image: pickImage(5)
  }
];
