import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { Page, Competition } from '../types';
import { CompetitionImage } from './CompetitionImage';

interface ResultsDetailPageProps {
  competition: Competition | null;
  setPage: (p: Page) => void;
}

export const ResultsDetailPage = ({ competition, setPage }: ResultsDetailPageProps) => {
  if (!competition) return null;

  type ResultRow = {
    dossard: string;
    rang: string;
    nomPrenoms: string;
    club: string;
    perf: string;
    points?: string;
  };

  type ResultEvent = {
    epreuve: string;
    categorie: string;
    genre: string;
    rows: ResultRow[];
  };

  type MeritRow = {
    ordre: string;
    nomPrenoms: string;
    club: string;
    perf: string;
    points: string;
  };

  type MeritGroup = {
    groupe: string;
    epreuve: string;
    categorie: string;
    genre: string;
    rows: MeritRow[];
  };

  const header = {
    title: competition.title,
    date: competition.date,
  };

  const isOrdreMerite = competition.id === 2026032;
  const isChampionnatsAfrique = competition.id === 202603;

  const meritGroups: MeritGroup[] = [
    {
      groupe: "U18 FILLES",
      epreuve: "100m",
      categorie: "Cadette",
      genre: "Filles",
      rows: [
        { ordre: "1ère", nomPrenoms: "RAKOTONDRAMARO Anjaratiana", club: "ASFAN Alaotra mangoro", perf: "13’’05", points: "794" },
      ],
    },
    {
      groupe: "U18 FILLES",
      epreuve: "200 m",
      categorie: "U18",
      genre: "Filles",
      rows: [
        { ordre: "2ème", nomPrenoms: "RAKOTONDRAMARO Anjaratiana", club: "ASF Alaotra Mangoro", perf: "26’’9", points: "764" },
      ],
    },
    {
      groupe: "U18 FILLES",
      epreuve: "2000m steeple",
      categorie: "U18",
      genre: "Fille",
      rows: [
        { ordre: "3ème", nomPrenoms: "HENDRITIANA ANNAH", club: "CAMI ITASY", perf: "8’29’’66", points: "648" },
      ],
    },
    {
      groupe: "U18 FILLES",
      epreuve: "100 m haies",
      categorie: "U18",
      genre: "Filles",
      rows: [
        { ordre: "4ème", nomPrenoms: "RASOANIRINA Patricia", club: "ESPI Vakinankaratra", perf: "17’’91", points: "581" },
      ],
    },
    {
      groupe: "U18 FILLES",
      epreuve: "800m",
      categorie: "U18",
      genre: "Filles",
      rows: [
        { ordre: "5ème", nomPrenoms: "MAMPITSAOTSA Ny Rav", club: "AS FAN AlaotraMangoro", perf: "2'42’’ 08", points: "531" },
      ],
    },
    {
      groupe: "U18 GARCONS",
      epreuve: "400m Haies",
      categorie: "U18",
      genre: "Garçon",
      rows: [
        { ordre: "1er", nomPrenoms: "BENARIVO BERNARD", club: "AJAM Morombe", perf: "57’’44", points: "791" },
      ],
    },
    {
      groupe: "U18 GARCONS",
      epreuve: "110 m",
      categorie: "U18",
      genre: "Garçon",
      rows: [
        { ordre: "2ème", nomPrenoms: "RATIARIVO Ryaz", club: "JAM 7 Vinanany", perf: "15’’65", points: "789" },
      ],
    },
    {
      groupe: "U18 GARCONS",
      epreuve: "800m",
      categorie: "U18",
      genre: "Garçon",
      rows: [
        { ordre: "3ème", nomPrenoms: "NATOLOJANAHARY AMED J", club: "JAM 7Vinany", perf: "2’01’’50", points: "724" },
      ],
    },
    {
      groupe: "U18 GARCONS",
      epreuve: "400 m plat",
      categorie: "U18",
      genre: "Garçon",
      rows: [
        { ordre: "4ème", nomPrenoms: "NATOLONJANAHARY Ahmad", club: "JAM 7 Vinany", perf: "52’’57", points: "713" },
      ],
    },
    {
      groupe: "U18 GARCONS",
      epreuve: "2000m steeple",
      categorie: "U18",
      genre: "Garçon",
      rows: [
        { ordre: "5ème", nomPrenoms: "RAKOTOARIMANANA G CELACIER", club: "COSFA TANA", perf: "6’39’’59", points: "693" },
      ],
    },
    {
      groupe: "U18 GARCONS",
      epreuve: "Longueur",
      categorie: "U18",
      genre: "Garcons",
      rows: [
        { ordre: "6ème", nomPrenoms: "RAMIARAMIARAMANITRA Fanomezantsoa", club: "ASCUT Atsinanana", perf: "5m82", points: "672" },
      ],
    },
    {
      groupe: "U18 GARCONS",
      epreuve: "Javelot",
      categorie: "U18",
      genre: "Garçon",
      rows: [
        { ordre: "7ème", nomPrenoms: "RAMIARAMANITRA FANOMEZANTSOA", club: "ASCUT", perf: "32m47", points: "431" },
      ],
    },
    {
      groupe: "U20 FILLES",
      epreuve: "100m",
      categorie: "U20",
      genre: "Fille",
      rows: [
        { ordre: "1er", nomPrenoms: "EMBONY ANDYH", club: "ESAA A/MGA", perf: "12’’60", points: "876" },
      ],
    },
    {
      groupe: "U20 FILLES",
      epreuve: "400m Haies",
      categorie: "U20",
      genre: "Dame",
      rows: [
        { ordre: "2ème", nomPrenoms: "ANDRIANJAFY ANNA", club: "ESAA A/manga", perf: "1’05’’82", points: "859" },
      ],
    },
    {
      groupe: "U20 FILLES",
      epreuve: "200 m",
      categorie: "U20",
      genre: "Fille",
      rows: [
        { ordre: "3ème", nomPrenoms: "EMBONY Andy", club: "ES2A", perf: "26’’1", points: "831" },
      ],
    },
    {
      groupe: "U20 FILLES",
      epreuve: "800m",
      categorie: "U20",
      genre: "Femme",
      rows: [
        { ordre: "4ème", nomPrenoms: "RAZANAJOELINA FAZIA", club: "ESAA ANALAMANGA", perf: "2’28’’89", points: "758" },
      ],
    },
    {
      groupe: "U20 FILLES",
      epreuve: "100 m haies",
      categorie: "U20",
      genre: "Filles",
      rows: [
        { ordre: "5ème", nomPrenoms: "RAMANANTENASOA Anyelah", club: "Lapie A-nga", perf: "18’’99", points: "482" },
      ],
    },
    {
      groupe: "U20 FILLES",
      epreuve: "Javelot",
      categorie: "U20",
      genre: "Dame",
      rows: [
        { ordre: "6ème", nomPrenoms: "RAHARIMALALA LAETICIA", club: "CSSA ANALAMANGA", perf: "26m20", points: "456" },
      ],
    },
    {
      groupe: "U20 GARCONS",
      epreuve: "100 m",
      categorie: "U20",
      genre: "Hommes",
      rows: [
        { ordre: "1er", nomPrenoms: "ERIC Justin", club: "SUD OUEST", perf: "10’’7", points: "934" },
      ],
    },
    {
      groupe: "U20 GARCONS",
      epreuve: "Longueur",
      categorie: "U20",
      genre: "Garçon",
      rows: [
        { ordre: "2ème", nomPrenoms: "HERY Manassé", club: "ASCUT", perf: "6m69", points: "856" },
      ],
    },
    {
      groupe: "U20 GARCONS",
      epreuve: "800m",
      categorie: "U20",
      genre: "Homme",
      rows: [
        { ordre: "3ème", nomPrenoms: "RABETINIAINA MICKAËL", club: "ASCUT ATS", perf: "2’01’’65", points: "721" },
      ],
    },
    {
      groupe: "U20 GARCONS",
      epreuve: "3000 SC",
      categorie: "U20",
      genre: "Garçon",
      rows: [
        { ordre: "4ème", nomPrenoms: "ANDRIANARIVONY Haranasoa", club: "CAA A-nga", perf: "10’43’’3", points: "611" },
      ],
    },
    {
      groupe: "U20 GARCONS",
      epreuve: "Lancer Poids",
      categorie: "U20",
      genre: "Homme",
      rows: [
        { ordre: "5ème", nomPrenoms: "DIEUDONNE LAURENT", club: "CAF HTE MATSIATRA", perf: "9m98", points: "517" },
      ],
    },
    {
      groupe: "U20 GARCONS",
      epreuve: "110 m haies",
      categorie: "U20",
      genre: "Garçon",
      rows: [
        { ordre: "6ème", nomPrenoms: "RAKOTONDRAVAO Matérazzi", club: "ES2A", perf: "18’’32", points: "428" },
      ],
    },
  ];

  const events: ResultEvent[] = [
    {
      epreuve: "100m",
      categorie: "Cadette",
      genre: "Fille",
      rows: [
        { dossard: "501", rang: "1er", nomPrenoms: "ANJARATIANA MAMISOA", club: "ASFAN Alaotra mangoro", perf: "13’’05", points: "794" },
        { dossard: "06", rang: "2ème", nomPrenoms: "HARENASOA STEPHANIE", club: "Tambohobe", perf: "13 ‘’25", points: "759" },
        { dossard: "08", rang: "3ème", nomPrenoms: "LEBEGUE CANDICIA", club: "HTTA Diana", perf: "13’’44", points: "726" },
        { dossard: "222", rang: "4ème", nomPrenoms: "VELO IVANAH", club: "3FB A/Manga", perf: "13’’62", points: "696" },
      ],
    },
    {
      epreuve: "400m Haies",
      categorie: "U18",
      genre: "Garçon",
      rows: [
        { dossard: "012", rang: "1er", nomPrenoms: "BENARIVO BERNARD", club: "AJAM Morombe", perf: "57’’44", points: "791" },
        { dossard: "113", rang: "2ème", nomPrenoms: "MAMINIAINA ANTHONIO", club: "ESAA A/manga", perf: "1’00’’30", points: "676" },
        { dossard: "123", rang: "3ème", nomPrenoms: "RAHAJANANDRASANA ALLAN", club: "ESAA A/manga", perf: "1’09’’57", points: "367" },
      ],
    },
    {
      epreuve: "400m Haies",
      categorie: "Senior",
      genre: "Homme",
      rows: [
        { dossard: "120", rang: "1er", nomPrenoms: "RABEARISON FRANCK", club: "ESAA", perf: "53’’67", points: "955" },
        { dossard: "064", rang: "2ème", nomPrenoms: "RANDRIAMANDRESY ELIA", club: "JAM 7vinany", perf: "57’’75", points: "778" },
        { dossard: "109", rang: "3ème", nomPrenoms: "RAHERINANTENAINA FANIRY", club: "LAPIE", perf: "1’01’’60", points: "627" },
      ],
    },
    {
      epreuve: "400m Haies",
      categorie: "U20",
      genre: "Dame",
      rows: [
        { dossard: "243", rang: "1er", nomPrenoms: "ANDRIANJAFY ANNA", club: "ESAA A/manga", perf: "1’05’’82", points: "859" },
        { dossard: "238", rang: "2ème", nomPrenoms: "RASOAMANANTENA ANGELA", club: "LAPIE", perf: "1’16’’12", points: "605" },
        { dossard: "237", rang: "3ème", nomPrenoms: "RADONIAINA NATACHA", club: "LAPIE", perf: "1’29’’43", points: "343" },
      ],
    },
    {
      epreuve: "400m Haies",
      categorie: "Senior",
      genre: "Dame",
      rows: [{ dossard: "244", rang: "1ère", nomPrenoms: "HAURELIA DJEDIDIA", club: "ESAA A/manga", perf: "1’07’’19", points: "822" }],
    },
    {
      epreuve: "400m Haies",
      categorie: "U18",
      genre: "Fille",
      rows: [{ dossard: "002", rang: "1ère", nomPrenoms: "RASOANIRINA PATRICIA", club: "EPSPI VKN", perf: "1’17’’20", points: "581" }],
    },
    {
      epreuve: "Javelot",
      categorie: "U18",
      genre: "Garçon",
      rows: [
        { dossard: "40", rang: "1er", nomPrenoms: "RAMIARAMANITRA FANOMEZANTSOA", club: "ASCUT", perf: "32m47", points: "431" },
        { dossard: "200", rang: "2ème", nomPrenoms: "RAKOARIMANANA ADRIEN", club: "CSSA ANALAMANGA", perf: "31m25", points: "412" },
      ],
    },
    {
      epreuve: "Javelot",
      categorie: "U20",
      genre: "Dame",
      rows: [
        { dossard: "190", rang: "1ère", nomPrenoms: "RAHARIMALALA LAETICIA", club: "CSSA ANALAMANGA", perf: "26m20", points: "456" },
        { dossard: "199", rang: "2ème", nomPrenoms: "RANDRIANANDRASANA DIANE", club: "CSSA ANALAMANGA", perf: "11m62", points: "189" },
      ],
    },
    {
      epreuve: "2000m steeple",
      categorie: "U18",
      genre: "Fille",
      rows: [
        { dossard: "029", rang: "1ère", nomPrenoms: "HENDRITIANA ANNAH", club: "CAMI ITASY", perf: "8’29’’66", points: "648" },
        { dossard: "107", rang: "2ème", nomPrenoms: "DRAKY MAYA CHRISTINA", club: "LAPIE", perf: "8’33’’10", points: "638" },
      ],
    },
    {
      epreuve: "2000m steeple",
      categorie: "U18",
      genre: "Garçon",
      rows: [
        { dossard: "75", rang: "1ère", nomPrenoms: "RAKOTOARIMANANA G CELACIER", club: "COSFA TANA", perf: "6’39’’59", points: "693" },
        { dossard: "86", rang: "2ème", nomPrenoms: "RALAITSINAVA NOMENJANAHARY", club: "COSFA TANA", perf: "7’13’’07", points: "526" },
      ],
    },
    {
      epreuve: "3000m",
      categorie: "Senior",
      genre: "Homme",
      rows: [
        { dossard: "91", rang: "1er", nomPrenoms: "HERINIAINA ELYSE", club: "COSFA TANA", perf: "8’42’’5", points: "838" },
        { dossard: "79", rang: "2ème", nomPrenoms: "TSIMA TAHIANJANAHARY", club: "COSFA TANA", perf: "9’11’’72", points: "677" },
        { dossard: "103", rang: "3ème", nomPrenoms: "FIDEL HAVELOMA", club: "COSPN", perf: "9’29’’35", points: "609" },
        { dossard: "26", rang: "4ème", nomPrenoms: "RATSIORISOA ALAIN", club: "CAMI ITASY", perf: "9’56’’51" },
      ],
    },
    {
      epreuve: "3000m",
      categorie: "Senior",
      genre: "Femme",
      rows: [
        { dossard: "95", rang: "1ère", nomPrenoms: "NOMENJANAHARY FRANCIA", club: "COSFA TANA", perf: "10’26’’56", points: "850" },
        { dossard: "220", rang: "2ème", nomPrenoms: "RALISINIRINA MARTHE", club: "3FB TANA", perf: "10’41’’91", points: "806" },
        { dossard: "27", rang: "3ème", nomPrenoms: "SENDRANIRINA M P", club: "CAMI ITASY", perf: "11’48’’60", points: "626" },
      ],
    },
    {
      epreuve: "Lancer Poids",
      categorie: "U20",
      genre: "Homme",
      rows: [{ dossard: "57", rang: "1er", nomPrenoms: "DIEUDONNE LAURENT", club: "CAF HTE MATSIATRA", perf: "9m98", points: "517" }],
    },
    {
      epreuve: "Poids",
      categorie: "Senior",
      genre: "Femme",
      rows: [{ dossard: "143", rang: "1ère", nomPrenoms: "RAFIDISON ODILE", club: "COSPN", perf: "8m52", points: "495" }],
    },
    {
      epreuve: "800m",
      categorie: "Senior",
      genre: "Femme",
      rows: [
        { dossard: "240", rang: "1ère", nomPrenoms: "RASOLOHERITIANA LINA", club: "COSFA", perf: "2’21’’06", points: "816" },
        { dossard: "108", rang: "2ème", nomPrenoms: "HAINGONIAINA FRANCOISE", club: "LAPIE", perf: "2’27’’37", points: "778" },
      ],
    },
    {
      epreuve: "800m",
      categorie: "U20",
      genre: "Femme",
      rows: [
        { dossard: "250", rang: "1ère", nomPrenoms: "RAZANAJOELINA FAZIA", club: "ESAA ANALAMANGA", perf: "2’28’’89", points: "758" },
        { dossard: "502", rang: "2ème", nomPrenoms: "FINIAVANA HAMINTSOA", club: "CAA BONGOLAVA", perf: "2’48’’84", points: "518" },
      ],
    },
    {
      epreuve: "100m",
      categorie: "Senior",
      genre: "Femme",
      rows: [
        { dossard: "249", rang: "1ère", nomPrenoms: "RAKOTONARY ZO HENINTSOA", club: "ESAA A/MGA", perf: "12’’52", points: "891" },
        { dossard: "52", rang: "2ème", nomPrenoms: "RAZANAMANDROSO FLORENTINE", club: "CAF HTE MATSIATRA", perf: "12’’76", points: "846" },
        { dossard: "225", rang: "3ème", nomPrenoms: "RASOAMANAMBINA ESPERANCE", club: "3FB A/MGA", perf: "12’80", points: "839" },
      ],
    },
    {
      epreuve: "100m",
      categorie: "U18",
      genre: "Fille",
      rows: [
        { dossard: "246", rang: "1er", nomPrenoms: "EMBONY ANDYH", club: "ESAA A/MGA", perf: "12’’60", points: "876" },
        { dossard: "245", rang: "2ème", nomPrenoms: "RAFARASOA MIALY", club: "ESAA A/MGA", perf: "13’’00", points: "803" },
        { dossard: "43", rang: "3ème", nomPrenoms: "RALISOA JOHANA SYLVIENAH", club: "ASCUT A/TS", perf: "13’’18", points: "771" },
      ],
    },
    {
      epreuve: "800m",
      categorie: "U20",
      genre: "Homme",
      rows: [
        { dossard: "48", rang: "1er", nomPrenoms: "RABETINIAINA MICKAËL", club: "ASCUT ATS", perf: "2’01’’65", points: "721" },
        { dossard: "172", rang: "2ème", nomPrenoms: "RAFENOMANGA NIAINA", club: "3FB A/MGA", perf: "2’04’’15", points: "662" },
        { dossard: "185", rang: "3ème", nomPrenoms: "RANDRIANASOLO FANIRINTSOA", club: "CSSA A/MGA", perf: "2’06’’05", points: "619" },
      ],
    },
    {
      epreuve: "800m",
      categorie: "Senior",
      genre: "Homme",
      rows: [{ dossard: "081", rang: "1er", nomPrenoms: "RANDRIANARIVOSON JEAN VAL", club: "COSFA", perf: "1’57’’05", points: "835" }],
    },
    {
      epreuve: "800m",
      categorie: "U18",
      genre: "Garçon",
      rows: [
        { dossard: "60", rang: "1ER", nomPrenoms: "NATOLOJANAHARY AMED J", club: "JAM 7Vinany", perf: "2’01’’50", points: "724" },
        { dossard: "170", rang: "2ème", nomPrenoms: "RAZAFIMBOLOLONA Harena", club: "3FB", perf: "2’04’’73", points: "649" },
        { dossard: "188", rang: "3ème", nomPrenoms: "RAHARINIAINA FENO", club: "CSSA A/MGA", perf: "2’09’’20", points: "551" },
      ],
    },
    {
      epreuve: "800m",
      categorie: "U18",
      genre: "Filles",
      rows: [
        { dossard: "59", rang: "1er", nomPrenoms: "MAMPITSAOTSA Ny Rav", club: "AS FAN AlaotraMangpro", perf: "2'42’’ 08", points: "531" },
        { dossard: "16", rang: "2eme", nomPrenoms: "RAVONIARINIANJA M Elina", club: "HTT Boeny", perf: "2'54’’ 57", points: "391" },
        { dossard: "034", rang: "3eme", nomPrenoms: "RASOARIMALALA Fanomezantsoa", club: "ABM Itasy", perf: "2'56’’ 57", points: "370" },
      ],
    },
    {
      epreuve: "100 m haies",
      categorie: "U18",
      genre: "Garcons",
      rows: [
        { dossard: "10", rang: "1er", nomPrenoms: "RATOVOARIMANONJA Fabrice", club: "ASPNATO SE", perf: "11’’1", points: "817" },
        { dossard: "61", rang: "2eme", nomPrenoms: "RATIANARIVO Benjamin", club: "JAM 7Vinany", perf: "11’’4", points: "734" },
        { dossard: "173", rang: "3eme", nomPrenoms: "RIVONIAINA Sarobidy", club: "3FB Analamanga", perf: "11’’5", points: "707" },
      ],
    },
    {
      epreuve: "100 m",
      categorie: "Senior",
      genre: "Hommes",
      rows: [
        { dossard: "046", rang: "1ER", nomPrenoms: "TSIRAVAY Junior", club: "Cosfa A-nga", perf: "11’’5", points: "707" },
        { dossard: "015", rang: "2eme", nomPrenoms: "RANDRIANOMENITOMP0 Brutho", club: "AJAT S-O", perf: "11’’90", points: "640" },
        { dossard: "050", rang: "3em", nomPrenoms: "LADRY Simon", club: "ASCUT Atsinanana", perf: "11’’10", points: "857" },
      ],
    },
    {
      epreuve: "100 m",
      categorie: "U20",
      genre: "Hommes",
      rows: [
        { dossard: "137", rang: "1er", nomPrenoms: "ERIC Justin", club: "COSPN A-nga", perf: "10’’7", points: "934" },
        { dossard: "179", rang: "2zme", nomPrenoms: "RAKOTONIAINA Tsilavina", club: "3FB A-nga", perf: "11’’1", points: "817" },
        { dossard: "063", rang: "3eme", nomPrenoms: "VONJNAINA Angela", club: "AJAM 7 Vinany", perf: "11’’2", points: "789" },
      ],
    },
    {
      epreuve: "400m plat",
      categorie: "Senior",
      genre: "Hommes",
      rows: [
        { dossard: "229", rang: "1er", nomPrenoms: "REMANDRO Patrice", club: "Cosfa A-nga", perf: "48’’33", points: "1021" },
        { dossard: "227", rang: "2eme", nomPrenoms: "RANDRIANARISOA Mamisoa", club: "Cosfa A-nga", perf: "49’’50", points: "948" },
        { dossard: "120", rang: "3eme", nomPrenoms: "RABEARISON Franck", club: "ESAA A-nga", perf: "49’’69", points: "937" },
      ],
    },
    {
      epreuve: "400 m plat",
      categorie: "U18",
      genre: "Garcon",
      rows: [
        { dossard: "060", rang: "1er", nomPrenoms: "NATOLONJANAHARY Ahmad", club: "JAM 7 Vinany", perf: "52’’57", points: "713" },
        { dossard: "070", rang: "2eme", nomPrenoms: "ANDRIANIAINA Bienvenu", club: "Cosfa A-nga", perf: "54’’10", points: "633" },
        { dossard: "113", rang: "3eme", nomPrenoms: "MAMINIAINA Thonio", club: "JAM 7 Vinany", perf: "55’’47", points: "565" },
        { dossard: "174", rang: "4eme", nomPrenoms: "RAZANANAIVO Tsiry", club: "3FB A-nga", perf: "55’’48", points: "564" },
      ],
    },
    {
      epreuve: "400 m plat",
      categorie: "U20-Senior",
      genre: "Garcon",
      rows: [{ dossard: "181", rang: "1er", nomPrenoms: "NATOLOJANAHARY Jisvy", club: "AJAC A-nga", perf: "59’’95", points: "417" }],
    },
    {
      epreuve: "200 m",
      categorie: "U20",
      genre: "FILLE",
      rows: [
        { dossard: "246", rang: "1er", nomPrenoms: "EMBONY Andy", club: "ES2A", perf: "26’’1", points: "831" },
        { dossard: "245", rang: "2eme", nomPrenoms: "RAFARASOA Mialy", club: "ES2A", perf: "26’’6", points: "789" },
        { dossard: "003", rang: "3eme", nomPrenoms: "NAMBINDRAZANA Fazinah", club: "BOENY", perf: "27’’4", points: "723" },
      ],
    },
    {
      epreuve: "110 m haies",
      categorie: "U20",
      genre: "GARCON",
      rows: [{ dossard: "114", rang: "1er", nomPrenoms: "RAKOTONDRAVAO Matérazzi", club: "ES2A", perf: "18’’32", points: "428" }],
    },
    {
      epreuve: "110 m",
      categorie: "U18",
      genre: "GARCON",
      rows: [
        { dossard: "061", rang: "1er", nomPrenoms: "RATIARIVO Ryaz", club: "JAM 7 Vinanany", perf: "15’’65", points: "789" },
        { dossard: "012", rang: "2eme", nomPrenoms: "RABENARIVO Bernard", club: "AJAM Morombe", perf: "16’’09", points: "722" },
        { dossard: "123", rang: "3eme", nomPrenoms: "RAHAJANANDRASANA Allan", club: "ES2A", perf: "19’’52", points: "302" },
      ],
    },
    {
      epreuve: "100 m haies",
      categorie: "U18",
      genre: "Filles",
      rows: [{ dossard: "002", rang: "1ère", nomPrenoms: "RASOANIRINA Patricia", club: "ESPI Vakinankaratra", perf: "17’’91", points: "581" }],
    },
    {
      epreuve: "3000 SC",
      categorie: "U20",
      genre: "GARCON",
      rows: [
        { dossard: "024", rang: "1er", nomPrenoms: "ANDRIANARIVONY Haranasoa", club: "CAA A-nga", perf: "10’43’’3", points: "611" },
        { dossard: "186", rang: "2eme", nomPrenoms: "RAHERINIAINA Njiva", club: "CSSA A-nga", perf: "10’51’’2", points: "586" },
        { dossard: "166", rang: "3eme", nomPrenoms: "RASOLOFOSON Herinavalona", club: "ASPPTT Diana", perf: "11’04’’7", points: "544" },
        { dossard: "165", rang: "4eme", nomPrenoms: "ANDRIAMALALA Fenosoa", club: "ASPTT Diana", perf: "11’23’’2", points: "480" },
      ],
    },
    {
      epreuve: "Longueur",
      categorie: "U20",
      genre: "GARCON",
      rows: [
        { dossard: "44", rang: "1er", nomPrenoms: "HERY Manassé", club: "ASCUT", perf: "6m69", points: "856" },
        { dossard: "200", rang: "2eme", nomPrenoms: "RAKOTOARIMANANA Adrien", club: "CSSA", perf: "5m19", points: "541" },
        { dossard: "198", rang: "3eme", nomPrenoms: "HAJAMALALA Fifaliana", club: "CSSA", perf: "4m83", points: "467" },
      ],
    },
    {
      epreuve: "Longueur",
      categorie: "U18",
      genre: "Garcons",
      rows: [
        { dossard: "40", rang: "1er", nomPrenoms: "RAMIARAMIARAMANITRA Fanomezantsoa", club: "ASCUT Atsinanana", perf: "5m82", points: "672" },
        { dossard: "55", rang: "2eme", nomPrenoms: "ANDRIAMIHANTAVELO Michel", club: "CAF H-M", perf: "5m68", points: "643" },
        { dossard: "18", rang: "3eme", nomPrenoms: "TAHINADRIANINA Tsiaro", club: "HTT Bongolava", perf: "5m63", points: "633" },
        { dossard: "193", rang: "4eme", nomPrenoms: "RANDRIANARISOA Fenohasina", club: "ESSA A-nga", perf: "4m90", points: "482" },
      ],
    },
    {
      epreuve: "Longueur",
      categorie: "Senior",
      genre: "HOMME",
      rows: [
        { dossard: "054", rang: "1er", nomPrenoms: "RANARISON Odon", club: "Haute Matsiatra", perf: "6m69", points: "856" },
        { dossard: "101", rang: "2eme", nomPrenoms: "RAZAFIMAMONJY Fanomezantsoa", club: "ES2A A-nga", perf: "6m63", points: "843" },
        { dossard: "124", rang: "3eme", nomPrenoms: "ANDRIAMIFIDY Diana", club: "ES2A A-nga", perf: "6m24", points: "761" },
      ],
    },
    {
      epreuve: "100 m haies",
      categorie: "U20",
      genre: "Filles",
      rows: [
        { dossard: "238", rang: "1er", nomPrenoms: "RAMANANTENASOA Anyelah", club: "Lapie A-nga", perf: "18’’99", points: "482" },
        { dossard: "237", rang: "2eme", nomPrenoms: "RADONIAINA Gaëlle", club: "Lapie A-nga", perf: "20’’49", points: "359" },
      ],
    },
    {
      epreuve: "200 m",
      categorie: "U18",
      genre: "Filles",
      rows: [
        { dossard: "501", rang: "1ère", nomPrenoms: "RAKOTONDRAMARO Anjaratiana", club: "ASF Alaotra Mangoro", perf: "26’’9", points: "764" },
        { dossard: "006", rang: "2eme", nomPrenoms: "HARENASOA Stéphanat", club: "ASPNYA", perf: "27’’3", points: "739" },
        { dossard: "008", rang: "3eme", nomPrenoms: "LEBEGUE Candicia", club: "HTTA ASPTT", perf: "27’’8", points: "691" },
        { dossard: "164", rang: "4eme", nomPrenoms: "NAY Shanya", club: "", perf: "28’’7", points: "622" },
      ],
    },
  ];

  return (
    <div className="pt-40 md:pt-48 pb-20 max-w-7xl mx-auto px-6 min-h-screen">
      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setPage('resultats')}
        className="flex items-center gap-2 text-brand-primary font-black uppercase tracking-widest text-xs mb-12 hover:gap-4 transition-all"
      >
        <ChevronLeft size={16} /> Retour aux résultats
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 -skew-x-12">
              Résultats
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-display font-black italic uppercase tracking-tighter mb-6 leading-tight whitespace-pre-line">
            {header.title}
          </h1>
          <div className="flex flex-wrap gap-8 p-8 bg-bg-surface border-l-8 border-brand-primary shadow-2xl -skew-x-2">
            <div>
              <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-1">Lieu</p>
              <p className="text-xl font-display font-bold italic">{competition.location || "—"}</p>
            </div>
            <div className="w-px h-12 bg-border-main hidden sm:block" />
            <div>
              <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-1">Date</p>
              <p className="text-xl font-display font-bold italic">{header.date}</p>
            </div>
            <div className="w-px h-12 bg-border-main hidden sm:block" />
            <div>
              <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-1">Catégorie</p>
              <p className="text-xl font-display font-bold italic">{competition.category || "—"}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-square lg:aspect-auto border-4 border-border-main shadow-2xl overflow-hidden"
        >
          <CompetitionImage title={competition.title} alt={competition.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </motion.div>
      </div>

      {isOrdreMerite && (
      <div className="glass-card overflow-hidden mb-16">
        <div className="p-6 sm:p-8 border-b border-border-main bg-bg-surface/50">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl font-display font-black italic uppercase tracking-tight">
                Résultats par ordre de mérite
              </h2>
              <p className="text-text-muted mt-2 text-sm">
                U18 / U20 — 14 et 15 mars 2026
              </p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
              Synthèse
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[950px]">
            <thead>
              <tr className="border-b border-border-main">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Groupe</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Épreuve</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Catégorie</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Genre</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Ordre</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Nom & Prénoms</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Club</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Perf</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Points</th>
              </tr>
            </thead>
            <tbody>
              {meritGroups.flatMap((g, gi) =>
                g.rows.map((r, ri) => (
                  <tr
                    key={`${gi}-${ri}`}
                    className="border-b border-border-main/50 hover:bg-bg-surface transition-colors"
                  >
                    <td className="px-6 py-4 font-black uppercase tracking-tight">{g.groupe}</td>
                    <td className="px-6 py-4 font-bold">{g.epreuve}</td>
                    <td className="px-6 py-4"><span className="badge-muted">{g.categorie}</span></td>
                    <td className="px-6 py-4"><span className="badge-outline">{g.genre}</span></td>
                    <td className="px-6 py-4 font-bold">{r.ordre}</td>
                    <td className="px-6 py-4 font-black uppercase tracking-tight">{r.nomPrenoms}</td>
                    <td className="px-6 py-4 text-sm text-text-muted">{r.club}</td>
                    <td className="px-6 py-4 font-mono font-black">{r.perf}</td>
                    <td className="px-6 py-4 font-mono font-bold">{r.points}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {isChampionnatsAfrique && (
      <div className="space-y-14">
        {events.map((evt, idx) => (
          <motion.section 
            key={`${evt.epreuve}-${evt.categorie}-${evt.genre}-${idx}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(idx * 0.03, 0.3) }}
            className="glass-card overflow-hidden"
          >
            <div className="p-6 sm:p-8 border-b border-border-main bg-bg-surface/50">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-2xl sm:text-3xl font-display font-black italic uppercase tracking-tight break-words">
                    {evt.epreuve}
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="badge-muted">{evt.categorie}</span>
                    <span className="badge-outline">{evt.genre}</span>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                  Résultats
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[900px]">
                <thead>
                  <tr className="border-b border-border-main">
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Dossard</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Rang</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Nom & Prénoms</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Club</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Perf</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-text-muted">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {evt.rows.map((r, i) => (
                    <tr key={`${r.dossard}-${i}`} className="border-b border-border-main/50 hover:bg-bg-surface transition-colors">
                      <td className="px-6 py-4 font-mono font-bold">{r.dossard}</td>
                      <td className="px-6 py-4 font-bold">{r.rang}</td>
                      <td className="px-6 py-4 font-black uppercase tracking-tight">{r.nomPrenoms}</td>
                      <td className="px-6 py-4 text-sm text-text-muted">{r.club || "—"}</td>
                      <td className="px-6 py-4 font-mono font-black">{r.perf}</td>
                      <td className="px-6 py-4 font-mono font-bold">{r.points ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>
        ))}
      </div>
      )}

      <div className="mt-20 p-12 bg-bg-surface border border-border-main text-center">
        <h3 className="text-2xl font-display font-black italic uppercase tracking-tight mb-4">Résultats</h3>
        <p className="text-text-muted mb-0 max-w-2xl mx-auto">
          Informations mises à jour pour le test de sélection (14 et 15 mars 2026).
        </p>
      </div>
    </div>
  );
};
