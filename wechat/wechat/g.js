
var sha1 = require("sha1");

function Wechat(opts){
    var that = this;
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;


    this.getAccessToken() //获取票据
        .then(function (data) {
            try{
                data = JSON.parse(data)    //如果没有
            }
            catch (e) {
                return that.updataAccessToken()   //更新
            }
            if (that.isValidAccessToken(data)){  //如果票据没过期过期
               Promise.resolve(data)             //返回票据
            }else{
                return that.updataAccessToken()
            }
        }).then(function (data) {
              that.access_token = data.access_token;
              that.expires_in = data.expires_in;       //过期字段

              that.saveAccessToken(data)              //将票据存起来
        })
}

Wechat.prototype.isValidAccessToken = function(data){
    if (!data||!data.access_token||!expires_in) {
        return false;
    }

    var access_token = data.access_token;
    var expires_in = data.expires_in;
    var now = (new Date().getTime())

    if(now<expires_in){  //当前时间小于过期时间
        return true;
    }else{
        return false
    }
}

Wechat.prototype.updateAccessToken = function(data){
  var appID = this.appID;
  var appSecret = this.appSecret;
  var url = "请求token的域名";

  return new Promise(function (resolve,reject) {
      request({url:url, json:true}).then(function (response) {
          var data = response[1];
          var now = (new Date().getTime());
          var expires_in = now + (data.expires_in - 20) * 1000  //提前20秒
          data.expires_in = expires_in;

          resolve(data)
      })
  })


}

module.exports = function(opt){

    var wechat = new Wechat(opt)
    return function *(next) {
        console.log(this);

        var token = opt.token;
        var signature = this.query.signature;
        var nonce = this.query.nonce;
        var timestap = this.query.timestamp;
        var echostr = this.query.echostr;
        var str = [token,timestap,nonce].sort().join("");

        var sha = sha1(str);

        if (sha===signature){
            this.body = echostr+""
        }else{
            this.body = "不是微信发来的请求"
        }
    }
}
