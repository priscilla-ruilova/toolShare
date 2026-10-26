const mongoose = require('mongoose')

const toolSchema = mongoose.Schema(
    {
        name: {
            type: String,
        },
        lender: {
            type: String,
            required: false,
        },
        borrower: {
            type: String,
        },
        description: {
            type: String,
            required: false,
        },
        returnDate: {
            type: Date,
        },
        status: {
            type: String,
            required: true,
            emun: ['available', 'in use']
        }
    }
);

//getters
toolSchema.virtual('displayDate').get(function () { //needs to be displayDate to work (idk why) this is a getter function
    if (!this.returnDate) return 'Not set';
    return this.returnDate.toLocaleDateString('en-US', { timeZone: 'UTC' });
});

const Tool = mongoose.model("Tool", toolSchema); //this registers the schema as a model named "Tool"

// create the model for users and expose it to our app
module.exports = Tool;