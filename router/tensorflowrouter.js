const python-shell = require("python-shell");
const router= require('express').Router;
const db = require('../db/DBHelper.js');


const python_root = "";
python-shell.script(python_root);
router.get();
router.port();

