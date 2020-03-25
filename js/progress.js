(function(window){
    function Progress($progressBar,$progressLine,$progressDot){
        return new Progress.prototype.init($progressBar,$progressLine,$progressDot);
    }
    Progress.prototype = {
        constructor:Progress,
        init:function($progressBar,$progressLine,$progressDot){
            this.$progressBar=$progressBar;
            this.$progressLine=$progressLine;
            this.$progressDot=$progressDot;
        },
        isMove:false,
        progressClick:function(callBack){
            var $this=this;//此时的this是progress
            //监听点击
            this.$progressBar.click(function(event){
                //获取进度条距离窗口的距离
                var normalLeft=$(this).offset().left;
               
               //获取点击的位置距离窗口的距离
                var eventLeft=event.pageX;
               
                //设置进度条长度
                $this.$progressLine.css("width",eventLeft-normalLeft);
                $this.$progressDot.css("left",eventLeft-normalLeft);
                //计算进度条比例
                var value=(eventLeft-normalLeft)/$(this).width();
                callBack(value);
            })
        },
        progressMove:function(callBack){
            var $this=this;
            var normalLeft=this.$progressDot.offset().left;
            //1 监听鼠标的按下事件
            var eventLeft;
            this.$progressBar.mousedown(function(){
                //2 监听鼠标的移动事件
                $this.isMove=true;
                $(document).mousemove(function(){
                    eventLeft=event.pageX;
                   
                     //设置进度条长度
                  if(eventLeft>=188.5&&eventLeft<=868)
                    {$this.$progressLine.css("width",eventLeft-normalLeft);
                     $this.$progressDot.css("left",eventLeft-normalLeft);}
                     
                })
            })
            //3 监听鼠标的拍起事件
            $(document).mouseup(function(){
                $(document).off("mousemove");
                $this.isMove=false;
                //计算进度条比例
                var value=(eventLeft-normalLeft)/$this.$progressBar.width();
                callBack(value);
            })
        },
        progressMove2:function(callBack){
            var $this=this;
            var normalLeft=this.$progressDot.offset().left;
            //1 监听鼠标的按下事件
            var eventLeft;
            this.$progressBar.mousedown(function(){
                //2 监听鼠标的移动事件
                $this.isMove=true;
                $(document).mousemove(function(){
                    eventLeft=event.pageX;
                     //设置进度条长度
                    
                  if(eventLeft>1133.5&&eventLeft<=1270)
                    {$this.$progressLine.css("width",eventLeft-normalLeft+120);
                     $this.$progressDot.css("left",eventLeft-normalLeft+120);
                  
                        $(".voice").find("i").removeClass('fa fa-volume-off fa-2x').addClass('fa fa-volume-up fa-2x');
                        console.log("uuuu");
                    }
                     if(eventLeft<=1133.5){
                        $(".voice").find("i").removeClass('fa fa-volume-up fa-2x').addClass('fa fa-volume-off fa-2x');
                    var value=0;
                    callBack(value);}
                     
                    
                })
            })
            //3 监听鼠标的拍起事件
            $(document).mouseup(function(){
                $(document).off("mousemove");
                $this.isMove=false;
                //计算进度条比例
                var value=(eventLeft-normalLeft+125)/$this.$progressBar.width();
                callBack(value);
            })
        },
        setProgress:function(value){
            if(this.isMove) return;
            if(value<0) return;
            this.$progressLine.css({
                width:value+"%"
            });
            this.$progressDot.css({
                left:value+"%"
            })
            
        }
    }
    Progress.prototype.init.prototype=Progress.prototype;
    window.Progress=Progress;
})(window);



