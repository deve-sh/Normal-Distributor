/*
	Main File Pertaining to all the Front End Displaying Stuff.
*/

function setup(e){	// Function to setup the input fields.
	
	e.preventDefault();	// Prevent a page refresh or redirect.

	let number = document.getElementById('numberofobs').value;
	let grouped = document.getElementById('grouped').checked;

	if(number && number>0){
		if(grouped==true){
			let htmlstring = `<br/><div class='row' align='center'>
			<div class='classes col-md-6' align='center'>
			<h3 class='classesheader'>Classes</h3><br/>`;

			for(let i=0;i<number;i++){
				htmlstring += `<input type='text' class='form-control input cla-${i}' placeholder='Class ${i+1}'><br/><br/>`;	// Observation Inputs
			}

			htmlstring += `</div>`;

			htmlstring += `<div class='frequencies col-md-6'>
			<h3 class='freqheader'>Frequencies</h3><br/>`;

			for(let i=0;i<number;i++){
				htmlstring += `<input type='number' min='0' class='form-control input freq-${i+1}' placeholder='Frequency ${i+1}'><br/><br/>`;
			}

			htmlstring += `</div><br>
			<div align='center' class='col-md-12'>
				<button type='button' onclick='formfit()' class='btn btn-primary'>Fit Distribution</button>
			</div>
			</div>`;

			document.getElementById('inputs').innerHTML = htmlstring;
		}else{
			let htmlstring = `<br/><div class='row' align='center'>
			<div class='classes col-md-6' align='center'>
			<h3 class='classesheader'>Observations</h3><br/>`;

			for(let i=0;i<number;i++){
				htmlstring += `<input type='text' class='form-control input obs-${i}' placeholder='Observation ${i+1}'><br/><br/>`;	// Observation Inputs
			}

			htmlstring += `</div>`;

			htmlstring += `<div class='frequencies col-md-6'>
			<h3 class='freqheader'>Frequencies</h3><br/>`;

			for(let i=0;i<number;i++){
				htmlstring += `<input type='number' min='0' class='form-control input freq-${i+1}' placeholder='Frequency ${i+1}'><br/><br/>`;
			}

			htmlstring += `</div><br>
			<div align='center' class='col-md-12'>
				<button type='button' onclick='formfit()' class='btn btn-primary'>Fit Distribution</button>
			</div>
			</div>`;

			document.getElementById('inputs').innerHTML = htmlstring;
		}
	}
	else{
		document.getElementById('inputs').style.display = "block";
		document.getElementById('inputs').innerHTML = "<div align='center'>Kindly Enter Valid Inputs.</div>";
	}
}

function formfit(){

}

function clear(element=""){		// Function to empty a DOM element.
	if(document.getElementById(element)){
		document.getElementById(element).innerHTML="";
	}
}

/* Boilerplate 

	// Objects of Classes.

	let ob = {};

	for(let i in arr){
	    let n1 = arr[i].split("-")[0]
	    let n2 = arr[i].split("-")[1]
	    ob[`Class ${i}`]=[Number(n1),Number(n2)]
	}

	let arrmean = mean(arr,freq);
	let arrsd = sd(arr,freq);

	// List of Upper Limits

	let upper = [];

	for(let i in ob){
	    upper.push(ob[i][1])
	}

	upper.unshift(ob[0][0]);	// Necessary steps.
	upper.push(Infinity);

	// List of standard Points.

	let standard = [];

	for(let i in upper){
	    standard.push((upper[i]-mean)/sd)
	}

	// List of Areas for each standard point.

	let areas = [];

	for(let i in standard){
	    areas.push(pnorm(standard[i]))
	}

	// List of Actual Probabilities

	let probs = [];

	for(let i=0;i<areas.length;i++){
	    if(i==0)
	        probs.push(areas[i])
	    else{
	        probs.push(areas[i]-areas[i-1])
	    }
	}

	// List of Expected Probabilities

	let expecs = [];
	let freqsum = sum(freq);

	for(let i in probs){
		expecs.push(probs[i]*freqsum);
	}

	// Validation.

	console.log(`Sum of Probabilities : ${sum(probs)}\nEqual to One : ${1==sum(probs)}`);
	console.log(`Sum of Expected Frequencies : ${sum(expecs)}\nEqual to Original : ${sum(expecs)==freqsum}`);
*/