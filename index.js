/*
	Main File Pertaining to all the Front End Presentation Stuff.
*/

function setup(e){	// Function to setup the input fields.
	
	e.preventDefault();	// Prevent a page refresh or redirect.

	let number = document.getElementById('numberofobs').value;

	if(number && number>0){

			document.getElementById('outputs').innerHTML="";	// Clearing previous outputs.

			// If data is grouped.

			let htmlstring = `<br/><form onsubmit='formfit(event,${number})' class='row' align='center'>
			<div class='classes col-md-6' align='center'>
			<h3 class='classesheader'>Classes</h3><br/>`;

			for(let i=0;i<number;i++){
				htmlstring += `<input type='text' class='form-control input cla-${i}' placeholder='Class ${i+1}'><br/><br/>`;	// Observation Inputs
			}

			htmlstring += `<div onclick='autocomplete(${number})' class='btn btn-info'>Auto Complete</div><br><br></div>`;

			htmlstring += `<div class='frequencies col-md-6'>
			<h3 class='freqheader'>Frequencies</h3><br/>`;

			for(let i=0;i<number;i++){
				htmlstring += `<input type='number' min='0' class='form-control input freq-${i+1}' placeholder='Frequency ${i+1}'><br/><br/>`;
			}

			htmlstring += `</div><br>
			<div class='col-md-6 fitdist' style='padding: 0.5rem'>
				<button type='submit' onclick='formfit(event,${number})' class='btn btn-primary'>Fit Distribution</button>
			</div>
			<div class='col-md-6 restart' style='padding: 0.5rem'>
				<button onclick='clearterms()' class='btn btn-danger'>Restart</button>
			</div>
			</form>`;

			document.getElementById('inputs').innerHTML = htmlstring;
	}
	else{
		document.getElementById('inputs').style.display = "block";
		document.getElementById('inputs').innerHTML = "<div align='center' class='alert alert-danger'>Kindly Enter Valid Inputs.</div>";
	}
}

function autocomplete(nclasses=5){	// Function to autocomplete the class fields.
	if(document.getElementById('inputs').innerHTML !== "" && (document.getElementById('inputs').style.display !== "" || document.getElementById('inputs').style.display!=='none')){
		// If the user actually initialized the fitting process.

		if(document.getElementsByClassName('cla-0')[0].value !== ''){

			// If the user infact entered the first class.

			let firstclass = document.getElementsByClassName('cla-0')[0].value.split('-');
			

			// Error Checking

			let start = Number(firstclass[0]), end = Number(firstclass[1]);

			if(isNaN(start) || isNaN(end)){		// If the user didn't enter something like a string.
				document.getElementById('outputs').style.display = "block";
				document.getElementById('outputs').innerHTML = "<div align='center' class='alert alert-danger'>Could not compute difference.</div>";
				throw new Error("Could not compute difference!");
			}

			let diff = end - start;

			for(let count = 1;count<nclasses; count++){		// Loop to insert the values inside.
				start = end;
				end = start + diff;

				document.getElementsByClassName(`cla-${count}`)[0].value = `${start} - ${end}`;
			}

			document.getElementById('outputs').innerHTML = "";
		}
		else{
			document.getElementById('inputs').style.display = "block";
			document.getElementById('inputs').innerHTML = "<div align='center' class='alert alert-danger'>Kindly Enter Values of Classes.</div>";
		}
	}
	else{
		document.getElementById('inputs').style.display = "block";
		document.getElementById('inputs').innerHTML = "<div align='center' class='alert alert-danger'>Kindly Enter Number of Classes.</div>";
	}
}

function formfit(e,number = 5){	// Function to fit the Normal Distributions.
	e.preventDefault();

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
			document.getElementById('outputs').innerHTML = `<br><div class='alert alert-danger'>Invalid Frequency at Frequency No : ${i-number+1}</div>`;
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

	let midarr = [];

	for(let i in ob){
		midarr.push((ob[i][0]+ob[i][1])/2);
	}

	let arrmean = mean(midarr,freq);
	let arrsd = sd(midarr,freq);

	// List of Upper Limits

	let upper = [];

	for(let i in ob){
	    upper.push(ob[i][1])
	}

	upper.unshift(ob[`Class 0`][0]);	// Necessary steps.
	upper.push(Infinity);

	// List of standard Points.

	let standard = [];

	for(let i in upper){
	    standard.push((upper[i]-arrmean)/arrsd)
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

	newhtmlstring += `<br><table class='outputtable' cellpadding="1rem" cellspacing=0 style='min-width: 100%;'>
		<tr>
			<th>Class</th>
			<th>Upper Limit</th>
			<th>Standard Variate</th>
			<th>Area</th>
			<th>Probability</th>
			<th>Expectance</th>
		</tr>
	`;

	for(let i=0;i<probs.length;i++){
		newhtmlstring += `<tr>
			<td>${(i==0)?"Infinity":upper[i-1]} - ${upper[i]}</td>
			<td>${upper[i]}</td>
			<td>${standard[i]}</td>
			<td>${Math.round((areas[i]*100000))/100000}</td>
			<td>${Math.round((probs[i]*100000))/100000}</td>
			<td>${Math.round((expecs[i]*100000))/100000}</td>
		</tr>`;
	}

	newhtmlstring += `<tr>
			<th>Total</th>
			<td></td>
			<td></td>
			<td>${Math.round(sum(areas)*100000)/100000}</td>
			<td>${Math.round(sum(probs)*100000)/100000}</td>
			<td>${Math.round(sum(expecs)*100000)/100000}</td>
	</tr>`;


	newhtmlstring += "</table>";

	// Validation.

	console.log(`Sum of Probabilities : ${sum(probs)}\nEqual to One : ${1==sum(probs)}`);
	console.log(`Sum of Expected Frequencies : ${sum(expecs)}\nEqual to Original : ${sum(expecs)==freqsum}`);

	newhtmlstring += `</div>`;

	document.getElementById('outputs').innerHTML = newhtmlstring;
}

function clearterms(){		// Function to empty a DOM element.
	document.getElementById("outputs").innerHTML = "";
	document.getElementById("inputs").innerHTML  = "";
	document.getElementById("numberofobs").value = "";
}