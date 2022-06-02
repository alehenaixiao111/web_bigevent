$(function(){
    const laypage = layui.laypage;
    const form = layui.form;
// 定义一个查询的参数对象，将来请求数据的时候，
    const q = {
        pagenum:1,//页码值，默认为第一个
        pagesize:2,//每页显示的条数
        cate_id:'',//查询分类文章的id
        state:'',//查询文章的状态
     };
     //获取表格数据
     const initTable = ()=>{
         $.ajax({
             type:'GET',
             url:"/my/article/list",
             data:q,
             success:(res)=>{
                 if(res.status !==0)return layer.msg('获取文章列表失败！')
                 const htmlStr = template('tpl-table',res)
                 $('tbody').html(htmlStr)
                 renderPage(res.total)
                 
             },
         });
     };
     const initCate = ()=>{
         $.ajax({
        type: 'GET',
        url:'/my/article/cates',
        success:(res)=>{
            if(res.status !==0)return layer.msg('获取文章列表失败！')
            const htmlStr = template('tpl-cate',res)
            $('[name=cate_id]').html(htmlStr)
            form.render()
           
        }
         })
     };
     //筛选数据
     $('#form-search').submit((e)=>{
         e.preventDefault();
         q.cate_id = $('[name=cate_id]').val();
         q.state = $('[name=state]').val();
         console.log(q);
         initTable();
     });
     //渲染分页
     const renderPage = (total)=>{
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
        count: total, // 总数据条数
        limit: q.pagesize, // 每页显示几条数据
        curr: q.pagenum, // 设置默认被选中的分页
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        limits: [2, 3, 5, 10],// 每页展示多少条
         // 分页发生切换的时候，触发 jump 回调
         jump:(obj,first)=>{
            q.pagenum = obj.curr;
            q.pagesize = obj.limit;
            //渲染时候不调用 只有切换时是才调用
            if(!first){
                initTable();
            }
         },
        });
     };
     
     //删除文章
     $('tbody').on('click','.btn-delete',function(){
         const len = $('.btn-delete').length;
         const id = $(this).attr('data-id');
          // 询问用户是否要删除数据
          layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index){
        $.ajax({
            type:'GET',
            url:'/my/article/delete/'+id,
            success:(res)=>{
                if(res.status !==0)return layer.msg('删除文件失败!')
                layer.msg('删除文件成功！');
                if(len ===1){
                 q.pagenum = q.pagenum === 1 ?1 :q.pagenum -1;   
                }
                initTable();
                layer.close(index)
            },
          });
        });
     });
     initTable();
     initCate();
     // 定义美化时间的过滤器
     template.defaults.imports.dataFormat = function(date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

     return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
       }

   // 定义补零的函数
   function padZero(n) {
    return n > 9 ? n : '0' + n
    }
})