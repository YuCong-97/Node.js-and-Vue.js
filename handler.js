//该js专门定义回调函数
var util=require("util");
var fs = require("fs");
var JSON_USERS_PATH="/src/jsons/users.json"

//判断用户是否注册
//user:用户json对象  list:用户的json对象列表
function IsUserRegisted(user,list)
{
	var bool=false;
    for(var i=0;i<list.length;i++)
		if (user.account==list[i].account)
				bool=true;
	return bool;
}

//通过账户名获得json对象
//account:账户名字符串	list:用户的json对象列表
function getUserByAccount(account,list)
{
	var user=null
	for(var i=0;i<list.length;i++)
	{
		if (account==list[i].account)
		{
			user=list[i];
		    break;
		}
	}	
	return user;
}

//通过账户名删除json对象
//account:账户名字符串	list:用户的json对象列表
function delUserByAccount(account,list)
{
	var index=-1
	for(var i=0;i<list.length;i++)
	{
		if (account==list[i].account)
		{
			index=i;
			break;
		}
	}	
	return index;
}
//获得指定路径的json对象
//path:当前网站根目录下的路径
function getJson(path)
{
	var json=null;
	fs.readFile( __dirname +path, 'utf8', function (err, data) {
       if(err)
	   {
		   console.error(err);
		   return json;
	   }
	   json=JSON.parse(data);
    });
	return json
}

//post方式传递用户信息
exports.postUserData=function(req,res)
{
	// 输出 JSON 格式
   var response = {
       "first_name":req.body.first_name,
       "last_name":req.body.last_name
   };
   console.log(__filename+":72")
   console.log(response);
   res.write(JSON.stringify(response))
   res.end();
}

//get方式传递用户信息
exports.getUserData=function(req,res)
{
	// 输出 JSON 格式
    var response = {
       "first_name":req.query.first_name,
       "last_name":req.query.last_name
    };
	console.log(__filename+":86")
    console.log(response.first_name);
    res.write(JSON.stringify(response))
    res.end();
}

//get方式获取用户们的json(GET)
exports.listUsers=function(req,res)
{
	//设置显示格式
    res.set(
    {
	    'Content-Type': 'text/json; charset=utf-8',
    });
	var users=getJson(JSON_USERS_PATH);
	fs.readFile( __dirname +JSON_USERS_PATH, 'utf8', function (err, data) {
	   console.log(__filename+":102")
       console.log( data );
       res.end( data);
    });
}

/*
//添加的新用户数据
var user = {
    "account" : "efg",
	"pwd" : "efg",
	"name" : "小红",
	"sex" : "女",
	"birth" : "1999-10-10"
}
*/
//get方式添加用户(PUT)
exports.addUser=function(req,res)
{
	//设置显示格式(处理中文乱码)
    res.set(
    {
	    'Content-Type': 'text/json; charset=utf-8',
    });
	// 读取已存在的数据
    fs.readFile( __dirname +JSON_USERS_PATH, 'utf8', function (err, data) {
		var users = JSON.parse(data);//将二进制装换成json对象
		var user=JSON.parse(req.params.user);
	    //错误处理
	    if(err)
		   return console.error(err);
	    if(IsUserRegisted(user,users.list))
		{
			console.log(__filename+":133")
			console.log("用户已存在!");
			res.end("用户已存在!");
			return;
		}
	    //获取json数据并添加
		users.list.push(user);//添加user
		users["Total"]=users.list.length;//更新总数
		console.log(__filename+":141")
        console.log( users );
        res.end(JSON.stringify(users));
	    var strUsers= JSON.stringify(users);//json转换成字符串
	    //写入json中
	    fs.writeFile( __dirname + JSON_USERS_PATH,strUsers,function(err,data){
		    if(err)
				return console.error(err);
			console.log("新增成功!");
	    });  
    });
}

//get方式获得指定用户(GET)
exports.getUser=function(req,res)
{
	//设置显示格式
    res.set(
    {
	    'Content-Type': 'text/json; charset=utf-8',
    });
	// 首先我们读取已存在的用户
    fs.readFile( __dirname + JSON_USERS_PATH, 'utf8', function (err, data) {
       users = JSON.parse( data );
       var user = getUserByAccount(req.params.account,users.list)
	   console.log(__filename+":166")
       console.log( user );
       res.end( JSON.stringify(user));
    });
}

//get方式删除指定用户(DELETE)
exports.delUser=function(req,res)
{
	//设置显示格式
    res.set(
    {
	    'Content-Type': 'text/json; charset=utf-8',
    });
	// First read existing users.
    fs.readFile( __dirname + JSON_USERS_PATH, 'utf8', function (err, data) {
		users = JSON.parse( data );
		//获得需要删除的下标
        index=delUserByAccount(req.params.account,users.list)
		if(index!=-1)
		{
			//显示要删除的用户信息
			res.end(users.list[index]);
			users.list.splice(index,1);//删除user
			users["Total"]=users.list.length;//更新总数
			var strUsers=JSON.stringify(users);
			//更新json文件
			fs.writeFile(__dirname + JSON_USERS_PATH,strUsers,function(err,data)
			{
				if(err)
					return console.err(err);
			});
			console.log(__filename+":190");
			console.log( users );	
		}
		else
		{
			console.log(__filename+":199");
			console.log("不存在需要删除的用户");
			res.end("不存在需要删除的用户");
		}
    });
}
   

//get方式进入根目录
exports.getRoot=function(req,res)
{
   res.sendFile( __dirname + "/src/" + "index.html" );
   //获得用户cookies
   console.log(__filename+":203")
   console.log("Cookies: " + util.inspect(req.cookies));
}

//post方式上传文件
exports.postFileUpload=function(req,res)
{
   console.log(__filename+":210")
   console.log(req.files[0]);  // 上传的文件信息
   var des_file = __dirname + "/" + req.files[0].originalname;//保存路径
   fs.readFile( req.files[0].path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
        if(err)
            console.log( err );
        else
            response = 
			{
                   message:'File uploaded successfully', 
                   filename:req.files[0].originalname
            };
     
            console.log( response );
            res.end( JSON.stringify( response ) );
       });
   });
}
 