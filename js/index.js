/**
 * ITCAST WEB
 * Created by zhousg on 2016/10/28.
 */
$(function(){
    /*轮播图*/
    banner();
    /*tab切换*/
    tab();
    /*初始化工具提示*/
    $('[data-toggle="tooltip"]').tooltip();
});

/*轮播图*/
function banner(){
    /*
    * 需求：
    * 1.需要数据  后台获取   异步获取  ajax
    * 2.获取当前设备   是pc端还是m端   通过屏幕的宽度
    * 3.根据当前设备去解析数据  把json格式的数据转化成html结构的代码  （动态创建元素，拼接字符串，模版引擎）
    * 3.1 artTemplate   这里推荐使用一下  underscore(工具函数库 简洁 使用的是 template 模版方法 )
    * 4.把html代码渲染在页面当中   html();innerHTML
    * 5.测试 改变屏幕的尺寸   resize （bug？）
    * 6.在移动端可以滑动手势切换
    * */

    /*编码*/

    /*1.需要数据*/
    var getData = function(callback){
        if(window.bannerData){
            callback && callback(window.bannerData);
            return false;
        }
        $.ajax({
            type:'get',
            url:'js/data.json?_='+Date.now(),
            data:{},
            dataType:'json',
            success: function (data) {
                /*当我第一次请求到数据的时候  记录下来*/
                window.bannerData = data;
                callback && callback(window.bannerData);
            },
            error:function(msg){
                console.log(msg);
            }
        });
    }

    /*渲染轮播图*/
    var renderHtml = function(){
        /*1.需要数据*/
        getData(function(data){
            /*2.获取当前设备*/
            var width = $(window).width();
            /*通过屏幕的宽度判断什么设备  768px一下的都认为是移动端*/
            var isMobile = width < 768 ? true : false;
            /*3.根据当前设备去解析数据*/
            var templatePoint = $('#point_template').html();
            var templateImage = $('#image_template').html();

            var templatePointFuc = _.template(templatePoint);
            var templateImageFuc = _.template(templateImage);

            var htmlPoint = templatePointFuc({model:data});
            var htmlImage = templateImageFuc({model:data,isM:isMobile});

            /*.template('point_template',{model:data});*/

            /*4.把html代码渲染在页面当中 */
            $('.carousel-indicators').html(htmlPoint);
            $('.carousel-inner').html(htmlImage);

        })
    }

    /*页面初始化调用*/
    /*renderHtml();*/

    /*5.测试*/
    $(window).on('resize',function(){
        renderHtml();
    }).trigger('resize');/*trigger  js主动触发事件*/

    /*6.在移动端可以滑动手势切换*/
    /*使用jquery绑定touch事件的时候  返回的event对象不是touchevent 而是originalEvent */
    var startX = 0;
    var moveX = 0;
    var distanceX = 0;
    var isMove = false;
    $('.carousel')
        .on('touchstart',function(e){
            startX = e.originalEvent.touches[0].clientX;
        })
        .on('touchmove',function(e){
            moveX = e.originalEvent.touches[0].clientX;
            distanceX = moveX -startX;
            isMove = true;
        })
        .on('touchend',function(e){
            /*在滑动事件结束的时候采取判断是什么手势*/
            console.log(distanceX);
            /*如果是正的  向右滑*/
            /*如果是负的  向左滑*/
            /*假设滑动的距离超过了60才算是手势*/
            /*滑动过*/
            if(isMove && Math.abs(distanceX) > 60){
                if(distanceX>0){
                    /*右滑 上一张*/
                    $('.carousel').carousel('prev');
                }else{
                    /*左滑 下一张*/
                    $('.carousel').carousel('next');
                }
            }
        });
}

/*tab切换*/
function tab(){
    /*
    * 1.需要父容器和子容器构成滑动组件的前提
    * 2.子容器能完全放下 所有的页签
    * 3.使用iscroll初始化滑动组件  试用的子封装的插件
    * */

    var parent = $('.nav-tabs-parent');/*父容器*/

    var child = parent.children();/*子容器*/

    var lis = child.find('li');/*所有的盒子*/

    var width = 0;/*记录宽度只和*/

    lis.each(function(i,obj){
        width += $(obj).outerWidth(true);
        /*
        * 1. width()  获取的内容的宽度
        * 2. innerWidth() 获取的是 内容+内边距
        * 3. outerWidth() 获取的是  内容+ 内边距 + 边框、
        * 4. outerWidth(true) 获取的是  内容+ 内边距 + 边框  +  外边距
        * */
    });

    child.width(width);

    /*swipe*/
    itcast.iScroll({
        swipeDom:parent.get(0),
        swipeType:'x',
        swipeDistance:50
    });

}