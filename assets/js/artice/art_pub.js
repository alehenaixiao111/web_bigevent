$(function(){

          // 初始化富文本编辑器
          initEditor()
    const form = layui.form;

    const initCate = ()=>{
        $.ajax({
        type:'GET',
        url:'/my/article/cates',
        success:(res)=>{
           if(res.status !==0)return layer.msg('获取数据失败！')
           const htmlStr = template('tpl-cate',res)
        //    console.log(htmlStr);
           $('[name=cate_id]').html(htmlStr)
            form.render()
        }
        })
    };
       // 1. 初始化图片裁剪器
       var $image = $('#image')       

       // 2. 裁剪选项
       var options = {
           aspectRatio: 400 / 280,
           preview: '.img-preview'
       }
       
      // 3. 初始化裁剪区域
      $image.cropper(options)

       //模拟文件选择
       $('#btnChooseImage').click(()=>{
           $('#coverFile').click();
       })
       //更换图片
       $('#coverFile').on('change',(e)=>{
           const files = e.target.files;
           if(files.length <=0) return;
           //把图片转为路径
           const imgUrl = URL.createObjectURL(files[0])
         // 为裁剪区域重新设置图片
        $image
        .cropper('destroy') // 销毁旧的裁剪区域
        .attr('src', imgUrl) // 重新设置图片路径
        .cropper(options) // 重新初始化裁剪区域
       });

       //声明文章状态
       let art_state = '已发布' 
       $('#btnSave2').click(()=>{
        art_state = '草稿'
       });
       //新增文章
       $('.layui-form').on('submit', function(e){
           e.preventDefault();
           const fd = new FormData($(this)[0])
           fd.append('state',art_state);
            // 4. 将封面裁剪过后的图片，输出为一个文件对象
              $image
              .cropper('getCroppedCanvas', {
              // 创建一个 Canvas 画布
              width: 400,
              height: 280
          })
              .toBlob(function(blob) {
              // 将 Canvas 画布上的内容，转化为文件对象
              // 得到文件对象后，进行后续的操作
              // 5. 将文件对象，存储到 fd 中
              fd.append('cover_img', blob)
              console.log(111);
           // 6. 发起 ajax 数据请求
           publishArticle(fd)
        });
       });
       //发送请求 
       const publishArticle = (data)=>{
           $.ajax({
            type: 'POST',
            url:'/my/article/add',
            data,
             // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success:(res)=>{
            if(res.status !==0)return layer.msg('发布文章失败！');
            location.href = '/artice/art_list.html';
            window.parent.change()
            }
           })
       };

          //获取文章分类
          initCate();
});