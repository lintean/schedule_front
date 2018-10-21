var container = new Vue({
    el:'#schedule_container',
    data: {
        status: 1, 
        day:null,
        course:null,
        classroom: null,
        capacity: null,
        class_number: null,
        query_number:null,
        teacher_list:null,
        subject_list:null,
        list_onview:Array(),
        list_type:0, //0为老师，1为学科
        select_val:0,
        select_list:{0:"教师不排课时间", 1:"学科不排课时间"},
        onview:0,
        onview_data:null,
        cell_width:0,
        cell_height:0,
        query_type:0,
        query_onview:0,
        schedule:Array(),
        analysis_msg:["还没好分析好呢"],
        schedule_msg:"号教室",
    },
    methods:{
        // ajax_success:function(data, callback){
        //     if (data['code'] == 0){
        //         callback(data);
        //     }else{
        //         alert(data['msg']);
        //     }
        // },
        ajax_error:function(data){
            alert("似乎网络有点问题呢")
        },
        // register:function(event){
        //     $.ajax({
        //         url:"http://localhost:3000/users/register",
        //         type:"POST",
        //         data:{
        //             'id':this.id,
        //             'password_1':this.password,
        //             'password_2':this.password_repeat,
        //         },
        //         crossDomain:true,
        //         success:this.ajax_success,
        //         error:this.ajax_error,
        //     })
        // },
        upload_teacher:function(event){
            $("#teacher").click();
        },
        upload_student:function(event){
            $("#student").click();
        },
        showPic:function(name){
            var Path;
            if (name == "Teacher") Path = $("#teacher").val();
            else Path = $("#student").val();
            console.log(Path);
            //判断是否有选择上传文件
            if (Path == "") {
                alert("请选择上传文件！");
                return;
            }
            //判断上传文件的后缀名
            var strExtension = Path.substr(Path.lastIndexOf('.') + 1);
            if (strExtension != 'xls' && strExtension != 'xlsx') {
                alert("请选择excel文件");
                return;
            }
            //判断上传文件的名称
            var str = Path.substr(Path.lastIndexOf('\\') + 1, Path.lastIndexOf('.') - Path.lastIndexOf('\\') - 1);
            if (str != name) {
                alert("请选择名称为" + name + "的excel文件");
                return;
            }
        },
        upload:function(){
            var exceldata = new FormData();
            var teacher = $("#teacher")[0].files[0];
            var student = $("#student")[0].files[0];
            exceldata.append("myfile",teacher);
            exceldata.append("myfile",student);
            $.ajax({
                type: "POST",
                url:'http://localhost:3000/users/upload',
                data:exceldata,
                cache: false,
                contentType: false,
                processData: false,
                crossDomain: true,
                dataType:"json",
                success: function(data){
                    if (data['code'] == 0) {
                        alert("已成功上传");
                        container.status = 2;
                    } else {
                        alert(data['msg']);
                    }
                },
                error:this.ajax_error
            });
        },
        limit:function(){
            $.ajax({
                url:"http://localhost:3000/users/limit",
                type:"POST",
                data:{
                    'day':this.day,
                    'course':this.course,
                    'classroom':this.classroom,
                    'capacity':this.capacity,
                    'class':this.class_number,
                },
                crossDomain:true,
                dataType:"json",
                success:function(data){
                    if (data['code'] == 0) {
                        container.status = 3;
                    } else {
                        alert(data['msg']);
                    }
                },
                error:this.ajax_error,
            })
        },
        loadlist:function(id,name,type){
            $.ajax({
                url:"http://localhost:3000/users/get_timetable",
                type:"GET",
                data:{
                    'id':id,
                    'name':name,
                    'type':type,
                },
                crossDomain:true,
                dataType:"json",
                success:function(data){
                    if (data != null) {
                        //load list_onview
                        container.list_onview = data;

                        var height = (window.innerHeight - 200) / (container.list_onview.length + 1);
                        var width = (window.innerWidth - 200) / (container.list_onview[0].length + 1);
                        
                        container.cell_height = height;
                        container.cell_width = width;

                        $('#mytbody').css('width', window.innerWidth - 200 + "px");
                        $('#mytbody').css('height', height * container.list_onview.length + "px");
                        
                        // $('.box_right>table>thead>tr>th').css('height', height + "px");
                        // $('.box_right>table>thead>tr>th').css('width', width + "px");


                        container.onview = 1;
                        container.onview_data = {
                            'id': id,
                            'name': name,
                            'type': type
                        }


                    } else {
                        alert("迷之失败");
                    }
                },
                error:this.ajax_error,
            })
        },
        write_table:function(){
            $.ajax({
                url:"http://localhost:3000/users/write_timetable",
                type:"POST",
                traditional:true,
                data:{
                    'id': this.onview_data.id,
                    'name': this.onview_data.name,
                    'type': this.onview_data.type,
                    'timetable': JSON.stringify(this.list_onview)
                },
                crossDomain:true,
                dataType:"json",
                success:function(data){
                    if (data['code'] == 0){
                        alert("修改成功");
                    }else{
                        alert(data['msg']);
                    }
                },
                error:this.ajax_error,
            })
        },
        changeList:function(index1, index2, newValue){
            if (newValue == 1){
                container.list_onview[index1].splice(index2, 1, 0);
            };
            if (newValue == 0){
                container.list_onview[index1].splice(index2, 1, 1);
            };
            
        },
        run:function(){
            $.ajax({
                url:"http://localhost:3000/users/run",
                type:"GET",
                data:null,
                crossDomain:true,
                dataType:"json",
                success:function(data){
                    if (data['code'] == 0){
                        alert("排课已完成");
                        container.status = 5;
                    }else{
                        alert(data['msg']);
                    }
                },
                error:this.ajax_error,
            })
        },
        query:function(){
            
            $.ajax({
                url:"http://localhost:3000/users/get_schedule",
                type:"GET",
                data:{
                    'id': this.query_number,
                    'type': this.query_type
                },
                crossDomain:true,
                dataType:"json",
                success:function(data){
                    if (data['code'] == 0){
                        if (container.query_type == 2) container.schedule_msg = "";
                        else container.schedule_msg = "号教室";

                        container.query_onview = 1;
            
                        container.schedule = data['schedule'];
            
                        var height = (window.innerHeight - 200) / (container.schedule.length + 1);
                        var width = (window.innerWidth - 200) / (container.schedule[0].length + 1);
            
                        $('#mytbody').css('width', window.innerWidth - 220 + "px");
                        $('#mytbody').css('height', height * container.schedule.length + "px");
            
                        container.cell_height = height;
                        container.cell_width = width;
                    }else{
                        alert(data['msg']);
                    }
                },
                error:this.ajax_error,
            })
        }
    },
    watch:{
        status:function(newStatus, oldStatus){
            if (newStatus == 3){

                $.ajax({
                    url:"http://localhost:3000/users/getlist",
                    type:"GET",
                    data:null,
                    crossDomain:true,
                    dataType:"json",
                    success:function(data){
                        if (data['subject_list'] != null || data['teacher_list'] != null){
                            container.subject_list = data['subject_list'];
                            container.teacher_list = data['teacher_list'];     
                        }else{
                            alert(data['msg']);
                        }
                    },
                    error:this.ajax_error,
                })  
            }
            else
            if (newStatus == 4){
                $.ajax({
                    url:"http://localhost:3000/users/get_analysis",
                    type:"GET",
                    data:null,
                    crossDomain:true,
                    dataType:"json",
                    success:function(data){
                        if (data['code'] == 0){
                            alert("排课预分析完毕");
                            container.analysis_msg = data['analysis'];
                        }else{
                            alert(data['msg']);
                        }
                    },
                    error:this.ajax_error,
                })  
            }
        },
        select_val:function(newVal, oldVal){
            this.list_type = newVal;
        }
    }
})


var winHeight = window.innerHeight;
var winWidth = window.innerWidth;
$(document).ready(function(){
    $('#schedule_container').css('height', window.innerHeight - 50 + "px");
    $('#box_left').css('height', window.innerHeight - 250 + "px");
    $('#box_right').css('height', window.innerHeight - 250 + "px");
    $('#left_table_teacher>tbody').css('max-height', window.innerHeight - 300 + "px");
    $('#left_table_subject>tbody').css('max-height', window.innerHeight - 300 + "px");

    $('#left_contain').css('height', window.innerHeight - 250 + "px");

    $('#schedule_msg').css('height', window.innerHeight - 280 + "px");
    // $('#output_result .left_contain').css('height', window.innerHeight - 250 + "px");
})
