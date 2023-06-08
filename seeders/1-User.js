"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const items = [{
            "username": "clempel0",
            "name": "Cassandry Lempel",
            "email": "clempel0@unc.edu",
            "dob": "1980-07-09",
            "pseudonym": "Phalaropus lobatus",
            "managementCategory": 25,
            "typeId": 2
          }, {
            "username": "ischorah1",
            "name": "Ivie Schorah",
            "email": "ischorah1@gizmodo.com",
            "dob": "2003-01-14",
            "pseudonym": "Felis silvestris lybica",
            "managementCategory": 22,
            "typeId": 2
          }, {
            "username": "bsnibson2",
            "name": "Barbey Snibson",
            "email": "bsnibson2@rakuten.co.jp",
            "dob": "2005-07-24",
            "pseudonym": "Thalasseus maximus",
            "managementCategory": 5,
            "typeId": 1
          }, {
            "username": "iveal3",
            "name": "Inga Veal",
            "email": "iveal3@salon.com",
            "dob": "1983-01-15",
            "pseudonym": "Lepus townsendii",
            "managementCategory": 40,
            "typeId": 4
          }, {
            "username": "lnutten4",
            "name": "Lorant Nutten",
            "email": "lnutten4@hubpages.com",
            "dob": "1980-03-03",
            "pseudonym": "Chloephaga melanoptera",
            "managementCategory": 3,
            "typeId": 1
          }, {
            "username": "bmenezes5",
            "name": "Brianna Menezes",
            "email": "bmenezes5@bluehost.com",
            "dob": "1987-06-15",
            "pseudonym": "Carduelis uropygialis",
            "managementCategory": 1,
            "typeId": 4
          }, {
            "username": "sbedford6",
            "name": "Sully Bedford",
            "email": "sbedford6@nationalgeographic.com",
            "dob": "1991-12-30",
            "pseudonym": "Coendou prehensilis",
            "managementCategory": 20,
            "typeId": 3
          }, {
            "username": "gokeenan7",
            "name": "Gelya O'Keenan",
            "email": "gokeenan7@dailymail.co.uk",
            "dob": "2001-11-24",
            "pseudonym": "Merops nubicus",
            "managementCategory": 28,
            "typeId": 3
          }, {
            "username": "sspears8",
            "name": "Saidee Spears",
            "email": "sspears8@ucoz.com",
            "dob": "1995-12-28",
            "pseudonym": "Centrocercus urophasianus",
            "managementCategory": 34,
            "typeId": 3
          }, {
            "username": "mbartlomieczak9",
            "name": "Marguerite Bartlomieczak",
            "email": "mbartlomieczak9@abc.net.au",
            "dob": "1992-10-12",
            "pseudonym": "Dasypus novemcinctus",
            "managementCategory": 38,
            "typeId": 1
          }, {
            "username": "ddaviea",
            "name": "Dulcy Davie",
            "email": "ddaviea@shop-pro.jp",
            "dob": "2004-07-18",
            "pseudonym": "Marmota caligata",
            "managementCategory": 39,
            "typeId": 2
          }, {
            "username": "wconfaitb",
            "name": "Wendall Confait",
            "email": "wconfaitb@discovery.com",
            "dob": "1994-09-21",
            "pseudonym": "Macropus rufogriseus",
            "managementCategory": 8,
            "typeId": 2
          }, {
            "username": "sletixierc",
            "name": "Sianna Letixier",
            "email": "sletixierc@ox.ac.uk",
            "dob": "1992-07-01",
            "pseudonym": "Gorilla gorilla",
            "managementCategory": 46,
            "typeId": 2
          }, {
            "username": "todonnellyd",
            "name": "Tillie O'Donnelly",
            "email": "todonnellyd@mtv.com",
            "dob": "1992-05-11",
            "pseudonym": "Madoqua kirkii",
            "managementCategory": 44,
            "typeId": 2
          }, {
            "username": "dstebbinge",
            "name": "Doug Stebbing",
            "email": "dstebbinge@gmpg.org",
            "dob": "2000-04-15",
            "pseudonym": "Charadrius tricollaris",
            "managementCategory": 18,
            "typeId": 1
          }, {
            "username": "zkubecf",
            "name": "Zebulen Kubec",
            "email": "zkubecf@springer.com",
            "dob": "1999-02-27",
            "pseudonym": "Zonotrichia capensis",
            "managementCategory": 4,
            "typeId": 1
          }, {
            "username": "hgiacobillog",
            "name": "Hieronymus Giacobillo",
            "email": "hgiacobillog@nydailynews.com",
            "dob": "1981-01-19",
            "pseudonym": "Ursus arctos",
            "managementCategory": 44,
            "typeId": 2
          }, {
            "username": "spurdomh",
            "name": "Silvain Purdom",
            "email": "spurdomh@sfgate.com",
            "dob": "2003-05-27",
            "pseudonym": "Macropus agilis",
            "managementCategory": 39,
            "typeId": 1
          }, {
            "username": "vsiddeni",
            "name": "Viva Sidden",
            "email": "vsiddeni@istockphoto.com",
            "dob": "1999-07-08",
            "pseudonym": "Chionis alba",
            "managementCategory": 37,
            "typeId": 4
          }, {
            "username": "mtwiddlej",
            "name": "Murdoch Twiddle",
            "email": "mtwiddlej@webmd.com",
            "dob": "1991-08-17",
            "pseudonym": "Cervus duvauceli",
            "managementCategory": 5,
            "typeId": 4
          }, {
            "username": "wphilbrickk",
            "name": "Wally Philbrick",
            "email": "wphilbrickk@dot.gov",
            "dob": "1985-02-08",
            "pseudonym": "Theropithecus gelada",
            "managementCategory": 9,
            "typeId": 1
          }, {
            "username": "gsepeyl",
            "name": "Garrot Sepey",
            "email": "gsepeyl@newyorker.com",
            "dob": "1988-07-17",
            "pseudonym": "Isoodon obesulus",
            "managementCategory": 37,
            "typeId": 2
          }, {
            "username": "otwelvem",
            "name": "Odell Twelve",
            "email": "otwelvem@phoca.cz",
            "dob": "1983-04-12",
            "pseudonym": "Cochlearius cochlearius",
            "managementCategory": 48,
            "typeId": 1
          }, {
            "username": "rwarwickern",
            "name": "Read Warwicker",
            "email": "rwarwickern@gravatar.com",
            "dob": "2004-05-15",
            "pseudonym": "Isoodon obesulus",
            "managementCategory": 24,
            "typeId": 1
          }, {
            "username": "dpragnello",
            "name": "Datha Pragnell",
            "email": "dpragnello@apple.com",
            "dob": "2004-03-13",
            "pseudonym": "Echimys chrysurus",
            "managementCategory": 9,
            "typeId": 1
          }, {
            "username": "mdriussip",
            "name": "Marylynne Driussi",
            "email": "mdriussip@google.ru",
            "dob": "1994-08-15",
            "pseudonym": "Haliaeetus leucocephalus",
            "managementCategory": 24,
            "typeId": 2
          }, {
            "username": "chowcroftq",
            "name": "Claudell Howcroft",
            "email": "chowcroftq@foxnews.com",
            "dob": "1995-12-05",
            "pseudonym": "Oryx gazella",
            "managementCategory": 41,
            "typeId": 4
          }, {
            "username": "gnewbandr",
            "name": "Goddart Newband",
            "email": "gnewbandr@sphinn.com",
            "dob": "1985-08-25",
            "pseudonym": "Ursus americanus",
            "managementCategory": 18,
            "typeId": 2
          }, {
            "username": "sduntons",
            "name": "Sean Dunton",
            "email": "sduntons@patch.com",
            "dob": "1985-05-12",
            "pseudonym": "Bettongia penicillata",
            "managementCategory": 18,
            "typeId": 1
          }, {
            "username": "nsemplet",
            "name": "Nari Semple",
            "email": "nsemplet@upenn.edu",
            "dob": "1996-10-01",
            "pseudonym": "Canis aureus",
            "managementCategory": 30,
            "typeId": 4
          }, {
            "username": "cjendruschu",
            "name": "Christie Jendrusch",
            "email": "cjendruschu@usatoday.com",
            "dob": "1986-02-26",
            "pseudonym": "Geochelone radiata",
            "managementCategory": 46,
            "typeId": 2
          }, {
            "username": "pscreechv",
            "name": "Page Screech",
            "email": "pscreechv@pen.io",
            "dob": "1980-04-17",
            "pseudonym": "Mabuya spilogaster",
            "managementCategory": 28,
            "typeId": 2
          }, {
            "username": "jcarrettw",
            "name": "Jasmina Carrett",
            "email": "jcarrettw@so-net.ne.jp",
            "dob": "1998-02-26",
            "pseudonym": "Connochaetus taurinus",
            "managementCategory": 35,
            "typeId": 1
          }, {
            "username": "sloachx",
            "name": "Sargent Loach",
            "email": "sloachx@gnu.org",
            "dob": "2003-08-08",
            "pseudonym": "Corythornis cristata",
            "managementCategory": 34,
            "typeId": 3
          }, {
            "username": "nizacy",
            "name": "Nikos Izac",
            "email": "nizacy@loc.gov",
            "dob": "1987-11-24",
            "pseudonym": "Hystrix cristata",
            "managementCategory": 46,
            "typeId": 1
          }, {
            "username": "dfilinkovz",
            "name": "Durant Filinkov",
            "email": "dfilinkovz@wordpress.com",
            "dob": "2001-11-01",
            "pseudonym": "Gazella thompsonii",
            "managementCategory": 30,
            "typeId": 4
          }, {
            "username": "flardeux10",
            "name": "Ferrell Lardeux",
            "email": "flardeux10@sun.com",
            "dob": "1984-08-21",
            "pseudonym": "Butorides striatus",
            "managementCategory": 13,
            "typeId": 2
          }, {
            "username": "htaggert11",
            "name": "Hedi Taggert",
            "email": "htaggert11@nymag.com",
            "dob": "1985-05-16",
            "pseudonym": "Phascogale calura",
            "managementCategory": 16,
            "typeId": 2
          }, {
            "username": "ckerfut12",
            "name": "Cordelie Kerfut",
            "email": "ckerfut12@apple.com",
            "dob": "1980-01-28",
            "pseudonym": "Larus novaehollandiae",
            "managementCategory": 32,
            "typeId": 2
          }, {
            "username": "sclementi13",
            "name": "Sargent Clementi",
            "email": "sclementi13@livejournal.com",
            "dob": "1990-11-26",
            "pseudonym": "Heloderma horridum",
            "managementCategory": 35,
            "typeId": 4
          }, {
            "username": "aperkis14",
            "name": "Amory Perkis",
            "email": "aperkis14@slate.com",
            "dob": "1983-01-06",
            "pseudonym": "Propithecus verreauxi",
            "managementCategory": 2,
            "typeId": 3
          }, {
            "username": "nivashinnikov15",
            "name": "Neysa Ivashinnikov",
            "email": "nivashinnikov15@boston.com",
            "dob": "1984-11-19",
            "pseudonym": "Colobus guerza",
            "managementCategory": 10,
            "typeId": 3
          }, {
            "username": "cwaddie16",
            "name": "Camila Waddie",
            "email": "cwaddie16@sourceforge.net",
            "dob": "1997-12-18",
            "pseudonym": "Dacelo novaeguineae",
            "managementCategory": 27,
            "typeId": 3
          }, {
            "username": "kdeere17",
            "name": "Kelcey Deere",
            "email": "kdeere17@berkeley.edu",
            "dob": "2001-01-31",
            "pseudonym": "Tiliqua scincoides",
            "managementCategory": 44,
            "typeId": 3
          }, {
            "username": "cwheeler18",
            "name": "Clarence Wheeler",
            "email": "cwheeler18@purevolume.com",
            "dob": "2000-06-09",
            "pseudonym": "Neophron percnopterus",
            "managementCategory": 2,
            "typeId": 4
          }, {
            "username": "shrishanok19",
            "name": "Siusan Hrishanok",
            "email": "shrishanok19@virginia.edu",
            "dob": "2003-01-09",
            "pseudonym": "Butorides striatus",
            "managementCategory": 6,
            "typeId": 3
          }, {
            "username": "tpeizer1a",
            "name": "Tamarah Peizer",
            "email": "tpeizer1a@toplist.cz",
            "dob": "1988-04-02",
            "pseudonym": "Plegadis ridgwayi",
            "managementCategory": 21,
            "typeId": 3
          }, {
            "username": "rcrum1b",
            "name": "Renard Crum",
            "email": "rcrum1b@businesswire.com",
            "dob": "1996-11-06",
            "pseudonym": "Callorhinus ursinus",
            "managementCategory": 26,
            "typeId": 4
          }, {
            "username": "kfrost1c",
            "name": "Ki Frost",
            "email": "kfrost1c@cdbaby.com",
            "dob": "1992-06-10",
            "pseudonym": "Canis aureus",
            "managementCategory": 29,
            "typeId": 2
          }, {
            "username": "qbirnie1d",
            "name": "Quintilla Birnie",
            "email": "qbirnie1d@exblog.jp",
            "dob": "1997-02-18",
            "pseudonym": "Neotis denhami",
            "managementCategory": 41,
            "typeId": 2
          }, {
            "username": "bharriman1e",
            "name": "Bridget Harriman",
            "email": "bharriman1e@gmpg.org",
            "dob": "1982-10-17",
            "pseudonym": "Genetta genetta",
            "managementCategory": 32,
            "typeId": 3
          }, {
            "username": "jebhardt1f",
            "name": "Joyann Ebhardt",
            "email": "jebhardt1f@delicious.com",
            "dob": "1985-03-16",
            "pseudonym": "Isoodon obesulus",
            "managementCategory": 3,
            "typeId": 1
          }, {
            "username": "mdowse1g",
            "name": "Mady Dowse",
            "email": "mdowse1g@ucoz.ru",
            "dob": "1998-09-03",
            "pseudonym": "Ara chloroptera",
            "managementCategory": 14,
            "typeId": 1
          }, {
            "username": "rpendrey1h",
            "name": "Rosana Pendrey",
            "email": "rpendrey1h@noaa.gov",
            "dob": "1990-01-08",
            "pseudonym": "Aonyx capensis",
            "managementCategory": 48,
            "typeId": 4
          }, {
            "username": "gmockford1i",
            "name": "Gifford Mockford",
            "email": "gmockford1i@goodreads.com",
            "dob": "1998-12-02",
            "pseudonym": "Alectura lathami",
            "managementCategory": 26,
            "typeId": 3
          }, {
            "username": "atarpey1j",
            "name": "Aleksandr Tarpey",
            "email": "atarpey1j@gov.uk",
            "dob": "1984-08-22",
            "pseudonym": "Plegadis ridgwayi",
            "managementCategory": 48,
            "typeId": 4
          }, {
            "username": "lmuschette1k",
            "name": "Lory Muschette",
            "email": "lmuschette1k@epa.gov",
            "dob": "1988-05-26",
            "pseudonym": "Stercorarius longicausus",
            "managementCategory": 20,
            "typeId": 1
          }, {
            "username": "mplumley1l",
            "name": "Marlee Plumley",
            "email": "mplumley1l@slashdot.org",
            "dob": "1986-04-04",
            "pseudonym": "Aonyx cinerea",
            "managementCategory": 11,
            "typeId": 2
          }, {
            "username": "jdadswell1m",
            "name": "Jayne Dadswell",
            "email": "jdadswell1m@google.com.au",
            "dob": "1983-01-18",
            "pseudonym": "Himantopus himantopus",
            "managementCategory": 6,
            "typeId": 2
          }, {
            "username": "asharply1n",
            "name": "Adan Sharply",
            "email": "asharply1n@tripadvisor.com",
            "dob": "2002-10-17",
            "pseudonym": "Acrantophis madagascariensis",
            "managementCategory": 35,
            "typeId": 2
          }, {
            "username": "fpickrell1o",
            "name": "Flss Pickrell",
            "email": "fpickrell1o@wordpress.com",
            "dob": "2003-09-07",
            "pseudonym": "Phalaropus lobatus",
            "managementCategory": 36,
            "typeId": 1
          }, {
            "username": "agegg1p",
            "name": "Addie Gegg",
            "email": "agegg1p@mit.edu",
            "dob": "2001-04-20",
            "pseudonym": "Loxodonta africana",
            "managementCategory": 19,
            "typeId": 4
          }, {
            "username": "mstoffer1q",
            "name": "Marshal Stoffer",
            "email": "mstoffer1q@sciencedirect.com",
            "dob": "1988-05-02",
            "pseudonym": "Trachyphonus vaillantii",
            "managementCategory": 44,
            "typeId": 3
          }, {
            "username": "roswald1r",
            "name": "Riva Oswald",
            "email": "roswald1r@epa.gov",
            "dob": "1982-02-11",
            "pseudonym": "Felis libyca",
            "managementCategory": 7,
            "typeId": 4
          }, {
            "username": "lrubinivitz1s",
            "name": "Lib Rubinivitz",
            "email": "lrubinivitz1s@hao123.com",
            "dob": "1981-06-02",
            "pseudonym": "Ratufa indica",
            "managementCategory": 19,
            "typeId": 4
          }, {
            "username": "kdadswell1t",
            "name": "Kora Dadswell",
            "email": "kdadswell1t@ucla.edu",
            "dob": "2005-09-21",
            "pseudonym": "Eira barbata",
            "managementCategory": 36,
            "typeId": 2
          }, {
            "username": "jzemler1u",
            "name": "Jordon Zemler",
            "email": "jzemler1u@moonfruit.com",
            "dob": "1985-09-11",
            "pseudonym": "Lycosa godeffroyi",
            "managementCategory": 23,
            "typeId": 1
          }, {
            "username": "idaintier1v",
            "name": "Isadore Daintier",
            "email": "idaintier1v@aboutads.info",
            "dob": "1993-11-06",
            "pseudonym": "Geochelone elephantopus",
            "managementCategory": 48,
            "typeId": 1
          }, {
            "username": "bmashal1w",
            "name": "Bary Mashal",
            "email": "bmashal1w@desdev.cn",
            "dob": "1996-10-25",
            "pseudonym": "Macropus agilis",
            "managementCategory": 28,
            "typeId": 2
          }, {
            "username": "afielding1x",
            "name": "Adriena Fielding",
            "email": "afielding1x@economist.com",
            "dob": "1998-08-10",
            "pseudonym": "Canis lupus lycaon",
            "managementCategory": 12,
            "typeId": 1
          }, {
            "username": "cbarriball1y",
            "name": "Christa Barriball",
            "email": "cbarriball1y@about.me",
            "dob": "2004-03-18",
            "pseudonym": "Oreotragus oreotragus",
            "managementCategory": 4,
            "typeId": 2
          }, {
            "username": "atarrier1z",
            "name": "Antons Tarrier",
            "email": "atarrier1z@ezinearticles.com",
            "dob": "1996-02-13",
            "pseudonym": "Manouria emys",
            "managementCategory": 37,
            "typeId": 4
          }, {
            "username": "gmathey20",
            "name": "Gaspar Mathey",
            "email": "gmathey20@usgs.gov",
            "dob": "1983-04-17",
            "pseudonym": "Macaca fuscata",
            "managementCategory": 6,
            "typeId": 3
          }, {
            "username": "rduny21",
            "name": "Rafaello Duny",
            "email": "rduny21@hp.com",
            "dob": "1999-03-13",
            "pseudonym": "Neophoca cinerea",
            "managementCategory": 20,
            "typeId": 2
          }, {
            "username": "mjoffe22",
            "name": "Murdock Joffe",
            "email": "mjoffe22@cnbc.com",
            "dob": "1985-11-09",
            "pseudonym": "unavailable",
            "managementCategory": 17,
            "typeId": 1
          }, {
            "username": "jbister23",
            "name": "Jabez Bister",
            "email": "jbister23@vistaprint.com",
            "dob": "1986-09-10",
            "pseudonym": "Cervus elaphus",
            "managementCategory": 11,
            "typeId": 1
          }, {
            "username": "bswaffer24",
            "name": "Bret Swaffer",
            "email": "bswaffer24@slate.com",
            "dob": "1995-12-26",
            "pseudonym": "Plegadis ridgwayi",
            "managementCategory": 15,
            "typeId": 1
          }, {
            "username": "clitster25",
            "name": "Conrad Litster",
            "email": "clitster25@webeden.co.uk",
            "dob": "2002-02-01",
            "pseudonym": "Himantopus himantopus",
            "managementCategory": 44,
            "typeId": 3
          }, {
            "username": "rtidmarsh26",
            "name": "Rea Tidmarsh",
            "email": "rtidmarsh26@army.mil",
            "dob": "2004-05-09",
            "pseudonym": "Ninox superciliaris",
            "managementCategory": 46,
            "typeId": 1
          }, {
            "username": "bsearles27",
            "name": "Belia Searles",
            "email": "bsearles27@hhs.gov",
            "dob": "1992-08-27",
            "pseudonym": "Dicrostonyx groenlandicus",
            "managementCategory": 11,
            "typeId": 4
          }, {
            "username": "pdunrige28",
            "name": "Pattin Dunrige",
            "email": "pdunrige28@mozilla.org",
            "dob": "1984-12-13",
            "pseudonym": "Fratercula corniculata",
            "managementCategory": 38,
            "typeId": 2
          }, {
            "username": "cbockh29",
            "name": "Calypso Bockh",
            "email": "cbockh29@webnode.com",
            "dob": "2002-09-13",
            "pseudonym": "Ciconia episcopus",
            "managementCategory": 25,
            "typeId": 4
          }, {
            "username": "lhilbourne2a",
            "name": "Lennie Hilbourne",
            "email": "lhilbourne2a@kickstarter.com",
            "dob": "1995-01-14",
            "pseudonym": "Eudyptula minor",
            "managementCategory": 37,
            "typeId": 4
          }, {
            "username": "rwagg2b",
            "name": "Rochester Wagg",
            "email": "rwagg2b@house.gov",
            "dob": "1983-04-06",
            "pseudonym": "Isoodon obesulus",
            "managementCategory": 43,
            "typeId": 1
          }, {
            "username": "ebowller2c",
            "name": "Earle Bowller",
            "email": "ebowller2c@boston.com",
            "dob": "1986-09-14",
            "pseudonym": "Nyctea scandiaca",
            "managementCategory": 4,
            "typeId": 4
          }, {
            "username": "lpierton2d",
            "name": "Lynnette Pierton",
            "email": "lpierton2d@msu.edu",
            "dob": "1984-04-01",
            "pseudonym": "Tadorna tadorna",
            "managementCategory": 18,
            "typeId": 4
          }, {
            "username": "vverzey2e",
            "name": "Viviyan Verzey",
            "email": "vverzey2e@shop-pro.jp",
            "dob": "1985-09-09",
            "pseudonym": "Cacatua tenuirostris",
            "managementCategory": 35,
            "typeId": 1
          }, {
            "username": "rrekes2f",
            "name": "Raddy Rekes",
            "email": "rrekes2f@npr.org",
            "dob": "1994-08-13",
            "pseudonym": "Phylurus milli",
            "managementCategory": 18,
            "typeId": 1
          }, {
            "username": "braine2g",
            "name": "Brooks Raine",
            "email": "braine2g@gov.uk",
            "dob": "1990-08-30",
            "pseudonym": "Colobus guerza",
            "managementCategory": 7,
            "typeId": 1
          }, {
            "username": "gcutmere2h",
            "name": "Griz Cutmere",
            "email": "gcutmere2h@bloomberg.com",
            "dob": "1996-07-28",
            "pseudonym": "Pytilia melba",
            "managementCategory": 1,
            "typeId": 3
          }, {
            "username": "spetersen2i",
            "name": "Shena Petersen",
            "email": "spetersen2i@npr.org",
            "dob": "1982-05-13",
            "pseudonym": "Ammospermophilus nelsoni",
            "managementCategory": 25,
            "typeId": 1
          }, {
            "username": "cpriditt2j",
            "name": "Clem Priditt",
            "email": "cpriditt2j@netlog.com",
            "dob": "1990-05-05",
            "pseudonym": "Falco peregrinus",
            "managementCategory": 43,
            "typeId": 3
          }, {
            "username": "dgarnson2k",
            "name": "Donnajean Garnson",
            "email": "dgarnson2k@devhub.com",
            "dob": "1985-10-01",
            "pseudonym": "Taurotagus oryx",
            "managementCategory": 33,
            "typeId": 4
          }, {
            "username": "ahawse2l",
            "name": "Aloysius Hawse",
            "email": "ahawse2l@ucsd.edu",
            "dob": "1988-06-14",
            "pseudonym": "Colaptes campestroides",
            "managementCategory": 8,
            "typeId": 4
          }, {
            "username": "jmochar2m",
            "name": "Jeremie Mochar",
            "email": "jmochar2m@lycos.com",
            "dob": "1996-05-18",
            "pseudonym": "Cebus albifrons",
            "managementCategory": 41,
            "typeId": 4
          }, {
            "username": "jvader2n",
            "name": "Jeddy Vader",
            "email": "jvader2n@huffingtonpost.com",
            "dob": "1994-11-11",
            "pseudonym": "Pteronura brasiliensis",
            "managementCategory": 29,
            "typeId": 3
          }, {
            "username": "nlazenby2o",
            "name": "Nikki Lazenby",
            "email": "nlazenby2o@elegantthemes.com",
            "dob": "1994-01-13",
            "pseudonym": "Felis yagouaroundi",
            "managementCategory": 23,
            "typeId": 1
          }, {
            "username": "idegue2p",
            "name": "Ingrim Degue",
            "email": "idegue2p@google.nl",
            "dob": "1993-01-16",
            "pseudonym": "Bos taurus",
            "managementCategory": 14,
            "typeId": 2
          }, {
            "username": "jpratton2q",
            "name": "Johanna Pratton",
            "email": "jpratton2q@wired.com",
            "dob": "2005-11-28",
            "pseudonym": "Tauraco porphyrelophus",
            "managementCategory": 41,
            "typeId": 1
          }, {
            "username": "fiohananof2r",
            "name": "Fee Iohananof",
            "email": "fiohananof2r@hhs.gov",
            "dob": "1980-05-14",
            "pseudonym": "Cordylus giganteus",
            "managementCategory": 37,
            "typeId": 1
          }]          

        items.forEach((item) => {
            if (item.typeId != 2) {
                item.pseudonym = null;
            }
            if(item.typeId != 3){
              item.managementCategory = null;
            }
            const bcrypt = require("bcrypt");
            item.password = bcrypt.hashSync("Nhom11@20TN", bcrypt.genSaltSync(8));
            item.createdAt = Sequelize.literal("NOW()");
            item.updatedAt = Sequelize.literal("NOW()");
        });
        await queryInterface.bulkInsert("Users", items, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Users", null, {});
    },
};
