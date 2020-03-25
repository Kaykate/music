$(function(){
    //自定义音乐菜单滚动条
    $(".content_list").mCustomScrollbar();
    var $audio=$("audio");
    var player=new Player($audio);
    var progress;
    var voiceProgress;
    var lyric;
    getPlayerList();
  
    //加载歌曲列表
    function getPlayerList(){

        $.ajax({
            url:"./source/musiclist.json",//从哪儿加载
            dataType:"json",//加载的是什么类型
            success:function(data){//成功了干啥
               player.musicList=data;
                //遍历获取到了的数据，创建每一条音乐
                
               var $musicList=$(".content_list ul");
               $.each(data,function(index,ele){
                   
                   var $item=createMusicItem(index,ele);
                   $musicList.append($item);
                   
               });
               initMusicInfo(data[0]);//默认加载第零手歌曲
               initMusicLyric(data[0]);
            },
            error:function(e){//没成功干啥
                console.log(e);
            }
        });
    }
    //初始化歌曲信息
    function initMusicInfo(music){
        //获取对应的元素
        var $musicImage=$(".song_info_pic img");
        var $musicName=$(".song_info_name a");
        var $musicSinger=$(".song_info_singer a");
        var $musicAlbum=$(".song_info_album a");
        var $musicProgressName=$(".music_progress_name");
        var $musicProgressTime=$(".music_progress_time");
        var $musicBg=$(".mask_bg");
        //给元素赋值
        $musicImage.attr("src",music.cover);
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicAlbum.text(music.album);
        $musicProgressName.text(music.name+" / "+music.singer);
        $musicProgressTime.text("00:00 / "+music.time);
        $musicBg.css("background","url('"+music.cover+"')");
    };
    //初始化歌词信息
    function initMusicLyric(music){
        lyric=new Lyric(music.link_lrc);
        var $lyricContainer=$(".song_lyric");
        //清空上一首音乐的歌词
        $lyricContainer.html("");
        lyric.loadLyric(function(){
            //创建歌词列表
            $.each(lyric.lyrics,function (index,ele) {
                var $item=$("<li>"+ele+"</li>");
                $lyricContainer.append($item);
            })
        });
    }
    //点击事件
    initEvents();
    function initEvents(){
 //子菜单的展示与消失
 $(".content_list").delegate(".list_music","mouseenter",function(){
    $(this).find(".list_menu").stop().fadeIn(100);
    $(this).find(".list_time>span").stop().fadeOut(100);
    $(this).find(".list_time>a").stop().fadeIn(100);
   
});
$(".content_list").delegate(".list_music","mouseleave",function(){
    $(this).find(".list_menu").stop().fadeOut(100);
    $(this).find(".list_time>span").stop().fadeIn(100);
    $(this).find(".list_time>a").stop().fadeOut(100);
})

//监听复选框
$(".content_list").delegate(".list_check","click",function(){
//.css("opacity","1");
if( $(this).find("i").hasClass('fa fa-check')){
    $(this).find("i").removeClass('fa fa-check').css("opacity","0.5");;
}else{
    $(this).find("i").addClass('fa fa-check').css("opacity","1");;
}
})


/*var count=0;
console.log(count);
$(".list_check").click(function(){
    count++;
    if(count%2==0){
        $(this).find("i").removeClass('fa fa-check').removeAttr("aria-hidden","true");
    }else{
        $(this).find("i").addClass('fa fa-check').attr("aria-hidden","true");
    }
});*/
$(".music_fav").click(function(){
    if( $(this).find("i").hasClass('fa fa-star fa-2x')){
        $(this).find("i").removeClass('fa fa-star fa-2x').addClass('fa fa-star-o fa-2x');
    }else{
        $(this).find("i").removeClass('fa fa-star-o fa-2x').addClass('fa fa-star fa-2x')
    }
});

$(".music_only").click(function(){
   
    if( $(this).find("i").hasClass('fa fa-toggle-on fa-2x')){
        $(this).find("i").removeClass('fa fa-toggle-on fa-2x').addClass('fa fa-toggle-off fa-2x');
    }else{
        $(this).find("i").removeClass('fa fa-toggle-off fa-2x').addClass('fa fa-toggle-on fa-2x')
    }
});

$(".music_play").click(function(){
    if( $(this).find("i").hasClass('fa fa-play fa-3x')){
        $(this).find("i").removeClass('fa fa-play fa-3x').addClass('fa fa-pause fa-3x');
    }else{
        $(this).find("i").removeClass('fa fa-pause fa-3x').addClass('fa fa-play fa-3x')
    }
});

$(".music_mode").click(function(){
  
    if( $(this).find("i").hasClass('fa fa-random fa-2x')){
        $(this).find("i").removeClass('fa fa-random fa-2x').addClass('fa fa-exchange fa-2x');
    }else{
        $(this).find("i").removeClass('fa fa-exchange fa-2x').addClass('fa fa-random fa-2x')
    }
});
initProgress();
 //初始化进度条
 function initProgress(){
   
    var $progressBar=$(".music_progress_bar");
    var $progressLine=$(".music_progress_line");
    var $progressDot=$(".music_progress_dot");
    progress=Progress($progressBar,$progressLine,$progressDot);
    progress.progressClick(function (value){
        player.musicSeekTo(value);
    });
    progress.progressMove(function (value){
        player.musicSeekTo(value);
    });
    getPlayerList();
    
    

    var $voiceBar=$(".music_voice_bar");
    var $voiceLine=$(".music_voice_line");
    var $voiceDot=$(".music_voice_dot");
    voiceProgress=Progress($voiceBar,$voiceLine,$voiceDot);
    voiceProgress.progressClick(function (value){
       player.musicVoiceSeekTo(value);
    });
    voiceProgress.progressMove2(function (value){
        player.musicVoiceSeekTo(value);
    });
 }
  
//添加在子菜单播放器按钮的监听
$(".content_list").delegate(".list_menu_play","click",function(){
    var $item=$(this).parents(".list_music");
  /*console.log($item.get(0).index);
  console.log($item.get(0).music);*/

    //切换播放图标
    if( $(this).find("i").hasClass('fa fa-play-circle fa-2x')){
        $(this).find("i").removeClass('fa fa-play-circle fa-2x').addClass('fa fa-pause-circle fa-2x');
       //让文字高亮
       $(this).parents(".list_music").find("div").css("color","#fff");
       $(this).parents(".list_music").siblings().find("div").css("color","rgba(255,255,255,0.5)");
    }else{
        $(this).find("i").removeClass('fa fa-pause-circle fa-2x').addClass('fa fa-play-circle fa-2x');
        $(this).parents(".list_music").find("div").css("color","rgba(255,255,255,0.5)");
    }
  // $(this).parents(".list_music").siblings().find(".list_menu_play i").removeClass("fa fa-pause-circle fa-2x").addClass('fa fa-play-circle fa-2x');
    //同步底部播放按钮
    if( $(this).find("i").hasClass('fa fa-play-circle fa-2x') ){//当前子菜单是播放状态
        $(".music_play").find("i").removeClass('fa fa-pause fa-3x').addClass('fa fa-play fa-3x');//底部也播放
    }else{
        $(".music_play").find("i").removeClass('fa fa-play fa-3x').addClass('fa fa-pause fa-3x');
    }
   
    //切换序号状态
    $(this).parents(".list_music").find(".list_number").toggleClass("list_number2");
    $(this).parents(".list_music").siblings().find(".list_number").removeClass("list_number2");

    //播放音乐
    player.playMusic($item.get(0).index,$item.get(0).music);
    //切换歌曲信息
    initMusicInfo($item.get(0).music);
    //切换歌词信息
    initMusicLyric($item.get(0).music);
    

   
})

    var $musicPlay=$(".music_play");
    //控制底部区域播放按钮点击
    $(".music_play").click(function(){
        //判断有没有播放过音乐
       if(player.currentIndex==-1){
            //没有播放过音乐
          $(".list_music").eq(0).find(".list_menu_play>i").trigger("click");
        }else{
            //播放过 
            $(".list_music").eq(player.currentIndex).find(".list_menu_play>i").trigger("click");
        }
      
    })
    //控制底部区域上一首按钮点击
    $(".music_pre").click(function(){
        $(".list_music").eq(player.preIndex()).find(".list_menu_play>i").trigger("click");
    })
    //控制底部区域下一首按钮点击
    $(".music_next").click(function(){
        $(".list_music").eq(player.nextIndex()).find(".list_menu_play>i").trigger("click");
    })
    //监听删除按钮的点击
    $(".content_list").delegate(".list_menu_del","click",function(){
        //找到被点击的音乐
        var $item=$(this).parents(".list_music");
        //判断当前删除的是否是正在播放的
        if($item.get(0).index==player.currentIndex){
            $(".music_next").trigger("click");
        }else{

        }
        $item.remove();
        player.changeMusic($item.get(0).index);
        //重新排序
        $(".list_music").each(function(index,ele){
            ele.index=index;
            $(ele).find(".list_number").text(index+1);
        })
    })
    //监听播放的进度
    player.musicTimeUpdate(function(currentTime,duration,timeStr){
        //同步时间
        $(".music_progress_time").text(timeStr);
        //同步进度条
        //计算播放比例
        var value=currentTime/duration*100;
        //if(value>100)
       // $(".list_music").eq(player.nextIndex()).find(".list_menu_play>i").trigger("click");
        progress.setProgress(value);
        //实现歌词的同步
        var index=lyric.currentIndex(currentTime);
        var $item=$(".song_lyric li").eq(index);
        $item.addClass("cur");
        $item.siblings().removeClass("cur");
        if(index<=2) return;
        $(".song_lyric").css({
            marginTop:((-index+2)*30),
        })

    })
    //监听声音按钮的点击
    $(".voice").click(function(){
        if( $(this).find("i").hasClass('fa fa-volume-off fa-2x')){
            $(this).find("i").removeClass('fa fa-volume-off fa-2x').addClass('fa fa-volume-up fa-2x');
            player.musicVoiceSeekTo(1);
        }else{
            $(this).find("i").removeClass('fa fa-volume-up fa-2x').addClass('fa fa-volume-off fa-2x')
            player.musicVoiceSeekTo(0);
        }
        
    })
   
    }
   
    //创建音乐
    function createMusicItem(index,music){
     
        var $item = $("" +
        "<li class=\"list_music\">\n" +
            "<div class=\"list_check\"><i></i></div>\n" +
            "<div class=\"list_number\">"+(index + 1)+"</div>\n" +
            "<div class=\"list_name\">"+music.name+"" +
            "     <div class=\"list_menu\">\n" +
            "          <a href=\"javascript:;\" title=\"播放\" class='list_menu_play'><i class='fa fa-play-circle fa-2x' aria-hidden=\"true\" ></i></a>\n" +
            "          <a href=\"javascript:;\" title=\"添加\"><i class='fa fa-plus-circle fa-2x' aria-hidden=\"true\"></i></a>\n" +
            "          <a href=\"javascript:;\" title=\"下载\"><i class='fa fa-arrow-circle-down fa-2x' aria-hidden=\"true\"></i></a>\n" +
            "          <a href=\"javascript:;\" title=\"分享\"><i class='fa fa-users fa-2x' aria-hidden=\"true\"></i></a>\n" +
            "     </div>\n" +
            "</div>\n" +
            "<div class=\"list_singer\">"+music.singer+"</div>\n" +
            "<div class=\"list_time\">\n" +
            "     <span>"+music.time+"</span>\n" +
            "     <a href=\"javascript:;\" title=\"删除\" class='list_menu_del'><i class='fa fa-trash fa-2x' aria-hidden=\"true\"></i></a>\n" +
            "</div>\n" +
        "</li>");

        $item.get(0).index=index;
        $item.get(0).music=music;
        return $item;
    }
});