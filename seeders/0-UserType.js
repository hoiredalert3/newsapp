'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const items = [
      {name: "Người đọc"},
      {name: "Phóng viên"}, // writer
      {name: "Biên tập viên"}, // editor
      {name: "Quản trị viên"} // administrator
    ];
    items.forEach(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
    });
    await queryInterface.bulkInsert('UserTypes', items, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserTypes', null, {});
  }
};
