const Koa = require("koa")
const bodyparser = require("koa-bodyparser")
const cors = require("koa2-cors")

const config = require("config")
const router = require("./routes/router")

const app = new Koa()

app.use(bodyparser({
    enableTypes: ["json", "form", "text"]
}))

app.use(cors({
    origin: "http://localhost:3000"
}))

app.use(require("koa-static")(__dirname + "/public"))

app.use(async (ctx, next) => {
    // 响应开始时间
    const start = new Date()
    let ms
    await next()
    ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} ${ctx.status} - ${ms}ms`)
});

app.use(router.routes(), router.allowedMethods())

app.listen(9999)

console.log("服务启动于端口：", config.port)
