"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const posts = [
      {
        authorId: 1,
        title: "Red Eye",
        summary:
          "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.",
        statusId: 1,
        thumbnailUrl: "/img/post/thumbnail-3.png",
        content:
          "Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
        isPremium: true,
      },
      {
        authorId: 1,
        title: "Powder Blue",
        summary:
          "Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.",
        statusId: 1,
        thumbnailUrl: "/img/post/thumbnail-2.png",
        content:
          "Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.",
        isPremium: true,
      },
      {
        authorId: 1,
        title: "Convict 13",
        summary: "Phasellus in felis. Donec semper sapien a libero. Nam dui.",
        statusId: 1,
        thumbnailUrl: "/img/post/thumbnail-1.png",
        content: "Sed ante. Vivamus tortor. Duis mattis egestas metus.",
        isPremium: true,
      },
      {
        authorId: 1,
        title: "Barabbas",
        summary:
          "Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.",
        statusId: 1,
        thumbnailUrl: "/img/post/thumbnail-3.png",
        content:
          "Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio.",
        isPremium: false,
      },
      {
        authorId: 1,
        title: "Bloomington",
        summary:
          "Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.",
        statusId: 1,
        thumbnailUrl: "/img/post/thumbnail-3.png",
        content:
          "Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.",
        isPremium: true,
      },
    ];

    posts.forEach((post) => {
      post.publishedAt = Sequelize.literal("NOW()");
      post.createdAt = Sequelize.literal("NOW()");
      post.updatedAt = Sequelize.literal("NOW()");
    });
    await queryInterface.bulkInsert("Posts", posts, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Posts", null, {});
  },
};
