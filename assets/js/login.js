$(function(){
      // 点击去注册账号让 登录框隐藏，注册框显示
    $('#link_reg').click(() =>{
        $('.login-box').hide()
        $('.reg-box').show()
    });
    // 点击去登录让注册框隐藏，登录框显示
    $('#link_login').click(() =>{
        $('.login-box').show()
        $('.reg-box').hide()
    });
    //引入 form框架
    const form = layui.form;
    const layer = layui.layer;
    //自定意校驗規則
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位,且不能出现空格'],
            //确认密码校验规则
        repwd:(value)=>{
        //1.获取当前输入的值
        //2.获取密码框的值
        //3.两者进行判断
        //4.如果不一致，提示消息
        const pwd = $('#form_reg [name=password]').val();
        if(pwd != value)return "两次密码不一致";
        }
    });
    //设置根路径
    // const baseurl =`http://www.liulongbin.top:3007`;
    //注册功能
    $('#form_reg').on('submit',(e)=>{
    //设置阻止默认提交事件
    e.preventDefault();
    $.ajax({
        type:'POST',
        url:'/api/reguser',
        data:{
            username:$('#form_reg [name=username]').val(),
            password:$('#form_reg [name=password]').val(),
        },
        success:(res)=>{
            if(res.status !=0)return layer.msg('注册失败');
            layer.msg('注册成功');
            $('#link_login').click()
        }
    })
    });
    //登录功能
    $('#form_login').on('submit',function(e){
        e.preventDefault();
        $.ajax({
            type:'POST',
            url:'/api/login',
            data:$(this).serialize(),
            success:function(res){
           if(res.status != 0)return layer.msg('登录失败！')
           layer.msg('登录成功！')
           //登录成功后把令牌存放到本地
           localStorage.setItem('token',res.token);
           //跳转到首页
           location.href = '/index.html';
            }
        })
    });
})