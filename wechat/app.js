var Koa = require("koa");
var sha1 = require("sha1");

var wechat = require("./wechat/g");
var wechat_file = "./wechat.txt";
var config = {
    wechat:{
        appID:"wx49d660f1e908b852",
        appSecret:"89dad78c6d3bb560fb7da0dfeb411b1c",
        token:"new123",
        getAccessToken:function () {
            return util.readFileAsync(wechat_file)
        },
        saveAccessToken:function (data) {
            return util.writeFileAsync(wechat_file,data)
        }
    }
    //EncodingAESKey:0kuBLIBOli39eNni8vkEqHmXiPddgnkdOCIsrCDpwXE
}

var app = new Koa();

app.use(wechat(config.wechat));

app.listen(1234);
console.log('端口：1234')