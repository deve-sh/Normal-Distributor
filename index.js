/*
	Main File Pertaining to all the Front End Displaying Stuff.
*/

function setup(e){	// Function to setup the input fields.
	
	e.preventDefault();	// Prevent a page refresh or redirect.

	let number = document.getElementById('numberofobs').value;

	if(number && number>0){

			// If data is grouped.

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
			<div class='col-md-6 fitdist'>
				<button type='button' onclick='formfit(${number})' class='btn btn-primary'>Fit Distribution</button>
			</div>
			<div class='col-md-6 restart'>
				<button type='button' onclick='clear();' class='btn btn-danger'>Restart</button>
			</div>
			</div>`;

			document.getElementById('inputs').innerHTML = htmlstring;
	}
	else{
		document.getElementById('inputs').style.display = "block";
		document.getElementById('inputs').innerHTML = "<div align='center'>Kindly Enter Valid Inputs.</div>";
	}
}

function formfit(number = 5){	// Function to fit the Normal Distributions.
	console.log("Fitting The Distribution.");

	let newhtmlstring = `<div style='overflow-x:auto;'>`;
	let arr = [];
	let freq = [];

	number = abs(number);
		
	// Classes

	for(let i=0;i<number;i++){
		if(document.getElementsByClassName('input')[i].value && document.getElementsByClassName('input')[i].value.includes("-"))
			arr.push(document.getElementsByClassName('input')[i].value);
		else{
			document.getElementById('outputs').innerHTML = `<br><div class='alert alert-danger'>Invalid Class Length at Class No : ${i+1}</div>`;
			throw new Error("Invalid Class Length at Class No : "+i+1);
		}
	}

	for(let i=number;i<2*number;i++){
		if(document.getElementsByClassName('input')[i] && Number(document.getElementsByClassName('input')[i].value)){
			freq.push(Number(document.getElementsByClassName('input')[i].value));
		}
		else{
			document.getElementById('outputs').innerHTML = `<br><div align='alert alert-danger'>Invalid Frequency at Frequency No : ${i-number+1}</div>`;
			throw new Error("Invalid Frequency at Frequency No : " + (i-number+1) + ".");
		}
	}

	/* Now is the real deal */

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

	// Presentation

	// Validation.

	console.log(`Sum of Probabilities : ${sum(probs)}\nEqual to One : ${1==sum(probs)}`);
	console.log(`Sum of Expected Frequencies : ${sum(expecs)}\nEqual to Original : ${sum(expecs)==freqsum}`);

	newhtmlstring += `</div>`;
}

function clear(){		// Function to empty a DOM element.
	document.getElementById("outputs").innerHTML="";
	document.getElementById("inputs").innerHTML="";
	document.getElementById("numberofobs").value="";
}