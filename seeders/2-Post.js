"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const items = [
      {
        title:
          "Bộ trưởng đề nghị minh chứng thiếu minh bạch chọn sách giáo khoa, đại biểu nói gì?",
        summary:
          "Hôm nay 6.6, đại biểu Nguyễn Thị Kim Thúy (đoàn Đà Nẵng) có văn bản trao đổi lại với Bộ trưởng Bộ GD-ĐT Nguyễn Kim Sơn sau khi nhận được công văn trả lời của ông ngày 5.6. Trong đó, đại biểu có phản hồi về đề nghị của Bộ trưởng Sơn về cung cấp thông tin, minh chứng trường hợp sai phạm trong chọn sách giáo khoa cho Bộ GD-ĐT, để xử lý theo quy định.",
        statusId: 5,
        thumnailUrl: "/img/post/1.png",
        content: `Phản hồi bằng văn bản gửi Bộ trưởng Nguyễn Kim Sơn, đại biểu Nguyễn Thị Kim Thúy nhận xét: "Công văn số 2706 của bộ trưởng trả lời tôi lần này không đề cập đến những vấn đề chính yếu mà tôi đã đặt ra" và nêu cụ thể từng vấn đề mà bà thấy rằng phần trả lời chưa thỏa đáng.
        
        Về trách nhiệm của bộ đối với những sai phạm phải xử lý hình sự ở Nhà xuất bản Giáo dục Việt Nam (NXBGDVN), bà Thúy cho rằng: "Công văn số 2706 dành tới 18 dòng để giải trình nhưng tuyệt nhiên không có câu nào cho biết cơ quan chủ quản (tức Bộ GD-ĐT) có trách nhiệm như thế nào trong việc "bổ nhiệm nhân sự lãnh đạo không đúng và thiếu kiểm tra, thanh tra sâu sát" như ý kiến của tôi".
        
        Liên quan đến tính minh bạch trong chọn sách giáo khoa, bà Thúy nêu trong văn bản gửi Bộ trưởng Bộ GD-ĐT: "Về Thông tư số 25/2020/TT-BGDĐT ngày 26.8.2020 của Bộ GD-ĐT hướng dẫn lựa chọn sách giáo khoa theo quy định của luật Giáo dục, trong ý kiến phát biểu ngày 1.6, tôi đã nêu bất cập của Thông tư này là: "Trao quyền bỏ phiếu quyết định lựa chọn sách của mỗi môn học cho một hội đồng 15 người; không hề có quy định là khi một quyển sách giáo khoa được các cơ sở giáo dục lựa chọn với tỷ lệ như thế nào thì hội đồng có trách nhiệm lựa chọn quyển sách ấy".

        Trong Công văn số 2706, Bộ trưởng có nêu một số việc làm của bộ như gửi công văn nhắc nhở các địa phương thực hiện nghiêm túc Thông tư số 25 và cử 8 đoàn thanh tra về một số địa phương. Tuy nhiên, rất tiếc là công văn vẫn chưa giải thích tính hợp lý của quy định tại điểm b khoản 4 điều 8 thông tư nói trên: "Hội đồng bỏ phiếu kín lựa chọn một hoặc một số sách giáo khoa cho mỗi môn học".

        Theo bà Thúy, quy định này sẽ dẫn đến 2 hệ quả. Hệ quả thứ nhất là mâu thuẫn giữa các quy định trong thông tư: theo quy định tại các khoản 1, 2 và 3 điều 8, cơ sở giáo dục phổ thông phải tổ chức xét chọn rất công phu, "tổ chuyên môn tổ chức cho giáo viên nghiên cứu, đánh giá và bỏ phiếu kín lựa chọn sách giáo khoa; cơ sở giáo dục phổ thông tổ chức cuộc họp với thành phần dự họp gồm người đứng đầu, cấp phó người đứng đầu, tổ trưởng tổ chuyên môn và đại diện ban đại diện cha mẹ học sinh để thảo luận, đánh giá sách giáo khoa trên cơ sở danh mục sách giáo khoa do các tổ chuyên môn đề xuất; lựa chọn một sách giáo khoa cho mỗi môn học".

        Tuy vậy, toàn bộ kết quả lựa chọn hết sức công phu của các tập thể và cá nhân trực tiếp sử dụng sách giáo khoa rất có thể bị một hội đồng chỉ gồm 15 người bác bỏ. Lý do bác bỏ có thể chỉ đơn giản là nếu toàn tỉnh (toàn thành phố) sử dụng một quyển sách giáo khoa cho một môn học thì thuận tiện hơn cho cơ quan chỉ đạo. Như vậy có nghĩa là, toàn bộ các quy định ở khoản 1, khoản 2 và khoản 3 bị vô hiệu hóa bằng khoản 4.

        Hệ quả thứ hai, theo bà Thúy là hệ quả trong thực tiễn: "Theo một số ý kiến của công luận, hiện nay, do có nhiều nhà xuất bản tham gia biên soạn và phát hành sách giáo khoa nên đã xuất hiện tình trạng cạnh tranh không lành mạnh với nhiều thủ đoạn tinh vi (nhà xuất bản đầu tư cho sở GD-ĐT để có lợi cho việc phát hành sách của mình; cạnh tranh về tỷ lệ chiết khấu phát hành; vận động không lành mạnh một số địa phương và cán bộ quản lý giáo dục trong việc chỉ định mua sách giáo khoa; chỉ đạo các công ty phát hành sách giáo khoa ở địa phương không được phát hành sách giáo khoa các nhà xuất bản khác…).

        Điều này lẽ ra Bộ GD-ĐT cần lường trước vì không hề khó đoán. Quy định tại khoản 4 điều 8 trao toàn quyền cho hội đồng lựa chọn sách giáo khoa đã tạo điều kiện cho thành viên hội đồng chỉ thực hiện quyền mà không phải chịu trách nhiệm do cơ chế bỏ phiếu kín".

        Cũng theo bà Thúy: "Kẽ hở pháp luật này rất dễ bị lợi dụng, phục vụ cho lợi ích nhóm, vô hiệu hóa quyền dân chủ của cơ sở, làm thiệt hại cho quyền lợi của giáo viên và học sinh. Khi tình trạng lựa chọn sách giáo khoa thiếu khách quan diễn ra tràn lan thì việc lựa chọn sách giáo khoa lại quay về cơ chế chỉ có một bộ sách giáo khoa cho một môn học ở địa phương, tức là triệt tiêu chủ trương "một chương trình - nhiều sách giáo khoa" của Đảng và Nhà nước".
        `,
        isPremium: false,
      },
    ];

    // Chọn ngẫu nhiên phóng viên
    const models = require("../models");
    const writers = await models.User.findAll({
      attributes: ["id"],
      where: {
        typeId: 2,
      },
    });

    items.forEach((item) => {
      let randomAuthor = writers[Math.floor(Math.random() * writers.length)].dataValues;
      console.log(randomAuthor);
      item.authorId = randomAuthor.id;
      item.removedAt = null;
      item.publishedAt = Sequelize.literal("NOW()");
      item.createdAt = Sequelize.literal("NOW()");
      item.updatedAt = Sequelize.literal("NOW()");
    });
    await queryInterface.bulkInsert("Posts", items, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Posts", null, {});
  },
};
