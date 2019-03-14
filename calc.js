/*
	JavaScript File Pertaining to Normal Distribution Fitting.
	Origin : https://github.com/deve-sh/Normal-Distributor.git
	Coming to Python Soon enough.
*/

// Function to find the sum of some data.

function sum(arr=[]){
	let sum = 0;
	for(let i in arr){
		if(Number(arr[i]))
			sum+=arr[i];
	}

	return sum;		// Sum can be zero. No doubt.
}

const abs = num => (num<0)?0-num:num;	// Absolute / Modulus Function

// Function to find the mean of Grouped data.

function mean(arr=[],freq=[]){	// Parameter to be passed => An array
	let sumarr = 0;

	if(arr.length != freq.length && freq.length==0){	// If the data is not grouped.
		let n=0;

		for(let i in arr){
			if(Number(arr[i])){
				sumarr+=arr[i];
				n++;
			}
		}

		return (n==0)?0:sumarr/n;	// Avoid the divide by zero error.
	}
	else if(freq.length!=arr.length){
		return "Invalid Datasets.";
	}

	// If the data is in fact grouped and the lengths of both the arrays are equal.
	
	for(let i in arr){
		if(Number(arr[i])){
			sumarr+=freq[i]*arr[i];
		}
	}

	return (sum(freq)==0)?0:(sumarr/sum(freq));
}

// Function to find the standard deviation of some data.

function sd(arr=[],freq=[]){	
	// Parameter to be passed => An Array and the frequencies corresponding to them.

	let sqsum = 0;
	let arrmean = mean(arr);

	if(arrmean){		// If mean is a valid Number.
		if(freq.length==0){		
			// If frequency is not passed, then calculate the standard deviation of the ungrouped data.

			let n=0;

			for(let i in arr){
				sqsum += Math.pow((arr[i]-arrmean),2);
				n++;
			}

			return Math.pow(sqsum/n,0.5);
		}
		else if(arr.length != freq.length){
			return "Invalid Datasets.";
		}

		for(let i in arr){
			if(Number(arr[i]))
				sqsum+=(freq[i]*(Math.pow((arr[i]-arrmean),2)));
		}

		return (sum(freq)==0)?0:Math.pow((sqsum/sum(freq)),0.5);	// Square root of the variance.
	}
	
	return 0;			// If invalid mean. Then no standard deviation exists.
}

// Functions to find the normal probabilities.

function normalcdf(X){   //HASTINGS.  MAX ERROR = .000001 Thanks to : http://www.math.ucla.edu/~tom/distributions/normal.html
	let T=1/(1+.2316419*Math.abs(X));
	let D=0.3989423*Math.exp(-X*X/2);
	let Prob=D*T*(.3193815+T*(-.3565638+T*(1.781478+T*(-1.821256+T*1.330274))));
	if (X>0) {
		Prob=1-Prob;
	}
	Prob=Math.round(100000*Prob)/100000;
	return Prob;
}

function pnorm(point=0,mean=0,sd=1){	
	// Assuming the distribution to be a Standard Normal One if nothing is passed.

	if(point === Infinity)
		return 1;

	if(sd<0)
		sd = 0 - sd;	// SD cannot be negative.

	if(sd!=0){
		if(mean!=0 || sd!=1){
			// If the values are not Standard Normal.
			return normalcdf((point-mean)/sd);
		}
		else{
			return normalcdf(point);
		}
	}
	else{
		return "Cannot divide by 0.";
	}
}