googleauth = {};

googleauth.getOtp = function(secret){
    var key = googleauth.base32tohex(secret);
    var epoch = Math.round(new Date().getTime() / 1000.0);
    var time = googleauth.leftpad(googleauth.dec2hex(Math.floor(epoch / 30)), 16, '0');

    var hmacObj = new jsSHA(time, 'HEX');
    var hmac = hmacObj.getHMAC(key, 'HEX', 'SHA-1', "HEX");


    if (hmac == 'KEY MUST BE IN BYTE INCREMENTS') {
        $('#hmac').append($('<span/>').addClass('label important').append(hmac));
    } else {
        var offset = googleauth.hex2dec(hmac.substring(hmac.length - 1));
        var part1 = hmac.substr(0, offset * 2);
        var part2 = hmac.substr(offset * 2, 8);
        var part3 = hmac.substr(offset * 2 + 8, hmac.length - offset);
    }

    var otp = (googleauth.hex2dec(hmac.substr(offset * 2, 8)) & googleauth.hex2dec('7fffffff')) + '';
    otp = (otp).substr(otp.length - 6, 6);

    return otp;
};

googleauth.verifySecret = function(secret){
    var key = googleauth.base32tohex(secret);
    var epoch = Math.round(new Date().getTime() / 1000.0);
    var time = googleauth.leftpad(googleauth.dec2hex(Math.floor(epoch / 30)), 16, '0');

    var hmacObj = new jsSHA(time, 'HEX');
    var hmac = hmacObj.getHMAC(key, 'HEX', 'SHA-1', "HEX");

    return !(hmac == 'KEY MUST BE IN BYTE INCREMENTS');
};

googleauth.dec2hex = function(s){
    return (s < 15.5 ? '0' : '') + Math.round(s).toString(16);
};

googleauth.hex2dec = function(s){
    return parseInt(s, 16);
};

googleauth.leftpad = function(s,l,p){
    if (l + 1 >= s.length) {
        s = Array(l + 1 - s.length).join(p) + s;
    }
    return s;
};

googleauth.base32tohex = function(base32){
    var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    var bits = "";
    var hex = "";

    for (var i = 0; i < base32.length; i++) {
        var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
        bits += googleauth.leftpad(val.toString(2), 5, '0');
    }

    for (var i = 0; i+4 <= bits.length; i+=4) {
        var chunk = bits.substr(i, 4);
        hex = hex + parseInt(chunk, 2).toString(16) ;
    }
    return hex;
};

(function() {/*
 A JavaScript implementation of the SHA family of hashes, as defined in FIPS
 PUB 180-2 as well as the corresponding HMAC implementation as defined in
 FIPS PUB 198a

 Copyright Brian Turek 2008-2012
 Distributed under the BSD License
 See http://caligatio.github.com/jsSHA/ for more information

 Several functions taken from Paul Johnson
*/
function q(a){throw a;}var r=null;function s(a,c){this.a=a;this.b=c}function y(a,c){var b=[],g=(1<<c)-1,f=a.length*c,h;for(h=0;h<f;h+=c)b[h>>>5]|=(a.charCodeAt(h/c)&g)<<32-c-h%32;return{value:b,binLen:f}}function z(a){var c=[],b=a.length,g,f;0!==b%2&&q("String of HEX type must be in byte increments");for(g=0;g<b;g+=2)f=parseInt(a.substr(g,2),16),isNaN(f)&&q("String of HEX type contains invalid characters"),c[g>>>3]|=f<<24-4*(g%8);return{value:c,binLen:4*b}}
function B(a){var c=[],b=0,g,f,h,j,l;-1===a.search(/^[a-zA-Z0-9=+\/]+$/)&&q("Invalid character in base-64 string");g=a.indexOf("=");a=a.replace(/\=/g,"");-1!==g&&g<a.length&&q("Invalid '=' found in base-64 string");for(f=0;f<a.length;f+=4){l=a.substr(f,4);for(h=j=0;h<l.length;h+=1)g="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(l[h]),j|=g<<18-6*h;for(h=0;h<l.length-1;h+=1)c[b>>2]|=(j>>>16-8*h&255)<<24-8*(b%4),b+=1}return{value:c,binLen:8*b}}
function E(a,c){var b="",g=4*a.length,f,h;for(f=0;f<g;f+=1)h=a[f>>>2]>>>8*(3-f%4),b+="0123456789abcdef".charAt(h>>>4&15)+"0123456789abcdef".charAt(h&15);return c.outputUpper?b.toUpperCase():b}
function F(a,c){var b="",g=4*a.length,f,h,j;for(f=0;f<g;f+=3){j=(a[f>>>2]>>>8*(3-f%4)&255)<<16|(a[f+1>>>2]>>>8*(3-(f+1)%4)&255)<<8|a[f+2>>>2]>>>8*(3-(f+2)%4)&255;for(h=0;4>h;h+=1)b=8*f+6*h<=32*a.length?b+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(j>>>6*(3-h)&63):b+c.b64Pad}return b}
function I(a){var c={outputUpper:!1,b64Pad:"="};try{a.hasOwnProperty("outputUpper")&&(c.outputUpper=a.outputUpper),a.hasOwnProperty("b64Pad")&&(c.b64Pad=a.b64Pad)}catch(b){}"boolean"!==typeof c.outputUpper&&q("Invalid outputUpper formatting option");"string"!==typeof c.b64Pad&&q("Invalid b64Pad formatting option");return c}function K(a,c){return a>>>c|a<<32-c}
function R(a,c){var b=r,b=new s(a.a,a.b);return b=32>=c?new s(b.a>>>c|b.b<<32-c&4294967295,b.b>>>c|b.a<<32-c&4294967295):new s(b.b>>>c-32|b.a<<64-c&4294967295,b.a>>>c-32|b.b<<64-c&4294967295)}function S(a,c){var b=r;return b=32>=c?new s(a.a>>>c,a.b>>>c|a.a<<32-c&4294967295):new s(0,a.a>>>c-32)}function T(a,c,b){return a&c^~a&b}function U(a,c,b){return new s(a.a&c.a^~a.a&b.a,a.b&c.b^~a.b&b.b)}function V(a,c,b){return a&c^a&b^c&b}
function aa(a,c,b){return new s(a.a&c.a^a.a&b.a^c.a&b.a,a.b&c.b^a.b&b.b^c.b&b.b)}function ba(a){return K(a,2)^K(a,13)^K(a,22)}function ca(a){var c=R(a,28),b=R(a,34);a=R(a,39);return new s(c.a^b.a^a.a,c.b^b.b^a.b)}function da(a){return K(a,6)^K(a,11)^K(a,25)}function ea(a){var c=R(a,14),b=R(a,18);a=R(a,41);return new s(c.a^b.a^a.a,c.b^b.b^a.b)}function fa(a){return K(a,7)^K(a,18)^a>>>3}function ga(a){var c=R(a,1),b=R(a,8);a=S(a,7);return new s(c.a^b.a^a.a,c.b^b.b^a.b)}
function ha(a){return K(a,17)^K(a,19)^a>>>10}function ia(a){var c=R(a,19),b=R(a,61);a=S(a,6);return new s(c.a^b.a^a.a,c.b^b.b^a.b)}function W(a,c){var b=(a&65535)+(c&65535);return((a>>>16)+(c>>>16)+(b>>>16)&65535)<<16|b&65535}function ja(a,c,b,g){var f=(a&65535)+(c&65535)+(b&65535)+(g&65535);return((a>>>16)+(c>>>16)+(b>>>16)+(g>>>16)+(f>>>16)&65535)<<16|f&65535}
function X(a,c,b,g,f){var h=(a&65535)+(c&65535)+(b&65535)+(g&65535)+(f&65535);return((a>>>16)+(c>>>16)+(b>>>16)+(g>>>16)+(f>>>16)+(h>>>16)&65535)<<16|h&65535}function ka(a,c){var b,g,f;b=(a.b&65535)+(c.b&65535);g=(a.b>>>16)+(c.b>>>16)+(b>>>16);f=(g&65535)<<16|b&65535;b=(a.a&65535)+(c.a&65535)+(g>>>16);g=(a.a>>>16)+(c.a>>>16)+(b>>>16);return new s((g&65535)<<16|b&65535,f)}
function la(a,c,b,g){var f,h,j;f=(a.b&65535)+(c.b&65535)+(b.b&65535)+(g.b&65535);h=(a.b>>>16)+(c.b>>>16)+(b.b>>>16)+(g.b>>>16)+(f>>>16);j=(h&65535)<<16|f&65535;f=(a.a&65535)+(c.a&65535)+(b.a&65535)+(g.a&65535)+(h>>>16);h=(a.a>>>16)+(c.a>>>16)+(b.a>>>16)+(g.a>>>16)+(f>>>16);return new s((h&65535)<<16|f&65535,j)}
function ma(a,c,b,g,f){var h,j,l;h=(a.b&65535)+(c.b&65535)+(b.b&65535)+(g.b&65535)+(f.b&65535);j=(a.b>>>16)+(c.b>>>16)+(b.b>>>16)+(g.b>>>16)+(f.b>>>16)+(h>>>16);l=(j&65535)<<16|h&65535;h=(a.a&65535)+(c.a&65535)+(b.a&65535)+(g.a&65535)+(f.a&65535)+(j>>>16);j=(a.a>>>16)+(c.a>>>16)+(b.a>>>16)+(g.a>>>16)+(f.a>>>16)+(h>>>16);return new s((j&65535)<<16|h&65535,l)}
function Z(a,c){var b=[],g,f,h,j,l,n,p,k,m,e=[1732584193,4023233417,2562383102,271733878,3285377520],A=[1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1518500249,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,1859775393,
1859775393,1859775393,1859775393,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,2400959708,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782,3395469782];a[c>>>5]|=128<<24-c%32;a[(c+
65>>>9<<4)+15]=c;m=a.length;for(p=0;p<m;p+=16){g=e[0];f=e[1];h=e[2];j=e[3];l=e[4];for(k=0;80>k;k+=1)b[k]=16>k?a[k+p]:(b[k-3]^b[k-8]^b[k-14]^b[k-16])<<1|(b[k-3]^b[k-8]^b[k-14]^b[k-16])>>>31,n=20>k?X(g<<5|g>>>27,f&h^~f&j,l,A[k],b[k]):40>k?X(g<<5|g>>>27,f^h^j,l,A[k],b[k]):60>k?X(g<<5|g>>>27,V(f,h,j),l,A[k],b[k]):X(g<<5|g>>>27,f^h^j,l,A[k],b[k]),l=j,j=h,h=f<<30|f>>>2,f=g,g=n;e[0]=W(g,e[0]);e[1]=W(f,e[1]);e[2]=W(h,e[2]);e[3]=W(j,e[3]);e[4]=W(l,e[4])}return e}
function $(a,c,b){var g,f,h,j,l,n,p,k,m,e,A,G,t,L,w,u,M,N,x,C,D,v,O,P,d,Q,H=[],Y,J;"SHA-224"===b||"SHA-256"===b?(A=64,g=(c+65>>>9<<4)+15,L=16,w=1,d=Number,u=W,M=ja,N=X,x=fa,C=ha,D=ba,v=da,P=V,O=T,Q=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,
3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],e="SHA-224"===b?[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428]:[1779033703,
3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]):"SHA-384"===b||"SHA-512"===b?(A=80,g=(c+128>>>10<<5)+31,L=32,w=2,d=s,u=ka,M=la,N=ma,x=ga,C=ia,D=ca,v=ea,P=aa,O=U,Q=[new d(1116352408,3609767458),new d(1899447441,602891725),new d(3049323471,3964484399),new d(3921009573,2173295548),new d(961987163,4081628472),new d(1508970993,3053834265),new d(2453635748,2937671579),new d(2870763221,3664609560),new d(3624381080,2734883394),new d(310598401,1164996542),new d(607225278,1323610764),
new d(1426881987,3590304994),new d(1925078388,4068182383),new d(2162078206,991336113),new d(2614888103,633803317),new d(3248222580,3479774868),new d(3835390401,2666613458),new d(4022224774,944711139),new d(264347078,2341262773),new d(604807628,2007800933),new d(770255983,1495990901),new d(1249150122,1856431235),new d(1555081692,3175218132),new d(1996064986,2198950837),new d(2554220882,3999719339),new d(2821834349,766784016),new d(2952996808,2566594879),new d(3210313671,3203337956),new d(3336571891,
1034457026),new d(3584528711,2466948901),new d(113926993,3758326383),new d(338241895,168717936),new d(666307205,1188179964),new d(773529912,1546045734),new d(1294757372,1522805485),new d(1396182291,2643833823),new d(1695183700,2343527390),new d(1986661051,1014477480),new d(2177026350,1206759142),new d(2456956037,344077627),new d(2730485921,1290863460),new d(2820302411,3158454273),new d(3259730800,3505952657),new d(3345764771,106217008),new d(3516065817,3606008344),new d(3600352804,1432725776),new d(4094571909,
1467031594),new d(275423344,851169720),new d(430227734,3100823752),new d(506948616,1363258195),new d(659060556,3750685593),new d(883997877,3785050280),new d(958139571,3318307427),new d(1322822218,3812723403),new d(1537002063,2003034995),new d(1747873779,3602036899),new d(1955562222,1575990012),new d(2024104815,1125592928),new d(2227730452,2716904306),new d(2361852424,442776044),new d(2428436474,593698344),new d(2756734187,3733110249),new d(3204031479,2999351573),new d(3329325298,3815920427),new d(3391569614,
3928383900),new d(3515267271,566280711),new d(3940187606,3454069534),new d(4118630271,4000239992),new d(116418474,1914138554),new d(174292421,2731055270),new d(289380356,3203993006),new d(460393269,320620315),new d(685471733,587496836),new d(852142971,1086792851),new d(1017036298,365543100),new d(1126000580,2618297676),new d(1288033470,3409855158),new d(1501505948,4234509866),new d(1607167915,987167468),new d(1816402316,1246189591)],e="SHA-384"===b?[new d(3418070365,3238371032),new d(1654270250,914150663),
new d(2438529370,812702999),new d(355462360,4144912697),new d(1731405415,4290775857),new d(41048885895,1750603025),new d(3675008525,1694076839),new d(1203062813,3204075428)]:[new d(1779033703,4089235720),new d(3144134277,2227873595),new d(1013904242,4271175723),new d(2773480762,1595750129),new d(1359893119,2917565137),new d(2600822924,725511199),new d(528734635,4215389547),new d(1541459225,327033209)]):q("Unexpected error in SHA-2 implementation");a[c>>>5]|=128<<24-c%32;a[g]=c;Y=a.length;for(G=0;G<
Y;G+=L){c=e[0];g=e[1];f=e[2];h=e[3];j=e[4];l=e[5];n=e[6];p=e[7];for(t=0;t<A;t+=1)H[t]=16>t?new d(a[t*w+G],a[t*w+G+1]):M(C(H[t-2]),H[t-7],x(H[t-15]),H[t-16]),k=N(p,v(j),O(j,l,n),Q[t],H[t]),m=u(D(c),P(c,g,f)),p=n,n=l,l=j,j=u(h,k),h=f,f=g,g=c,c=u(k,m);e[0]=u(c,e[0]);e[1]=u(g,e[1]);e[2]=u(f,e[2]);e[3]=u(h,e[3]);e[4]=u(j,e[4]);e[5]=u(l,e[5]);e[6]=u(n,e[6]);e[7]=u(p,e[7])}"SHA-224"===b?J=[e[0],e[1],e[2],e[3],e[4],e[5],e[6]]:"SHA-256"===b?J=e:"SHA-384"===b?J=[e[0].a,e[0].b,e[1].a,e[1].b,e[2].a,e[2].b,e[3].a,
e[3].b,e[4].a,e[4].b,e[5].a,e[5].b]:"SHA-512"===b?J=[e[0].a,e[0].b,e[1].a,e[1].b,e[2].a,e[2].b,e[3].a,e[3].b,e[4].a,e[4].b,e[5].a,e[5].b,e[6].a,e[6].b,e[7].a,e[7].b]:q("Unexpected error in SHA-2 implementation");return J}
window.jsSHA=function(a,c,b){var g=r,f=r,h=r,j=r,l=r,n=0,p=[0],k=0,m=r,k="undefined"!==typeof b?b:8;8===k||16===k||q("charSize must be 8 or 16");"HEX"===c?(0!==a.length%2&&q("srcString of HEX type must be in byte increments"),m=z(a),n=m.binLen,p=m.value):"ASCII"===c||"TEXT"===c?(m=y(a,k),n=m.binLen,p=m.value):"B64"===c?(m=B(a),n=m.binLen,p=m.value):q("inputFormat must be HEX, TEXT, ASCII, or B64");this.getHash=function(a,c,b){var k=r,m=p.slice(),w="";switch(c){case "HEX":k=E;break;case "B64":k=F;
break;default:q("format must be HEX or B64")}"SHA-1"===a?(r===g&&(g=Z(m,n)),w=k(g,I(b))):"SHA-224"===a?(r===f&&(f=$(m,n,a)),w=k(f,I(b))):"SHA-256"===a?(r===h&&(h=$(m,n,a)),w=k(h,I(b))):"SHA-384"===a?(r===j&&(j=$(m,n,a)),w=k(j,I(b))):"SHA-512"===a?(r===l&&(l=$(m,n,a)),w=k(l,I(b))):q("Chosen SHA variant is not supported");return w};this.getHMAC=function(a,b,c,f,g){var h,j,l,m,x,C=[],D=[],v=r;switch(f){case "HEX":h=E;break;case "B64":h=F;break;default:q("outputFormat must be HEX or B64")}"SHA-1"===c?
(l=64,x=160):"SHA-224"===c?(l=64,x=224):"SHA-256"===c?(l=64,x=256):"SHA-384"===c?(l=128,x=384):"SHA-512"===c?(l=128,x=512):q("Chosen SHA variant is not supported");"HEX"===b?(v=z(a),m=v.binLen,j=v.value):"ASCII"===b||"TEXT"===b?(v=y(a,k),m=v.binLen,j=v.value):"B64"===b?(v=B(a),m=v.binLen,j=v.value):q("inputFormat must be HEX, TEXT, ASCII, or B64");a=8*l;b=l/4-1;l<m/8?(j="SHA-1"===c?Z(j,m):$(j,m,c),j[b]&=4294967040):l>m/8&&(j[b]&=4294967040);for(l=0;l<=b;l+=1)C[l]=j[l]^909522486,D[l]=j[l]^1549556828;
c="SHA-1"===c?Z(D.concat(Z(C.concat(p),a+n)),a+x):$(D.concat($(C.concat(p),a+n,c)),a+x,c);return h(c,I(g))}};

})();
