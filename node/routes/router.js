const router = require("koa-router")()
const service = require("../controllers/service")

router.prefix("/api")
router.post("/verifiedcode/send", service.sendVerifiedCode)

router.post("/verifiedcode/check", service.checkVerifiedCode)

router.post("/download/:name", service.downloadFile)

// router.post("/download", service.downloadFile)

router.get("/files/list", service.getFilesList)

router.get("/", async(ctx, next) => {
	console.log("url: ", ctx.url)
	ctx.body = {
		code: 0,
		msg: "测试成功"
	}
})

module.exports = router