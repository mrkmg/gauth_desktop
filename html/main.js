function timer()
{
    var epoch = Math.round(new Date().getTime() / 100.0);
    var countD = 300 - (epoch % 300)
    var countDown = Math.round( countD / 10);
    $('#countdown').text(countDown);
    var percent = Math.round(((countD)/300)*100);
    r = percent + 1;
    g = percent - 1;
    $('#countdown').css({
        'background':
        '-webkit-linear-gradient(left, #bfffc9 '+g+'%,#ffbfbf '+r+'%)'
    });
    if(countD == 50) startFadeoutAll();
    if(countDown == 30) updateAll();
}

function getAllSaved(){
    var keys = $.jStorage.get('saved_keys',{});
    return keys;
}

function addNewKey(name,secret){
    var keys = $.jStorage.get('saved_keys',{});
    keys[name] = secret;
    $.jStorage.set('saved_keys',keys);
}

function removeKey(name){
    var keys = $.jStorage.get('saved_keys',{});
    keys[name] = undefined;
    $.jStorage.set('saved_keys',keys);
}

function startFadeoutAll(){
    var codes = $('.codeCode');
    codes.each(function(){$(this).animate({color:'#F00'},4000);});
}

function updateAll(){
    var codes = $('.code');
    codes.each(function(){
        var secret = $(this).data('secret');
        var otp = googleauth.getOtp(secret);
        $(this).find('.codeCode').text(otp).css({color:'#000'});
    });
}

function addAll(){
    var keys = getAllSaved();
    for(var name in keys){
        addOne(name,keys[name]);
    }
    updateAll();
}

function addOne(name,secret){
    var i = $('<div class="code"></div>');
    var iS = $('<div class="codeCode"></div>');
    var iN = $('<div class="codeName"></div>');
    var rm = $('<button class="codeRemove">Remove</button>');
    i.data('secret',secret);
    iN.text(name);
    i.append(rm,iS,iN);
    //rm.hide();
    $('#codeHolder').append(i);
    i.show();
    resizeBody();
    var doubleCheck = false;
    iS.click(function(){
        setClipboard($(this).text());
        $(this).css({opacity:0});
        $(this).animate({opacity:1},1000);
    });
    rm.click(function(){
        if(doubleCheck == false){
            setTimeout(function(){
                doubleCheck = false;
                rm.text("Remove");
            },5000);
            rm.text("Confirm");
            doubleCheck = true;
            return;
        }
        i.remove()
        removeKey(name);
        resizeBody();
    });
}

function resizeBody(){
    var width = 400;
    var height = $('body').height();
    AppExtend.Resize(width,height);
}

function setClipboard(text){
    AppExtend.SetClipboard(text);
}

$(function () {
    $('#add_new_form').submit(function(ev){
        ev.preventDefault();
        var name = $('#name').val(),
            secret = $('#secret').val();
        if(googleauth.verifySecret(secret)){
            if(name != '' && secret != ''){
                addNewKey(name,secret);
                addOne(name,secret);
                updateAll();
                $('#name').val("");
                $('#secret').val("");
                $('#add_new_holder').hide();
                resizeBody();
             }
        }
    });
    $('#add_new_holder').hide();
    $('#add_new').click(function(){
        $('#add_new_holder').toggle();
        resizeBody();
    });
    addAll();
    timer();
    setInterval(timer,100);
    resizeBody();
    setTimeout(resizeBody,300);
    //AppExtend.EnsureWindowOnTop();
});
