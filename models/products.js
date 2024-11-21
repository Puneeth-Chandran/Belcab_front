import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true, 'Please enter product name'],
        maxLength:[200, 'Product name cannot exceed 200 characters'],
    },
    description:{
        type:String,
        required:[true,"Please enter product description"],
    },
    images:[
        {
            public_id: String,
            url: String,
        }
    ],
    category:{
        type: String,
        required:[true,"Please enter product category"],
        enum: {
            values:['Cables',
                "Fibers",
                "Accessories",
                "Connectors",
                "Adapters",
                "Extensions",
            ],
            message:'Please select correct category',
        },
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
},
{timestamps:true}
);

export default mongoose.model('Product',productSchema);