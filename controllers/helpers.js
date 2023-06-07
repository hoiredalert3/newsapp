'use strict'

const helper = {}

// "Tue Jun 06 2023 20:13:57 GMT+0700 (Indochina Time)";
helper.convertToVietnameseDateTime = (datetimeStr) => {
    const datetime = new Date(datetimeStr)
    return datetime.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
}

module.exports = helper;