'use strict';

const multer = require(`multer`);
const {nanoid} = require(`nanoid`);
const he = require(`he`);
const {checkObjProp} = require(`../utils`);
const {UPLOAD_DIR} = require(`../const`);

const emptyUser = {
  email: ``,
  password: ``,
};

const newEmptyUser = {
  firstname: ``,
  lastname: ``,
  email: ``,
  password: ``,
  repeat: ``,
};

const getRequestData = (request) => {
  const {body, file} = request;
  const isPictureExist = checkObjProp(file, `filename`);

  const user = {
    firstname: he.escape(body.firstname),
    lastname: he.escape(body.lastname),
    email: he.escape(body.email),
    password: he.escape(body.password),
    repeat: he.escape(body.repeat),
  };
  return [isPictureExist, user];
};

const getRequestLoginData = (request) => {
  const {body} = request;
  return {
    email: he.escape(body.email),
    password: he.escape(body.password),
  };
};

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(6);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `avatar-${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

module.exports = {
  newEmptyUser,
  emptyUser,
  getRequestData,
  upload,
  getRequestLoginData,
};
