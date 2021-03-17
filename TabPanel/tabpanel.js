// step #07-01
(function($){
    $.fn.tabPanel=function(options){
        this.each(function(index){  
            var tabPanel = new TabPanel(this, options);
             $(this).data("tabPanel", tabPanel); 
        })
        
        return this;
    }
    
    // step #07-02
    $.fn.selectTabPanel=function(tabIndex, animation){
        this.each(function(index){  
            var tabPanel =$(this).data("tabPanel");
            if(tabPanel)
                tabPanel.setSelectTabMenuItemAt(tabIndex, animation);
        })
        
        return this;
    }
})(jQuery);

/*
 * step #03-03 
 *      - effect 추가
 */
//step #02
function TabPanel(selector, options){
    this._$tabPanel = null;
    this._$tabMenu = null;
    this._$tabMenuItems = null;
    this._$selectTabMenuItem = null;
    
    // step #03-01
    this._$tabContents = null;
    this._$selectTabContent = null;

    // step #04-05
    this._effect= null;
    this._tabContentWidth = -1;
    //step #05
    this._options = null;
    
    this._init(selector);
    this._initEvent();
    // step #05
    this._initOptions(options);

    
    // step #03-01
    this._initTabContents();
    
    // step #05
    this.setSelectTabMenuItemAt(this._options.startIndex,false);
}

/*
 * step #02
 *      요소 초기화
 * 
 */
TabPanel.prototype._init=function(selector){
    this._$tabPanel = $(selector);
    this._$tabMenu = this._$tabPanel.children(".tab-menu");

    this._$tabMenuItems = this._$tabMenu.children("li");
    
    // step #03-01
    this._$tabContents = this._$tabPanel.find(".tab-contents .content");
    
     // step #03-03
    this._tabContentWidth = this._$tabPanel.find(".tab-contents").width();   
}


// step #05
// 옵션 초기화
TabPanel.prototype._initOptions=function(options){
    this._options = jQuery.extend({}, TabPanel.defaultOptions, options);
    this._effect = this._options.effect;
    
    console.log(this._options);
}

/*
 * step #02
 *      이벤트 초기화 
 * 
 */
TabPanel.prototype._initEvent=function(){
    var objThis = this;
    this._$tabMenuItems.on("click",function(e){
        e.preventDefault();
        objThis.setSelectTabMenuItem($(this));
    })
}

/* step #03-01
 * 탭 콘텐츠 초기화
 */
TabPanel.prototype._initTabContents=function(){
    
    this._$tabContents.css({
        opacity:0}
     );
}

/*
 * step #03-04
 *      - animation 추가
 * 
 * sptep #02
 *      탭 메뉴  아이템 선택
 */
TabPanel.prototype.setSelectTabMenuItem=function($item, animation){
    if(this._$selectTabMenuItem){
        this._$selectTabMenuItem.removeClass("select");
    }
    this._$selectTabMenuItem = $item;
    this._$selectTabMenuItem.addClass("select"); 
    
    // step #03-01
    var newIndex = this._$tabMenuItems.index(this._$selectTabMenuItem);
    this._showContentAt(newIndex, animation);          
}

/*
 * step #03-04
 *      - animation 추가
 * 
 * step #02
 *      index 번째 탭메뉴 아이템 선택
 */
TabPanel.prototype.setSelectTabMenuItemAt=function(index, animation){
    this.setSelectTabMenuItem(this._$tabMenuItems.eq(index), animation);
}

/*
 * step #03-04
 *      - animation 추가 
 * step #03-01
 * index에 맞는 탭 내용 활성화
 */
TabPanel.prototype._showContentAt=function(index, animation){
    // 1. 활성화/비활성화 탭 내용 찾기
    var $hideContent = this._$selectTabContent;
    var $showContent =  this._$tabContents.eq(index);
   
   // step #04-05
    if(animation==false){
        TabPanel.normalEffect.effect({
            $hideContent:$hideContent,
            $showContent:$showContent
        });
       
    }else {
   
        this._effect.effect({
            $hideContent:$hideContent,
            $showContent:$showContent,            
            showIndex:index,
            tabContentWidth: this._tabContentWidth,
            
            // step #05
            duration : this._options.duration ,
            easing:this._options.easing                    
        });
    }
    // step #03-09
    // 4. 선택 탭 내용 업데이트 
    this._$selectTabContent = $showContent;
}

//step #04-02
// 일반 출력 효과 
TabPanel.normalEffect={
    effect:function(params){
        if(params.$hideContent){
            params.$hideContent.css({
                left:0,
                opacity:0
            });
        }
        
        params.$showContent.css({
            left:0,
            opacity:1
        }); 
    }
}

/*
 * step #04-03
 * 슬라이드 출력 효과
 */
TabPanel.slideEffect={
    effect:function(params){        
        var hideIndex = -1;
         if(params.$hideContent){
             hideIndex= params.$hideContent.index();
         }
    
        // 이동 방향 구하기
        var direction = "";
        if(hideIndex<params.showIndex) 
            direction = "next";
        else
            direction = "prev";
               
        
        // 이동 위치 구하기
        // prev가 기본
        var hideEndLeft = 0;
        var showStartLeft = 0;
    
        if(direction=="next"){
            hideEndLeft = -params.tabContentWidth;
            showStartLeft = params.tabContentWidth;
        }else {
            hideEndLeft =  params.tabContentWidth;
            showStartLeft = -params.tabContentWidth;
        }
        
        // 2. 현재 탭 내용 비활성화
        if(params.$hideContent){
            params.$hideContent.stop().animate({
                left:hideEndLeft,
                opacity:0
            }, params.duration, params.easing);
        }
        
        // 3. 신규 탭 내용 활성화
        // 신규 탭 내용 위치 초기화
        params.$showContent.css({
            left:showStartLeft,
            opacity:0
        } )
       
        // 신규 탭 내용 애니메이션 적용 
        params.$showContent.stop().animate({
            left:0,
            opacity:1
        }, params.duration, params.easing);
    }

}

/*
 * step #04-04
 * 페이드 출력 효과
 */
TabPanel.fadeEffect={
    effect:function(params){
         // 2. 현재 탭 내용 비활성화
        if(params.$hideContent){
            params.$hideContent.stop().animate({
                left:0,
                opacity:0
            }, params.duration, params.easing);
        }
        
        // 3. 신규 탭 내용 활성화
        params.$showContent.stop().animate({
            left:0,
            opacity:1
        }, params.duration, params.easing);
    }
}

// step #05
// 기본 옵션값 
TabPanel.defaultOptions = {
    startIndex:0,
    easing:"easeInCubic",
    duration:500,
    effect: TabPanel.slideEffect     
}

