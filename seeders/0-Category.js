'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const items = [
            { removedAt: null, parentId: null, title: "Thời sự", content: null }, // 1
            { removedAt: null, parentId: null, title: "Thế giới", content: null }, // 2
            { removedAt: null, parentId: null, title: "Kinh tế", content: null }, // 3
            { removedAt: null, parentId: null, title: "Giáo dục", content: null }, // 4
            { removedAt: null, parentId: null, title: "Du lịch", content: null }, // 5
            { removedAt: null, parentId: null, title: "Sức khỏe", content: null }, // 6
            { removedAt: null, parentId: null, title: "Văn hóa", content: null }, // 7

            // Children of 1
            { removedAt: null, parentId: 1, title: "Chính trị", content: null },
            { removedAt: null, parentId: 1, title: "Quốc phòng", content: null },
            { removedAt: null, parentId: 1, title: "Lao động / Việc làm", content: null },
            { removedAt: null, parentId: 1, title: "Dân sinh", content: null },
            { removedAt: null, parentId: 1, title: "Thời luận", content: null },
            { removedAt: null, parentId: 1, title: "Quyền được biết", content: null },
            { removedAt: null, parentId: 1, title: "Pháp luật", content: null },
            { removedAt: null, parentId: 1, title: "Phóng sự / điều tra", content: null },

            // Childen of 2
            { removedAt: null, parentId: 2, title: "Kinh tế thế giới", content: null },
            { removedAt: null, parentId: 2, title: "Góc nhìn", content: null },
            { removedAt: null, parentId: 2, title: "Quân sự", content: null },
            { removedAt: null, parentId: 2, title: "Hồ sơ", content: null },
            { removedAt: null, parentId: 2, title: "Người Việt năm châu", content: null },
            { removedAt: null, parentId: 2, title: "Chuyện lạ", content: null },

            // Childen of 3
            { removedAt: null, parentId: 3, title: "Kinh tế xanh", content: null },
            { removedAt: null, parentId: 3, title: "Làm giàu", content: null },
            { removedAt: null, parentId: 3, title: "Doanh nhân", content: null },
            { removedAt: null, parentId: 3, title: "Ngân hàng", content: null },
            { removedAt: null, parentId: 3, title: "Chính sách - phát triển", content: null },
            { removedAt: null, parentId: 3, title: "Địa ốc", content: null },
            { removedAt: null, parentId: 3, title: "Doanh nghiệp", content: null },
            { removedAt: null, parentId: 3, title: "Chứng khoáng", content: null },

            // Childen of 4
            { removedAt: null, parentId: 4, title: "Tuyển sinh", content: null },
            { removedAt: null, parentId: 4, title: "Chọn nghề - chọn trường", content: null },
            { removedAt: null, parentId: 4, title: "Du học", content: null },
            // { removedAt: null, parentId: 4, title: "Cẩm nang tuyển sinh 2023", content: null },
            { removedAt: null, parentId: 4, title: "Phụ huynh", content: null },
            { removedAt: null, parentId: 4, title: "Nhà trường", content: null },

            // Childen of 5
            { removedAt: null, parentId: 5, title: "Khám phá", content: null },
            { removedAt: null, parentId: 5, title: "Tin tức sự kiện", content: null },
            { removedAt: null, parentId: 5, title: "Chơi gì, ăn đâu, đi thế nào", content: null },
            { removedAt: null, parentId: 5, title: "Bất động sản du lịch", content: null },
            { removedAt: null, parentId: 5, title: "Câu chuyện du lịch", content: null },


            // Childen of 6
            { removedAt: null, parentId: 6, title: "Khỏe đẹp mỗi ngày", content: null },
            { removedAt: null, parentId: 6, title: "Niềm tin vào y đức", content: null },
            { removedAt: null, parentId: 6, title: "Làm đẹp", content: null },
            { removedAt: null, parentId: 6, title: "Giới tính", content: null },

            // Childen of 7
            { removedAt: null, parentId: 7, title: "Câu chuyện văn hóa", content: null },
            { removedAt: null, parentId: 7, title: "Khảo cứu", content: null },
            { removedAt: null, parentId: 7, title: "Xem - nghe", content: null },
            { removedAt: null, parentId: 7, title: "Sống đẹp", content: null }
        ];
        items.forEach(item => {
            item.createdAt = Sequelize.literal('NOW()');
            item.updatedAt = Sequelize.literal('NOW()');
        });
        await queryInterface.bulkInsert('Categories', items, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Categories', null, {});
    }
};
