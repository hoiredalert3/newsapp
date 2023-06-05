"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const items = [{
            "name": "Basile Stokoe",
            "email": "bstokoe0@baidu.com",
            "dob": "1991-06-27",
            "pseudonym": "bstokoe0",
            "managementCategory": 22,
            "typeId": 1
        }, {
            "name": "Cob McCalister",
            "email": "cmccalister1@imdb.com",
            "dob": "2001-09-15",
            "pseudonym": "cmccalister1",
            "managementCategory": 15,
            "typeId": 1
        }, {
            "name": "Malissa Adamczewski",
            "email": "madamczewski2@cpanel.net",
            "dob": "1999-05-27",
            "pseudonym": "madamczewski2",
            "managementCategory": 44,
            "typeId": 1
        }, {
            "name": "Cassandre Ilson",
            "email": "cilson3@nifty.com",
            "dob": "2001-05-04",
            "pseudonym": "cilson3",
            "managementCategory": 3,
            "typeId": 3
        }, {
            "name": "Christabel Wadwell",
            "email": "cwadwell4@nps.gov",
            "dob": "2005-12-24",
            "pseudonym": "cwadwell4",
            "managementCategory": 33,
            "typeId": 4
        }, {
            "name": "Gelya Simoneton",
            "email": "gsimoneton5@sourceforge.net",
            "dob": "1992-09-16",
            "pseudonym": "gsimoneton5",
            "managementCategory": 31,
            "typeId": 4
        }, {
            "name": "Ira Semens",
            "email": "isemens6@deviantart.com",
            "dob": "2004-09-12",
            "pseudonym": "isemens6",
            "managementCategory": 30,
            "typeId": 4
        }, {
            "name": "Thornton Goodhay",
            "email": "tgoodhay7@phoca.cz",
            "dob": "1991-10-17",
            "pseudonym": "tgoodhay7",
            "managementCategory": 12,
            "typeId": 1
        }, {
            "name": "Lothario Bellefonte",
            "email": "lbellefonte8@xrea.com",
            "dob": "1999-07-04",
            "pseudonym": "lbellefonte8",
            "managementCategory": 30,
            "typeId": 1
        }, {
            "name": "Brooks Rubel",
            "email": "brubel9@globo.com",
            "dob": "1991-08-29",
            "pseudonym": "brubel9",
            "managementCategory": 37,
            "typeId": 3
        }, {
            "name": "Asher Kirmond",
            "email": "akirmonda@hhs.gov",
            "dob": "2003-07-23",
            "pseudonym": "akirmonda",
            "managementCategory": 48,
            "typeId": 1
        }, {
            "name": "Adolpho Berendsen",
            "email": "aberendsenb@yandex.ru",
            "dob": "1991-11-09",
            "pseudonym": "aberendsenb",
            "managementCategory": 31,
            "typeId": 3
        }, {
            "name": "Sayre Loeber",
            "email": "sloeberc@apple.com",
            "dob": "2003-07-02",
            "pseudonym": "sloeberc",
            "managementCategory": 45,
            "typeId": 3
        }, {
            "name": "Itch Tumulty",
            "email": "itumultyd@telegraph.co.uk",
            "dob": "1993-11-02",
            "pseudonym": "itumultyd",
            "managementCategory": 35,
            "typeId": 3
        }, {
            "name": "Melisent Sibson",
            "email": "msibsone@stumbleupon.com",
            "dob": "1992-10-09",
            "pseudonym": "msibsone",
            "managementCategory": 48,
            "typeId": 1
        }, {
            "name": "Deedee Kneale",
            "email": "dknealef@census.gov",
            "dob": "1998-07-02",
            "pseudonym": "dknealef",
            "managementCategory": 33,
            "typeId": 1
        }, {
            "name": "Egbert Hoogendorp",
            "email": "ehoogendorpg@uol.com.br",
            "dob": "2001-12-21",
            "pseudonym": "ehoogendorpg",
            "managementCategory": 48,
            "typeId": 3
        }, {
            "name": "Anne-corinne Guy",
            "email": "aguyh@oracle.com",
            "dob": "1994-03-20",
            "pseudonym": "aguyh",
            "managementCategory": 4,
            "typeId": 4
        }, {
            "name": "Dawna Attreed",
            "email": "dattreedi@domainmarket.com",
            "dob": "1992-05-08",
            "pseudonym": "dattreedi",
            "managementCategory": 9,
            "typeId": 3
        }, {
            "name": "Hercule Overstone",
            "email": "hoverstonej@un.org",
            "dob": "1997-12-02",
            "pseudonym": "hoverstonej",
            "managementCategory": 15,
            "typeId": 2
        }]


        items.forEach((item) => {
            if (item.typeId != 4) {
                item.typeId = null;
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
