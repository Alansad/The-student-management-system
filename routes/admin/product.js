/**
 * Created by Administrator on 2017/8/18 0018.
 */
var express=require('express');
var router = express.Router();   /*可使用 express.Router 类创建模块化、可挂载的路由句柄*/

var DB=require('../../modules/db.js');  /*引入DB数据库*/

var multiparty = require('multiparty');  /*图片上传模块  即可以获取form表单的数据 也可以实现上传图片*/
var  fs=require('fs');

router.get('/',function(req,res){
    DB.find('student',{},function(err,data){

        res.render('admin/product/index',{
            list:data
        });
    })

})
router.get('/search',function(req,res){

    res.render('admin/product/search');

})
router.get('/inputScore',function(req,res){

    res.render('admin/product/inputScore');

})
router.get('/searchScore',function(req,res){

    res.render('admin/product/searchScore');

})
router.get('/searchteacher',function(req,res){

    res.render('admin/product/searchteacher');

})
router.get('/average',function(req,res){

    res.render('admin/product/average');

})
router.get('/danger',function(req,res){

    res.render('admin/product/danger');

})
router.get('/addbukao',function(req,res){

    res.render('admin/product/addbukao',{
        details:''
    });

})
router.get('/addbukaoscore',function(req,res){

    res.render('admin/product/addbukaoscore');

})
router.get('/bukaostudent',function(req,res){

    res.render('admin/product/bukaostudent');

})
router.get('/dobukaostudent',function(req,res){

    //获取get传值 id
    var course=req.query.course;
    DB.find('studentcore',{"course":course,"bukao":2},function(err,data){
        res.render('admin/product/dobukaostudent',{
            list:data
        });
    })
})
router.post('/doaddbukao',function(req,res){
    //获取表单的数据 以及post过来的图片

    var form = new multiparty.Form();

    form.uploadDir='upload'   //上传图片保存的地址     目录必须存在

    form.parse(req, function(err, fields, files) {

        //获取提交的数据以及图片上传成功返回的图片信息
        //
        //console.log(fields);  /*获取表单的数据*/
        //
        //console.log(files);  /*图片上传成功返回的信息*/
        var number=parseInt(fields.number[0]);
        var name=fields.name[0];
        var course=fields.course[0];

        DB.find('studentcore',{"number":number,"name":name,"course":course,"bukao":1},function(err,data){
            if(data.length > 0){
                var setdata = {
                    "number":data[0].number,
                    "name":data[0].name,
                    "course":data[0].course,
                    "value":data[0].value,
                    "property":data[0].property,
                    "教师":data[0].教师,
                    "period":data[0].period,
                    "score":data[0].score,
                    "bukao":2
                };
                DB.update('studentcore',{
                    "number":number,
                    "name":name,
                    "course":course
                },setdata,function(err,data){
                    res.render("admin/product/addbukao",{
                        "details":"补考成功"
                    });
                })
            }else{
                res.render("admin/product/addbukao",{
                    "details":"信息错误或您不能补考"
                });
            }
        })

    });

})
router.get('/dodanger',function(req,res){
    DB.find('dangerstudent',{},function(err,data){

        res.render('admin/product/dodanger',{
            list:data
        });
    });
})
router.get('/doaverage',function(req,res){

    //获取get传值 id

    var number=parseInt(req.query.number);
    var name=req.query.name;

    console.log(number);
    console.log(name);
    //去数据库查询这个id对应的数据     自增长的id 要用{"_id":new DB.ObjectID(id)
    if(isNaN(number) && name == ''){
        DB.find('studentcore',{},function(err,data){
            var average = 0;
            var b_average = 0;
            var b = 0;
            var x_average = 0;
            var x = 0;
            var number = data[0].number;
            var name = data[0].name;
            for(var i = 0;i<data.length;i++){
                average += data[i].score;
                if(data[i].property == "必修"){
                    b++;
                    b_average += data[i].score;
                }
                if(data[i].property == "选修"){
                    x++;
                    x_average += data[i].score;
                }
            }
            console.log(data.length);
            console.log(b);
            console.log(x);
            average = average/data.length;
            b_average = b_average/b;
            x_average = x_average/x;
            console.log(average);
            console.log(b_average);
            console.log(x_average);
            res.render('admin/product/doaverage',{
                "average":average,
                "b_average":b_average,
                "x_average":x_average,
                "number":number,
                "name":name
            });
        });
    }else if(isNaN(number) && name != ''){
        DB.find('studentcore',{"name":name},function(err,data){
            var average = 0;
            var b_average = 0;
            var b = 0;
            var x_average = 0;
            var x = 0;
            var number = data[0].number;
            var name = data[0].name;
            for(var i = 0;i<data.length;i++){
                average += data[i].score;
                if(data[i].property == "必修"){
                    b++;
                    b_average += data[i].score;
                }
                if(data[i].property == "选修"){
                    x++;
                    x_average += data[i].score;
                }
            }
            console.log(data.length);
            console.log(b);
            console.log(x);
            average = average/data.length;
            b_average = b_average/b;
            x_average = x_average/x;
            res.render('admin/product/doaverage',{
                "average":average,
                "b_average":b_average,
                "x_average":x_average,
                "number":number,
                "name":name
            });
        });
    }else if(!isNaN(number) && name == ''){
        DB.find('studentcore',{"number":number},function(err,data){
            var average = 0;
            var b_average = 0;
            var b = 0;
            var x_average = 0;
            var x = 0;
            var number = data[0].number;
            var name = data[0].name;
            for(var i = 0;i<data.length;i++){
                average += data[i].score;
                if(data[i].property == "必修"){
                    b++;
                    b_average += data[i].score;
                }
                if(data[i].property == "选修"){
                    x++;
                    x_average += data[i].score;
                }
            }
            console.log(data.length);
            console.log(b);
            console.log(x);
            average = average/data.length;
            b_average = b_average/b;
            x_average = x_average/x;
            res.render('admin/product/doaverage',{
                "average":average,
                "b_average":b_average,
                "x_average":x_average,
                "number":number,
                "name":name
            });
        });
    }else if(!isNaN(number) && name != ''){
        DB.find('studentcore',{"number":number,"name":name},function(err,data){
            var average = 0;
            var b_average = 0;
            var b = 0;
            var x_average = 0;
            var x = 0;
            var number = data[0].number;
            var name = data[0].name;
            for(var i = 0;i<data.length;i++){
                average += data[i].score;
                if(data[i].property == "必修"){
                    b++;
                    b_average += data[i].score;
                }
                if(data[i].property == "选修"){
                    x++;
                    x_average += data[i].score;
                }
            }
            console.log(data.length);
            console.log(b);
            console.log(x);
            average = average/data.length;
            b_average = b_average/b;
            x_average = x_average/x;
            res.render('admin/product/doaverage',{
                "average":average,
                "b_average":b_average,
                "x_average":x_average,
                "number":number,
                "name":name
            });
        });
    }

})
router.get('/dosearchteacher',function(req,res){

    //获取get传值 id

    var number=parseInt(req.query.number);
    var name=req.query.name;

    console.log(number);
    console.log(name);
    //去数据库查询这个id对应的数据     自增长的id 要用{"_id":new DB.ObjectID(id)
    if(isNaN(number) && name == ''){
        DB.find('studentcore',{},function(err,data){

            res.render('admin/product/dosearchteacher',{
                list:data
            });
        });
    }else if(isNaN(number) && name != ''){
        DB.find('studentcore',{"name":name},function(err,data){

            res.render('admin/product/dosearchteacher',{
                list:data
            });
        });
    }else if(!isNaN(number) && name == ''){
        DB.find('studentcore',{"number":number},function(err,data){

            res.render('admin/product/dosearchteacher',{
                list:data
            });
        });
    }else if(!isNaN(number) && name != ''){
        DB.find('studentcore',{"number":number,"name":name},function(err,data){

            res.render('admin/product/dosearchteacher',{
                list:data
            });
        });
    }

})
router.get('/doSearchscore',function(req,res){

    //获取get传值 id

    var number=parseInt(req.query.number);
    var name=req.query.name;

    console.log(number);
    console.log(name);
    //去数据库查询这个id对应的数据     自增长的id 要用{"_id":new DB.ObjectID(id)
    if(isNaN(number) && name == ''){
        DB.find('studentcore',{},function(err,data){

            res.render('admin/product/dosearchScore',{
                list:data
            });
        });
    }else if(isNaN(number) && name != ''){
        DB.find('studentcore',{"name":name},function(err,data){

            res.render('admin/product/dosearchScore',{
                list:data
            });
        });
    }else if(!isNaN(number) && name == ''){
        DB.find('studentcore',{"number":number},function(err,data){

            res.render('admin/product/dosearchScore',{
                list:data
            });
        });
    }else if(!isNaN(number) && name != ''){
        DB.find('studentcore',{"number":number,"name":name},function(err,data){

            res.render('admin/product/dosearchScore',{
                list:data
            });
        });
    }

})

router.get('/doSearch',function(req,res){

    //获取get传值 id

    var number=parseInt(req.query.number);
    var name=req.query.name;
    var major=req.query.major;
    console.log(number);
    console.log(name);
    console.log(major);
    //去数据库查询这个id对应的数据     自增长的id 要用{"_id":new DB.ObjectID(id)
    if(isNaN(number) && name == '' && major == ''){
        DB.find('student',{},function(err,data){

            res.render('admin/product/doSearch',{
                list:data
            });
        });
    }else if(isNaN(number) && name == '' && major != ''){
        DB.find('student',{"major":major},function(err,data){

            res.render('admin/product/doSearch',{
                list:data
            });
        });
    }else if(isNaN(number) && name != '' && major == ''){
        DB.find('student',{"name":name},function(err,data){

            res.render('admin/product/doSearch',{
                list:data
            });
        });
    }else if(!isNaN(number) && name == '' && major == ''){
        DB.find('student',{"number":number},function(err,data){

            res.render('admin/product/doSearch',{
                list:data
            });
        });
    }else if(!isNaN(number) && name != '' && major == ''){
        DB.find('student',{"number":number,"name":name},function(err,data){

            res.render('admin/product/doSearch',{
                list:data
            });
        });
    }else if(!isNaN(number) && name == '' && major != ''){
        DB.find('student',{"number":number,"major":major},function(err,data){

            res.render('admin/product/doSearch',{
                list:data
            });
        });
    }else if(isNaN(number) && name != '' && major != ''){
        DB.find('student',{"name":name,"major":major},function(err,data){

            res.render('admin/product/doSearch',{
                list:data
            });
        });
    }else if(!isNaN(number) && name != '' && major != ''){
        DB.find('student',{"number":number,"name":name,"major":major},function(err,data){

            res.render('admin/product/doSearch',{
                list:data
            });
        });
    }

})

//处理登录的业务逻辑
router.get('/add',function(req,res){
     res.render('admin/product/add');

})
//doAdd
router.post('/doAdd',function(req,res){
    //获取表单的数据 以及post过来的图片

    var form = new multiparty.Form();

    form.uploadDir='upload'   //上传图片保存的地址     目录必须存在

    form.parse(req, function(err, fields, files) {
        console.log(fields);
        //获取提交的数据以及图片上传成功返回的图片信息
        //
        //console.log(fields);  /*获取表单的数据*/
        //
        //console.log(files);  /*图片上传成功返回的信息*/
        var number=parseInt(fields.number[0]);
        var name=fields.name[0];
        var date=fields.date[0];
        var sex=fields.sex[0];
        var clas=fields.class[0];
        var major=fields.major[0];
        //console.log(pic);
        if(date != '' && number >0 && name != ''){
            new Promise((resolve,reject) =>{
                DB.find('student',{"number":number},(err,data)=>{
                    console.log("data的长度为:"+data.length);
                    if(data.length > 0){
                        res.render('admin/product/doadd',{
                            msg:"学号为"+number+"的人已存在"
                        });
                    }else{
                        DB.find('school',{"major":major,"class":clas},(err,data) => {
                            if(data.length > 0){
                                DB.insert('student',{
                                    number,
                                    name,
                                    sex,
                                    date,
                                    "class":clas,
                                    major
                                },function(err,data){
                                    if(!err){
                                        res.render('admin/product/doadd',{
                                            msg:"添加成功"
                                        }); /*上传成功跳转到首页*/
                                    }

                                })
                            }else{
                                res.render('admin/product/doadd',{
                                    msg:"专业和班级不对应"
                                });
                            }
                        })

                    }
                })
            })
        }else if(name == ''){
            res.render('admin/product/doadd',{
                msg:"姓名不能为空"
            });
        }
        else if(date == ''){
            res.render('admin/product/doadd',{
                msg:"日期不能为空"
            });
        }else{
            res.render('admin/product/doadd',{
                msg:"学号应该为正数"
            });
        }
    });

})

router.get('/delete',function(req,res){
    //获取id

    var  id=req.query.id;

    DB.deleteOne('student',{"_id":new DB.ObjectID(id)},function(err){

        if(!err){

            res.redirect('/admin/product');
        }
    })

})

router.get('/inputScore',function(req,res){

    res.render('admin/product/inputScore',{
        msg:""
    });

})
router.post('/doinputscore',function(req,res) {
    //获取表单的数据 以及post过来的图片

    var form = new multiparty.Form();

    form.parse(req, function (err, fields, files) {

        //获取提交的数据以及图片上传成功返回的图片信息
        //
        //console.log(fields);  /*获取表单的数据*/
        //
        //console.log(files);  /*图片上传成功返回的信息*/
        var course = fields.course[0];
        var number = parseInt(fields.number[0]);
        var name = fields.name[0];
        var score = fields.score[0];
        var bukao = 0;
        if (score < 60) {
            bukao = 1;
        }
        if(score>=0 &&score <=100){
            DB.find('studentcore',{"number":number,"name":name,"course":course},(err,data)=>{
                if(data.length>0){
                    res.render("admin/product/doinputScore",{
                        msg:"成绩已经存在，登入成绩失败"
                    })
                }else{
                    new Promise((resolve,reject) => {
                        DB.find('student',{"number":number,"name":name},(err,data)=>{
                            if(data.length > 0 ){
                                resolve(data)
                            }else{
                                res.render("admin/product/doinputScore",{
                                    msg:"学号或姓名错误"
                                })
                            }
                        })
                    }).then((result)=>{
                        DB.find('course',{"class":result[0].class,"course":course},(err,data)=>{
                            if(data.length > 0){
                                DB.insert('studentcore', {
                                    course,
                                    number,
                                    name,
                                    score,
                                    "property":data[0].property,
                                    "value":data[0].value,
                                    "教师": data[0].teacher,
                                    bukao
                                }, function (err, data) {
                                    res.render("admin/product/doinputscore",{
                                        msg:"成功"
                                    });
                                });
                            }else{
                                res.render("admin/product/doinputscore",{
                                    msg:"课程错误"
                                });
                            }
                        })

                    })
                }
            })
        }else{
            res.render("admin/product/doinputscore",{
                msg:"成绩必须为0到100"
            });
        }

        //console.log(pic);
    })
})
router.post('/doaddbukaoscore',function(req,res) {
    //获取表单的数据 以及post过来的图片

    var form = new multiparty.Form();

    form.parse(req, function (err, fields, files) {

        //获取提交的数据以及图片上传成功返回的图片信息
        //
        //console.log(fields);  /*获取表单的数据*/
        //
        //console.log(files);  /*图片上传成功返回的信息*/
        var course = fields.course[0];
        var number = parseInt(fields.number[0]);
        var name = fields.name[0];
        var score = fields.score[0];
        var bukao = 3;
        if(score >=0 && score <= 100){
            DB.find('studentcore',{"number":number,"name":name,"course":course,"bukao":2},(err,data)=>{
                if(data.length>0){
                    var promise = new Promise((resolve, reject)=> {
                        DB.update('studentcore', {
                            course,
                            number,
                            name,
                            score,
                        }, {
                            course,
                            number,
                            name,
                            score,
                            "property":data[0].property,
                            "value":data[0].value,
                            "教师": data[0].教师,
                            "period":data[0].period,
                            bukao
                        },function (err, data) {
                            console.log("1");
                            resolve(number);
                        });
                    }).then((num)=>{
                        new Promise((resolve,reject)=>{
                            console.log("number is:"+number);
                            console.log("2");
                            DB.find('studentcore',{"number":num,"bukao":3},function(err,data){
                                console.log(data.length);
                                var sum = 0;
                                for(let i = 0;i<data.length;i++){
                                    if(data[i].property == "必修" && data[i].score <60){
                                        sum += data[i].value;
                                    }
                                }
                                var name = data[0].name;
                                resolve({"number":num,"name":name,"sum":sum});
                            });
                        }).then((result)=>{
                            new Promise((resolve,reject)=>{
                                console.log("3");
                                console.log("result学号为"+result.number);
                                console.log("result姓名为"+result.name);
                                console.log("result挂科为"+result.sum);
                                var setdata = {
                                    "number":result.number,
                                    "name":result.name,
                                    "lost":result.sum
                                }
                                if(result.sum>12){
                                    DB.find('dangerstudent',{"number":setdata.number},(err,data)=>{
                                        if(data.length > 0){
                                            DB.update('dangerstudent',{"number":setdata.number},setdata,(err,data)=>{
                                            })
                                        }else{
                                            DB.insert('dangerstudent',setdata,function(err,data){
                                            })
                                        }
                                    })
                                }
                                res.render("admin/product/doaddbukaoscore",{
                                    msg:"成功"
                                });
                            }).catch((error)=>{
                                console.log(error);
                            })
                        })
                    }).catch((error)=>{
                        console.log(error);
                        res.render("admin/product/doaddbukaoscore",{
                            msg:"失败"
                        })
                    })
                }else{
                    res.render("admin/product/doaddbukaoscore",{
                        msg:"信息有误或不能登入补考成绩"
                    })
                }
            })
        }else{
            res.render("admin/product/doaddbukaoscore",{
                msg:"成绩必须为0到100"
            })
        }

        //console.log(pic);

    });

})
module.exports = router;   /*暴露这个 router模块*/