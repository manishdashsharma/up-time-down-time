import mongoose from 'mongoose';

const monitorSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: [true, "name is required"],
        maxlength: [50, "name must be less than 50 chars"]
    },
    link: {
        type: String,
        required: [true, "link is required"],
        lowercase: true,
        trim: true,
    },
    is_active: {
        type: Boolean,
        default: true
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true } );

export default mongoose.model("Monitor", monitorSchema)