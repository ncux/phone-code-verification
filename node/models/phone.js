const mongoose = require("mongoose")

const phoneSchema = mongoose.Schema({
    phone: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now()
    }
})

const Phone = mongoose.model("Phone", phoneSchema)

module.exports = Phone