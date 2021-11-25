const mongoose = require('mongoose');

const subSchema = new mongoose.Schema({
	_id: 				{ type: String 		},
	Company: 			{ type: String		},
	Tool: 				{ type: String		},
	ToolModel: 			{ type: String		},
	ToolCategory: 		{ type: String		},
	SubscriptionModel: 	{ type: String		},
	SubscriptionType: 	{ type: String		},
	contract_reference: { type: String		},
	duration: 			{ type: Number		},
	started_on: 		{ type: Date  		},
	active: 			{ type: Boolean  	},
	payment_method: 	{ type: String  	},
	denounced: 			{ type: Boolean  	},
	canceled: 			{ type: Boolean  	},
	renewable: 			{ type: Boolean  	},
	current_status: 	{ type: String		},
	ended_on: 			{ type: Date   		},
})

module.exports = mongoose.model('Subscription', subSchema)