'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        var items = [
            // THỜI SỰ - CHÍNH TRỊ
            { title: "VIỆT NAM VÀ ÚC" },
            { title: "TỔNG BÍ THƯ NGUYỄN PHÚ TRỌNG" },
            { title: "THỦ TƯỚNG ÚC ANTHONY ALBANESE" },
            { title: "NÂNG CẤP QUAN HỆ" },
            { title: "THỦ TƯỚNG ÚC" },
            { title: "THỦ TƯỚNG PHẠM MINH CHÍNH" },
            { title: "VIỆT NAM" },
            { title: "ANTHONY ALBANESE" },
            { title: "QUAN HỆ VIỆT – ÚC" },
            { title: "TÀU TRUNG QUỐC" },
            { title: "VÙNG ĐẶC QUYỀN KINH TẾ CỦA VIỆT NAM" },
            { title: "BẢO HỘ CÔNG DÂN" },
            { title: "LẤY PHIẾU TÍN NHIỆM" },
            { title: "CHỐNG THAM NHŨNG" },
            { title: "CÁN BỘ LÃNH ĐẠO" },
            { title: "BAN THƯỜNG VỤ" },
            { title: "TỈNH CÀ MAU" },

            // THỜI SỰ - DÂN SINH
            { title: "TIN TỨC THỜI TIẾT HÔM NAY" },
            { title: "NẮNG NÓNG" },
            { title: "MƯA GIÔNG" },
            { title: "DỰ BÁO THỜI TIẾT" },
            { title: "NHÀ Ở XÃ HỘI" },
            { title: "HỘ NGHÈO" },
            { title: "LĂNG KÍNH BẠN ĐỌC" },
            { title: "CÔNG AN" },
            { title: "VỐN NHÀ NƯỚC" },
            { title: "CƠ QUAN CÔNG AN" },
            { title: "TÁI ĐỊNH CƯ" },
            { title: "VỐN NGÂN SÁCH" },
            { title: "GIẢI PHÓNG MẶT BẰNG" },
            { title: "LÃI SUẤT CHO VAY" },
            { title: "GIẢI NGÂN ĐẦU TƯ CÔNG" },
            { title: "GIẢM LÃI SUẤT" },
            { title: "THIẾU ĐIỆN" },
            { title: "SAI PHẠM" },
            { title: "BỘ TT-TT" },
            { title: "MẠNG XÃ HỘI" },
            { title: "TIKTOK" },
            { title: "KIỂM TRA TOÀN DIỆN" },

            // THỜI SỰ - QUYỀN ĐƯỢC BIẾT
            { title: "MUA BÁN NHÀ ĐẤT" },
            { title: "GIẤY CHỨNG NHẬN" },
            { title: "QUYỀN SỬ DỤNG ĐẤT" },
            { title: "QUYẾT ĐỊNH THU HỒI ĐẤT" },
            { title: "SỔ ĐỎ" },
            { title: "DÁN TỜ RƠI" },
            { title: "KHẮC PHỤC HẬU QUẢ" },
            { title: "TỜ RƠI QUẢNG CÁO" },
            { title: "TÍN DỤNG ĐEN" },
            { title: "XỬ LÝ HÌNH SỰ" },
            { title: "TRÁCH NHIỆM HÌNH SỰ" },
            { title: "BÔI BẨN ĐƯỜNG PHỐ" },
            { title: "CHỦ PHƯƠNG TIỆN" },
            { title: "CỤC ĐĂNG KIỂM" },
            { title: "KINH DOANH VẬN TẢI" },
            { title: "KIỂM ĐỊNH" },
            { title: "ĐĂNG KIỂM" },
            { title: "BHYT" },
            { title: "TĂNG LƯƠNG CƠ SỞ TỪ NGÀY 1.7" },
            { title: "LƯƠNG" },
            { title: "BHXH" },
            { title: "BẢO HIỂM XÃ HỘI" },
            { title: "BHYT HỘ GIA ĐÌNH" },
            { title: "HỢP ĐỒNG" },
            { title: "UỶ QUYỀN" },
            { title: "NHÀ ĐẤT" },
            { title: "VĂN PHÒNG CÔNG CHỨNG" },
            { title: "BỒI THƯỜNG THIỆT HẠI" },
            { title: "CHẤM DỨT HỢP ĐỒNG" },
            { title: "NGƯỜI MUA NHÀ" },

            // THỜI SỰ - QUỐC PHÒNG
            { title: "SÂN BAY PHAN THIẾT" },
            { title: "THỨ TRƯỞNG BỘ QUỐC PHÒNG" },
            { title: "BỘ QUỐC PHÒNG" },
            { title: "TỈNH BÌNH THUẬN" },
            { title: "QĐND VIỆT NAM" },
            { title: "TRƯỜNG SA" },
            { title: "QUẦN ĐẢO TRƯỜNG SA" },
            { title: "GẠC MA" },
            { title: "64 LIỆT SĨ GẠC MA" },
            { title: "HẢI QUÂN NHÂN DÂN VIỆT NAM" },
            { title: "TRƯỜNG SA MÃI TRONG TIM NGƯỜI VIỆT" },
            { title: "ĐẢO SONG TỬ TÂY" },
            { title: "ĐẢO SINH TỒN" },
            { title: "TÀU CÁ" },
            { title: "TRƯỜNG SA MÃI TRONG TIM NGƯỜI VIỆT" },
            { title: "BỘ QUỐC PHÒNG" },
            { title: "BÁO THANH NIÊN" },
            { title: "LIỆT SĨ GẠC MA" },
            { title: "QUẦN ĐẢO TRƯỜNG SA" },
            { title: "GẠC MA" },

            // THỜI SỰ - PHÓNG SỰ / ĐIỀU TRA
            { title: "TÁI CHẾ DẦU NHỚT THẢI" },
            { title: "DẦU TÁI CHẾ LẬU" },
            { title: "Ô NHIỄM MÔI TRƯỜNG" },
            { title: "NHỚT THẢI" },
            { title: "DẦU NHỚT THẢI" },
            { title: "GƯƠNG MẶT TRẺ" },
            { title: "TRUYỀN CẢM HỨNG" },
            { title: "CỨU HỘ ĐỘNG VẬT HOANG DÃ" },
            { title: "ĐỘNG VẬT HOANG DÃ" },
            { title: "BẢO TỒN ĐỘNG VẬT" },
            { title: "BÙ GIA MẬP" },
            { title: "ĐỘNG VẬT HOANG DÃ" },
            { title: "CỨU HỘ ĐỘNG VẬT HOANG DÃ" },
            { title: "CỨU HỘ ĐỘNG VẬT" },
            { title: "TÌNH NGUYỆN VIÊN" },
            { title: "HẠT KIỂM LÂM" },
            { title: "ĐỘNG VẬT HOANG DÃ" },
            { title: "LỰC LƯỢNG KIỂM LÂM" },
            { title: "BÙ GIA MẬP" },
            { title: "HỆ SINH THÁI" },
            { title: "CỨU HỘ ĐỘNG VẬT HOANG DÃ" },
            { title: "VOỌC CHÀ VÁ CHÂN XÁM" },
            { title: "VOỌC CHÀ VÁ" },
            { title: "CỨU HỘ ĐỘNG VẬT" },
            { title: "ĐỘNG VẬT HOANG DÃ" },
            { title: "VƯỜN QUỐC GIA CÁT TIÊN" },
            { title: "SÁCH ĐỎ VIỆT NAM" },
            { title: "CỨU HỘ ĐỘNG VẬT" },
            { title: "CỨU HỘ ĐỘNG VẬT HOANG DÃ" },
            { title: "THIÊN NHIÊN HOANG DÃ" },
            { title: "THẢO CẦM VIÊN" },

            // THỜI SỰ - THỜI LUẬN
            { title: "CHỦ TỊCH HỒ CHÍ MINH" },
            { title: "GIẢI PHÓNG DÂN TỘC" },
            { title: "THỰC DÂN PHÁP" },
            { title: "DÂN TỘC VIỆT NAM" },
            { title: "CÁCH MẠNG TƯ SẢN" },
            { title: "CHỐNG THAM NHŨNG" },
            { title: "TỔNG BÍ THƯ NGUYỄN PHÚ TRỌNG" },
            { title: "PHÒNG CHỐNG THAM NHŨNG" },
            { title: "HỒ CHÍ MINH" },
            { title: "CHỦ NGHĨA XÃ HỘI" },
            { title: "ĐẢNG CỘNG SẢN" },
            { title: "SUY THOÁI" },
            { title: "ĐẢNG CỘNG SẢN VIỆT NAM" },
            { title: "ĐẠI HỘI ĐẠI BIỂU TOÀN QUỐC" },
            { title: "ĐẢNG VIÊN" },
            { title: "ĐƯỜNG LỐI CHÍNH TRỊ" },
            { title: "TƯ TƯỞNG CỦA ĐẢNG" },
            { title: "CHỈNH ĐỐN ĐẢNG" },

            // THỜI SỰ - CHỐNG TIN GIẢ
            { title: "TIN GIẢ" },
            { title: "LỪA ĐẢO" },
            { title: "THÔNG TIN BỊA ĐẶT" },
            { title: "VĨNH LONG" },
            { title: "LỪA ĐẢO CHIẾM ĐOẠT TÀI SẢN" },
            { title: "MẠNG XÃ HỘI FACEBOOK" },
            { title: "THÔNG TIN SAI SỰ THẬT" },
            { title: "BỊ PHẠT" },
            { title: "NAM ĐỊNH" },
            { title: "THỰC HIỆN HÀNH VI LỪA ĐẢO" },
            { title: "CÔNG AN LÂM ĐỒNG" },
            { title: "GIẢ DANH" },
            { title: "GIẢ DANH CÁN BỘ" },
            { title: "CÔNG AN TỈNH" },

            // THỜI SỰ - LAO ĐỘNG - VIỆC LÀM
            { title: "CÔNG TY TNHH POUYUEN VIỆT NAM" },
            { title: "CÔNG TY POUYUEN" },
            { title: "CẮT GIẢM LAO ĐỘNG" },
            { title: "CÔNG NHÂN MẤT VIỆC" },
            { title: "CÔNG TY POUYUEN VIỆT NAM" },
            { title: "LAO ĐỘNG" },
            { title: "KINH PHÍ CÔNG ĐOÀN" },
            { title: "BAN NGHIÊN CỨU PHÁT TRIỂN KINH TẾ TƯ NHÂN" },
            { title: "BẢO HIỂM XÃ HỘI" },
            { title: "SA THẢI LAO ĐỘNG" },
            { title: "LƯƠNG HƯU" },
            { title: "TRỢ CẤP BHXH" },
            { title: "TRỢ CẤP XÃ HỘI" },
            { title: "NGƯỜI LAO ĐỘNG" },
            { title: "TĂNG LƯƠNG" },
            { title: "ĐIỀU CHỈNH LƯƠNG" },
            { title: "BẢO HIỂM XÃ HỘI" },
            { title: "THỰC TẬP SINH" },
            { title: "CỤC QUẢN LÝ LAO ĐỘNG NGOÀI NƯỚC" },
            { title: "MANG THAI" },
            { title: "NGƯỜI LAO ĐỘNG" },

            // THỜI SỰ - PHÁP LUẬT
            { title: "SAI PHẠM ĐẤT ĐAI" },
            { title: "BỊ CÁO BUỘC" },
            { title: "DỰ ÁN SAI PHẠM" },
            { title: "THIẾU TRÁCH NHIỆM" },
            { title: "BỊ CÁO BUỘC" },
            { title: "GIẤY CHỨNG NHẬN" },
            { title: "DỰ ÁN SAI PHẠM" },
            { title: "KHÍ CƯỜI" },
            { title: "ĐỘT KÍCH" },
            { title: "QUÁN BAR" },
            { title: "NEW GOLDEN PINE" },
            { title: "GOLDEN PINE" },
            { title: "BÓNG CƯỜI" },
            { title: "MẠNG XÃ HỘI" },
            { title: "TRỘM TÀI SẢN" },
            { title: "TRỘM ĐIỆN THOẠI" },
            { title: "CAMERA AN NINH" },

            // THẾ GIỚI - KINH TẾ THẾ GIỚI
            { title: "OPEC+" },
            { title: "DẦU MỎ" },
            { title: "Ả RẬP XÊ ÚT" },
            { title: "GIÁ DẦU" },
            // THẾ GIỚI - QUÂN SỰ
            // THẾ GIỚI - GÓC NHÌN
            // THẾ GIỚI - HỒ SƠ
            // THẾ GIỚI - NGƯỜI VIỆT NĂM CHÂU
            // THẾ GIỚI - CHUYỆN LẠ

            // KINH TẾ - KINH TẾ XANH
            // KINH TẾ - LÀM GIÀU
            // KINH TẾ - DOANH NHÂN
            // KINH TẾ - NGÂN HÀNG
            // KINH TẾ - CHÍNH SÁCH PHÁT TRIỂN
            // KINH TẾ - ĐỊA ỐC
            // KINH TẾ - DOANH NGHIỆP
            // KINH TẾ - CHỨNG KHOÁNG
        ];
        items.forEach(item => {
            item.removedAt = null;
            item.content = null;
            item.title = item.title.trim().toUpperCase()
            item.createdAt = Sequelize.literal('NOW()');
            item.updatedAt = Sequelize.literal('NOW()');
        });

        // REMOVE DUPLICATED TITLE
        let temp_items = [...items]
        items = []
        let unique_titles = {}
        temp_items.forEach(item => {
            if (!unique_titles[item.title]) {
                unique_titles[item.title] = true
                items.push(item)
            }
        });
        await queryInterface.bulkInsert('Tags', items, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Tags', null, {});
    }
};
