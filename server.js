//工具加载
var handler=require("./handler");
var express = require("express");
var vue=require("vue");
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
var multer  = require("multer");
var fs = require('fs');


//服务器事件绑定
var app = express();
//用于cookie解析
app.use(cookieParser())
//用于post解析,可用req.body
app.use(bodyParser.urlencoded({ extended: false }));
//用于上传路径的绑定
app.use(multer({ dest: '/tmp/'}).array('image'));
//设置可访问路径
app.use('/src', express.static('src'));



//get方式访问'/'路径
app.get('/', function(req, res) {
	handler.getRoot(req,res)
}) 

//get方式传递用户信息
app.get('/getUserData', function(req, res) {
	handler.getUserData(req,res);
})

//get方式获取用户们的信息(GET)
app.get('/listUsers',function(req,res){
	handler.listUsers(req,res);
})

//get方式添加用户(PUT)
app.get('/addUser/:user', function (req, res) {
    handler.addUser(req,res);
})

//get方式获得指定用户信息(GET)
app.get('/getUser/:account', function (req, res) {
	handler.getUser(req,res);
})

//get方式删除指定用户(DELETE)
app.get('/delUser/:account', function (req, res) {
	handler.delUser(req,res);
})

//post方式传递用户信息
app.post('/postUserData', function (req, res) {
	handler.postUserData(req,res);	
})

//post方式上传文件
app.post('/postFileUpload', function (req, res) {
   handler.postFileUpload(req,res);
})



//创建服务器
var server = app.listen(8081, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})