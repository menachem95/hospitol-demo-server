import mongoose from "mongoose";

const {Schema} = mongoose;


const printersSchema = new Schema({
    address: {
        type: String,
        // required: true
    },
    room: {
        type: String,
        // required: true
    },
    department: {
        type: String,
        // required: true
    },
    description: {
        type: String,
        // required: true
    },
    printerModel: {
        type: String,
        // required: true
    },
    line: {
        type: String,
        // required: true
    },
    pag: {
        type: String,
        // required: true
    },
});


export const Printer = mongoose.model("Printer", printersSchema)