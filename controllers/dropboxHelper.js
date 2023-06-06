'use strict'
// imports...
const dropbox = require('dropbox')

var helper = {}

const ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN
const dropboxClient = new dropbox.Dropbox({
  accessToken: ACCESS_TOKEN
})

// upload
helper.upload = (file, des) => {
  return dropboxClient.filesUpload({
    path: destination,
    contents: file
  })
}

// Get temp link
helper.getTempLink = async (destination) => {
  const response = await dropboxClient.filesGetTemporaryLink({
    path: destination
  })
  return response.result.link
}

module.exports = helper

