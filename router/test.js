const keras = require('keras-js');

const model = new keras.Model({

		filepath:'model.bin',
		filesystem:true
	});
module.exprorts = model;
	// model.ready().then(()=>model.predict({input:new Float32Array([2,4,7,5,6,3,2,3,1,3,3,3,3,2,2,3,3,3,4,1,2,3,4,5,6,7,8])})
	
	// ).then(output=>{
	
	// 	console.log(output)
	// });



