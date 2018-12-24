var container = new Vue({
    el:'#login_container',
    data: {
        host:"localhost:3000",
        status: 1, //0为登陆，1为注册
        id: null,
        password: null,
        password_repeat: null,
        login_message:"登陆",
        register_message:"注册",
    },
    methods:{
        ajax_success:function(data){
            if (data['code'] == 0){
                alert("欢迎使用排课系统");
                window.location.href="schedule.html"
            }
            else {
                alert(data['msg']);
            }
        },
        ajax_error:function(data){
            alert("似乎网络有点问题呢")
        },
        login:function(event){
            $.ajax({
                url:"http://" + container.host + "/users/login",
                type:"POST",
                dataType:"json",
                data:{
                    'id':this.id,
                    'password':this.password
                },
                crossdomain:true,
                success:this.ajax_success,
                error:this.ajax_error,
            })
        },
        register:function(event){
            $.ajax({
                url:"http://" + container.host + "/users/register",
                type:"POST",
                dataType:"json",
                data:{
                    'id':this.id,
                    'password_1':this.password,
                    'password_2':this.password_repeat,
                },
                crossdomain:true,
                success:this.ajax_success,
                error:this.ajax_error,
            })
        },
        user:function(){
            if (this.status == 0) this.login();
            else this.register();
        },
        change_status:function(event){
            this.status = 1 - this.status;
        }
    }
})
