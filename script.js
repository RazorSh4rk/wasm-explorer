let file, binFile

let template = (obj) => {
	Object.keys(obj).forEach(el => {
		let li = document.createElement('li')
		    text = document.createTextNode(el)
		li.appendChild(text)
		document.getElementById('ls').appendChild(li)
	})
}

function loadModule(filename) {
return fetch(filename)
	.then(response => response.arrayBuffer())
	.then(buffer => WebAssembly.compile(buffer))
	.then(module => {
		const imports = {
			env: {
				memoryBase: 0,
				tableBase: 0,
				memory: new WebAssembly.Memory({
					initial: 256
				}),
				table: new WebAssembly.Table({
					initial: 0,
					element: 'anyfunc'
				})
			}
		}                         
		return new WebAssembly.Instance(module, imports);
	})
}

function dispTable() {
	loadModule(file.name).then(instance => {
		template(instance.exports)
	})  	
}

let selectFile = (files) => {
	file = files[0]
	if(files.length > 1) document.getElementById('error-multiple-files').style.display = 'block'
	if(file.type != 'application/wasm') document.getElementById('error-wrong-type').style.display = 'block'
}

let runWasm = () => {
	let cmd = document.getElementById('cmd').value
	loadModule(file.name).then(instance => {
		document.getElementById('res').innerHTML = '>> ' + (eval('instance.exports.' + cmd))
	}) 
}