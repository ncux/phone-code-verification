const QcloudSms = require("qcloudsms_js")
const config = require("config")
const util = require("util")
const fs = require("fs")
const crypto = require("crypto")
const path = require("path")
const join = require('path').join
const mongoose = require("mongoose")
const redis = require("redis")
const request = require("request")
const phoneModel = require("../models/phone")

// 实例一个redis
const redisInstance1 = redis.createClient(config.get("redis"))
redisInstance1.on("error", (error) => {
    console.error("connect redis error: ", error)
})
const getAsync = util.promisify(redisInstance1.get).bind(redisInstance1)

// const mongodbInstance1 = mongoose.connect(config.get("mongodb"), {useNewUrlParser: true}).catch(error => {
//     console.log("connect mongodb error: ", error)
// })

// 遍历处理目录，得到文件
function findSync(startPath) {
    let result = [];

    function finder(path) {
        let files = fs.readdirSync(path);
        files.forEach((val, index) => {
            let fPath = join(path, val);
            let stats = fs.statSync(fPath);
            if (stats.isDirectory()) finder(fPath)
            if (stats.isFile()) result.push(fPath)
        })

    }
    finder(startPath);
    return result;
}

// 生成md5密文
function createHash(str) {
    let md5 = crypto.createHash("md5")
    md5.update(`${str.substr(-4)}`)
    return md5.digest('hex')
}

// 发送验证码
const sendVerifiedCode = async (ctx, next) => {
    const {telephone} = ctx.request.body
    // 检验手机号的格式
    if (!(/^1[34578]\d{9}$/.test(telephone))) {
        ctx.status = 400
        ctx.body = {
            code: 40010,
            msg: "请输入正确的手机号"
        }
        return
    }

    // 得到腾讯云的配置信息
    const qcloudConfig = config.get("sms")
    const appid = qcloudConfig.appId,
        appkey = qcloudConfig.appKey,
        templateId = qcloudConfig.templateId,
        smsSign = qcloudConfig.smsSign
    // 实例化腾讯云短信服务
    let qcloudsms = QcloudSms(appid, appkey)

    // 生成随机验证码
    let qrcode = Math.random().toString(10).substr(2, 6)

    // 存到redis设置有效时间360s
    await redisInstance1.set(`tel_${telephone}`, qrcode, 'Ex', 360)
    // console.log(qrcode)
    // 设置参数
    let smssender = qcloudsms.SmsSingleSender()
    let params = [`${qrcode}`, 6]

    let sendResult = await new Promise((resolve, reject) => {
        smssender.sendWithParam(86, telephone, templateId, params, smsSign, "", "", (err, res, resData) => {
            if (err) {
                reject(err)
            } else {
                resolve(resData)
            }
        })
    })

    if (sendResult.result !== 0) {
        ctx.status = 500,
        ctx.body = {
            code: 50001,
            "msg": "验证码服务错误"
        }
        return
    }
    ctx.body = {
        code: 0,
        "msg": "验证码发送成功"
    }
}

// 验证验证码 发送下载地址
const checkVerifiedCode = async (ctx, next) => {
    const {telephone, code} = ctx.request.body
    // 检验手机号的格式
    if (!(/^1[34578]\d{9}$/.test(telephone))) {
        ctx.status = 400
        ctx.body = {
            code: 40010,
            msg: "请输入正确的手机号"
        }
        return
    }

    // 检查验证码
    let qrcode = await getAsync(`tel_${telephone}`)
    if (code !== qrcode) {
        ctx.status = 400
        ctx.body = {
            code: 40013,
            msg: "验证码错误"
        }
        return
    }
    // 保存到数据库
    // let data = new phoneModel({
    //     phone: telephone,
    //     file: fileName
    // })

    // await data.save()

    // 生成标识字符串
    const encryptString = createHash(`${telephone.substr(-4)}`)
    // 设置url链接有效时间
    redisInstance1.set(`${encryptString}`, telephone, 'Ex', 360)

    ctx.body = {
        code: 0,
        msg: "验证成功，你已获得下载资格",
        hash: encryptString
    }
}

// 跳转另一个服务器，得到文件
const downloadFile = async (ctx, next) => {
    console.log("测试")
    const name = ctx.params.name

    console.log("执行与否")
    ctx.set("X-Accel-Redirect", `/protected/${name}`)
    ctx.res.end()
}

// 得到目录列表
const getFilesList = async (ctx, next) => {
    const dirPath = join(__dirname, "../public")
    try {
        const fileArr = findSync(dirPath)
        // 处理 得到文件名
        let midd = [], result = []
        for(let item of fileArr) {
            midd.push(item.split(`${path.sep}`).pop())
        }
        for(let i in midd) {
            result.push({key: ""+i, name: midd[i]})
        }
        ctx.body = {
            code: 0,
            msg: "获取成功",
            data: result
        }
    } catch (error) {
        console.log("error: ", error)
    } 
}

module.exports = {
    sendVerifiedCode,
    checkVerifiedCode,
    downloadFile,
    getFilesList
}