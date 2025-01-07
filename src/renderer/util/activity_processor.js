import { act } from "react";

export class ActivityProcessor {
    constructor(sampleData, intensityData, csvData = {}) {
        this.sampleData = sampleData;
        this.intensityData = intensityData;
        this.background = csvData.background;
        this.bgCountRate = csvData.countRate;
        this.emissionRate = csvData.emissionRate;
        this.efficiencySecondary = csvData.efficiencySecondary;
        this.efficiency = csvData.efficiency;
        this.activityConsts = {
            "238U": [12.347, 0.008],
            "226Ra": [12.347, 0.008],
            "210Pb": [12.347, 0.008],
            "232Th": [4.07, 0.003],
            "40K": [315.7449, 0.93096]
        }
        
<<<<<<< HEAD
        this.uraniumSeries_I58= ["234Th_63.29",  "234Th_67.672", "234Th_92.59", "235U_143.76", "235U_185.715", "234mPa_1001.03"];
        this.uraniumSeries_I59 = ["214Pb_295.2228", "214Pb_351.9321","214Bi_609.320", "214Bi_1120.294"]; // J52 -- 226Ra
        this.uraniumSeries_I60 = ["210Pb_46.539"];
        this.radonSeries_I62 = ["228Ac_338.320", "228Ac_911.204", "228Ac_968.971", "212Pb_238.632", "208Tl_583.187", "208Tl_860.557"]; //J55 -- 232Th
        this.radonSeries_I63 = ["228Ac_129.07", "228Ac_338.320", "228Ac_911.204", "228Ac_968.971"];
        this.radonSeries_I64 = ["212Pb_238.632", "212Pb_300.087", "212Bi_727.330", "208Tl_583.187", "208Tl_860.557"];
=======
        this.uraniumSeries_I58= ["234Th_63.29",  "230Th_67.672", "234Th_92.59", "235U_143.76", "235U/226Ra_185.715", "234mPa_1001.03"]; //238U
        this.uraniumSeries_I59 = ["214Pb_295.2228", "214Pb_351.9321","214Bi_609.32", "214Bi_1120.294"]; // J52 -- 226Ra
        this.uraniumSeries_I60 = ["210Pb_46.539"];
        this.radonSeries_I62 = ["228Ac_338.32", "228Ac_911.204", "228Ac_968.971", "212Pb_238.632", "Tl-208_583.187", "Tl-208_860.557"]; //J55 -- 232Th
        this.radonSeries_I63 = ["228Ac_129.07", "228Ac_338.32", "228Ac_911.204", "228Ac_968.971"];
        this.radonSeries_I64 = ["212Pb_238.632", "212Pb_300.087", "212Bi_727.330", "Tl-208_583.187", "Tl-208_860.557"];
>>>>>>> 7b7881f (Changes suggested by mail on 12/27/24)
        this.potassiumSeries = ["40K_1460.822"];

        this.uraniumSeries_I58_table = [];
        this.uraniumSeries_I59_table = [];
        this.uraniumSeries_I60_table = [];
        this.radonSeries_I62_table = [];
        this.radonSeries_I63_table = [];
        this.radonSeries_I64_table = [];
        this.potassiumSeries_table = [];

        this.activity = {};

        this.beforeCamValues = {};
        this.col_AAAB = {};
        this.col_AIAJ = {};
        this.col_AQAR = {};    
        this.col_AGAH = {};
        this.col_AOAP = {};
        this.activityRatio = [0.0460293978266872, 0.000334001999686404];
    }

    populateCols(){
        this.intensityData.map(peak => {
            const peakName = peak["name"];
            this.col_AAAB[peakName] = [0, 0];
            this.col_AIAJ[peakName] = [0, 0];
            this.col_AQAR[peakName] = [0, 0];
            this.col_AGAH[peakName] = [0, 0];
            this.col_AOAP[peakName] = [1, 0];
        });
        this.col_AGAH["234Th_92.59"] = [0.000777, 0.00002];
        this.col_AGAH["235U_143.76"] = [0.0327, 0.0008];
<<<<<<< HEAD
        this.col_AGAH["235U_185.715"] = [0.000088, 0.000007];
=======
        this.col_AGAH["235U/226Ra_185.715"] = [0.000088, 0.000007];
>>>>>>> 7b7881f (Changes suggested by mail on 12/27/24)
        this.col_AOAP["234Th_92.59"] = [0.14607, 0.00207451199080651];
    }

    analyze(){
        this.populateCols();
        // return this.calculateAbundance();
        for(let i=0;i<20;i++){
            this.calculateAbundance();
            this.calculateCols();
        }
        
        return this.calculateAbundance();
    }

    getColId(peak){
        if(peak === "40K_1460.822" || peak === "234Th_63.29" || peak === "234Th_92.59" || peak === "241Pb_241.995" || peak == "212Bi_727.330"){
            return this.activity["232Th"];
<<<<<<< HEAD
        }else if(peak === "235U_185.715" || peak === "214Pb_351.9321" || peak === "228Ac_338.320" || peak === "212Pb_300.087"){
=======
        }else if(peak === "235U/226Ra_185.715" || peak === "214Pb_351.9321" || peak === "228Ac_338.32" || peak === "212Pb_300.087"){
>>>>>>> 7b7881f (Changes suggested by mail on 12/27/24)
            return this.activity["226Ra"];
        }
        return [1, 0];
    }

    calculateCols(){
        // P - efficiencySecondary Y - emissionRate
        for(const [key, value] of Object.entries(this.col_AAAB)){
            const acic = this.getColId(key);
            let val1 = 100 * acic[0] * this.efficiencySecondary[key][0] * this.emissionRate[key][0]; 
<<<<<<< HEAD
            if(key === "235U_185.715" || key === "214Pb_351.9321" || key === "228Ac_338.320" || key === "212Pb_300.087"){
                val1 = 100 * acic[0] * this.activityRatio[0] * this.efficiencySecondary[key][0] * this.emissionRate[key][0];
            }
=======
            if(key === "214Pb_351.9321" || key === "228Ac_338.32" || key === "212Pb_300.087"){
                val1 = 100 * acic[0] * this.activityRatio[0] * this.efficiencySecondary[key][0] * this.emissionRate[key][0];
            }
            if(key === "235U/226Ra_185.715" ){
                val1 = 100 * acic[0] * this.efficiencySecondary[key][0] * this.emissionRate[key][0];
            }
>>>>>>> 7b7881f (Changes suggested by mail on 12/27/24)
            if((this.emissionRate[key][0] !== 0) && (this.efficiency[key][0] !== 0)){
                let val2 = val1 * Math.pow( Math.pow((this.emissionRate[key][1]/this.emissionRate[key][0]), 2) 
                            + Math.pow((acic[1]/acic[0]), 2) 
                            + Math.pow((this.efficiency[key][1]/this.efficiency[key][0]) ,2), 0.5);
<<<<<<< HEAD
                if(key === "235U_185.715" || key === "214Pb_351.9321" || key === "228Ac_338.320" || key === "212Pb_300.087"){
=======
                if(key === "235U/226Ra_185.715" || key === "214Pb_351.9321" || key === "228Ac_338.32" || key === "212Pb_300.087"){
>>>>>>> 7b7881f (Changes suggested by mail on 12/27/24)
                    val2 = val1 * Math.pow( Math.pow((this.emissionRate[key][1]/this.emissionRate[key][0]), 2) 
                                        + Math.pow((acic[1]/acic[0]), 2) 
                                        + Math.pow((this.efficiency[key][1]/this.efficiency[key][0]) ,2)
                                        + Math.pow((this.activityRatio[1]/this.activityRatio[0]) ,2), 0.5);
                }
                this.col_AAAB[key] = [val1, val2];
            }
        }

        for(const [key, value] of Object.entries(this.col_AIAJ)){
            // J52
            const val1 = 100 * this.activity["226Ra"][0] * this.efficiencySecondary[key][0] * this.col_AGAH[key][0];
            if((this.col_AGAH[key][0] !== 0) && (this.activity["226Ra"][0] !== 0) && (this.efficiency[key][0] !== 0)){
                const val2 = val1 * Math.pow(Math.pow((this.col_AGAH[key][1]/this.col_AGAH[key][0]), 2) 
                                    + Math.pow((this.activity["226Ra"][1]/this.activity["226Ra"][0]), 2) 
                                    + Math.pow((this.efficiency[key][1]/this.efficiency[key][0]) ,2), 0.5);
                this.col_AIAJ[key] = [val1, val2];
            }
        }

        for (const [key, value] of Object.entries(this.col_AQAR)){
            const val1 = 100 * this.activity["226Ra"][0] * this.activityRatio[0] * this.efficiencySecondary[key][0] * this.col_AOAP[key][0];
            if((this.col_AOAP[key][0] !== 0) && (this.activity["226Ra"][0] !== 0) && (this.efficiency[key][0] !== 0)){
                const val2 = val1 * Math.pow(Math.pow((this.col_AOAP[key][1]/this.col_AOAP[key][0]), 2) 
                                    + Math.pow((this.activity["226Ra"][1]/this.activity["226Ra"][0]), 2) 
                                    + Math.pow((this.efficiency[key][1]/this.efficiency[key][0]) ,2)
                                    + Math.pow((this.activityRatio[1]/this.activityRatio[0]), 2) 
                                    , 0.5);
                this.col_AQAR[key] = [val1, val2];
            }
           
        }

    }

    calculateCountRate(){
        const weight = this.sampleData["weight"]
        const liveTime = this.sampleData["liveTime"]
        const deadTime = this.sampleData["realTime"]

        var countRates = {};
        this.intensityData.map(peak => {
            let countRatePeak = {};
            countRatePeak["name"] = peak["name"]; 
            let bgInt = this.background[peak["name"]][0];
            let bgSig = this.background[peak["name"]][1];
            if(this.background[peak["name"]]){
                bgInt = this.background[peak["name"]][0];
                bgSig = this.background[peak["name"]][1];
            }

            let div = peak["intensity"] / liveTime;
            if(this.background[peak["name"]]){
                div = div - bgInt;
            }
            
            if(div > 0){
                countRatePeak["intensity"] = 100000* (div / weight);
                const componentA = (peak["sigma"]/liveTime)**2 + bgSig**2;
                const componentB = ((peak["intensity"]/liveTime) - bgInt)**2;
                const componentC = (0.0001/weight)**2;
                countRatePeak["sigma"] = Math.abs(countRatePeak["intensity"]) * Math.pow(componentA/componentB + componentC, 0.5);
            }
            countRates[peak["name"]] = countRatePeak;
        });
        return countRates;

    }

    getSubTerm(peak){
        if(peak === "234Th_63.29"){
            return this.col_AAAB[peak][0];
        }else if(peak === "234Th_92.59"){
            return this.col_AAAB[peak][0] + this.col_AIAJ[peak][0] + this.col_AQAR[peak][0];
<<<<<<< HEAD
        }else if(peak === "235U_185.715"){
=======
        }else if(peak === "235U/226Ra_185.715"){
>>>>>>> 7b7881f (Changes suggested by mail on 12/27/24)
            return this.col_AAAB[peak][0] + this.col_AIAJ[peak][0];
        }else if(peak === "214Pb_241.995"){
            return this.col_AAAB[peak][0];
        }else if(peak === "214Pb_351.9321"){
            return this.col_AAAB[peak][0];
        }else if(peak === "228Ac_911.204"){
            return this.col_AAAB[peak][0];
        }else if(peak === "212Pb_300.087"){
            return this.col_AAAB[peak][0];
        }else if(peak === "40K_1460.822"){
            return this.col_AAAB[peak][0];
        }else {
            return 0;
        }
    }

    getAddTerm(peak){
        if(peak === "234Th_63.29"){
            return 0;
        }else if(peak === "234Th_92.59"){
            return this.col_AAAB[peak][1] + this.col_AIAJ[peak][1] + this.col_AQAR[peak][1];
<<<<<<< HEAD
        }else if(peak === "235U_185.715"){
=======
        }else if(peak === "235U/226Ra_185.715"){
>>>>>>> 7b7881f (Changes suggested by mail on 12/27/24)
            return this.col_AAAB[peak][1] + this.col_AIAJ[peak][1];
        }else if(peak === "214Pb_241.995"){
            return 0;
        }else if(peak === "214Pb_351.9321"){
            return 0;
        }else if(peak === "228Ac_911.204"){
            return this.col_AAAB[peak][1];
        }else if(peak === "212Pb_300.087"){
            return this.col_AAAB[peak][1];
        }else if(peak === "40K_1460.822"){
            return this.col_AAAB[peak][1];
        }else {
            return 0;
        }
    }

    calculateActivityStepOne(){
        this.uraniumSeries_I58_table = [];
        this.uraniumSeries_I59_table = [];
        this.uraniumSeries_I60_table = [];
        this.radonSeries_I62_table = [];
        this.radonSeries_I63_table = [];
        this.radonSeries_I64_table = [];
        this.potassiumSeries_table = [];
        
        const countRates = this.calculateCountRate();
<<<<<<< HEAD
        
        this.uraniumSeries_I58.map((peak) => {
            const countRatePeak = countRates[peak];
            if(countRatePeak){
=======

        console.log("Count Rates: ", countRates);
        // console.log("Intensity Data: ", this.intensityData);
        console.log("cols: ", this.col_AAAB, this.col_AIAJ);
        
        this.uraniumSeries_I58.map((peak) => {
            const countRatePeak = countRates[peak];
            if( countRatePeak ){
>>>>>>> 7b7881f (Changes suggested by mail on 12/27/24)
                const addTerm = this.getAddTerm(peak);
                const subTerm = this.getSubTerm(peak);
                var vals = [];
                vals.push(+peak.split("_")[1]);
                const val1 = (countRatePeak["intensity"] - subTerm) / this.bgCountRate[peak][0]; // Didnt include (Fx - ABx) in numerator
                vals.push(val1);
                const val2_1 = Math.pow(Math.pow(countRatePeak["sigma"]**2 + addTerm**2, 0.5) / (countRatePeak["intensity"] - subTerm), 2);
                const val2_2 = Math.pow(this.bgCountRate[peak][1]/this.bgCountRate[peak][0], 2);
                const val2 = Math.abs(val1) * Math.pow(val2_1 + val2_2 , 0.5);
                vals.push(val2);
                this.beforeCamValues[peak] = vals;
<<<<<<< HEAD
                this.uraniumSeries_I58_table.push(vals);
=======
                console.log("U238 Peak: ", peak);
                if(countRatePeak.hasOwnProperty("intensity"))this.uraniumSeries_I58_table.push(vals);
>>>>>>> 7b7881f (Changes suggested by mail on 12/27/24)
            }
        });
        // console.log("Table: ", this.uraniumSeries_I58_table);

        this.uraniumSeries_I59.map((peak) => {
            const countRatePeak = countRates[peak];
            if(countRatePeak){
                const addTerm = this.getAddTerm(peak);
                const subTerm = this.getSubTerm(peak);
                const I1 = 0;
                var vals = [];
                vals.push(+peak.split("_")[1]);
                const val1 = ((countRatePeak["intensity"] - subTerm)/ this.bgCountRate[peak][0])*(1 + I1); // Didnt include (Fx - ABx) in numerator
                vals.push(val1);
                
                const val2_1 = Math.pow(Math.pow(countRatePeak["sigma"]**2 + addTerm**2, 0.5) / (countRatePeak["intensity"] - subTerm), 2);
                const val2_2 = Math.pow(this.bgCountRate[peak][1]/this.bgCountRate[peak][0], 2);
                const val2 = Math.abs(val1) * Math.pow(val2_1 + val2_2 , 0.5);
                vals.push(val2);
                this.beforeCamValues[peak] = vals;

<<<<<<< HEAD
                this.uraniumSeries_I59_table.push(vals);
=======
                if(countRatePeak.hasOwnProperty("intensity"))this.uraniumSeries_I59_table.push(vals);
>>>>>>> 7b7881f (Changes suggested by mail on 12/27/24)
            }
        });

        this.uraniumSeries_I60.map((peak) => {
            const countRatePeak = countRates[peak];
            if(countRatePeak){
                const addTerm = this.getAddTerm(peak);
                const subTerm = this.getSubTerm(peak);
                const I1 = 0;
                var vals = [];
                vals.push(+peak.split("_")[1]);
                const val1 = ((countRatePeak["intensity"] - subTerm)/ this.bgCountRate[peak][0])*(1 + I1); // Didnt include (Fx - ABx) in numerator
                vals.push(val1);
                
                const val2_1 = Math.pow(Math.pow(countRatePeak["sigma"]**2 + addTerm**2, 0.5) / (countRatePeak["intensity"] - subTerm), 2);
                const val2_2 = Math.pow(this.bgCountRate[peak][1]/this.bgCountRate[peak][0], 2);
                const val2 = Math.abs(val1) * Math.pow(val2_1 + val2_2 , 0.5);
                vals.push(val2);
                this.beforeCamValues[peak] = vals;

<<<<<<< HEAD
                this.uraniumSeries_I60_table.push(vals);
=======
                if(countRatePeak.hasOwnProperty("intensity"))this.uraniumSeries_I60_table.push(vals);
>>>>>>> 7b7881f (Changes suggested by mail on 12/27/24)
            }
        });

        this.radonSeries_I62.map((peak) => {
            const countRatePeak = countRates[peak];
            if(countRatePeak){
                const addTerm = this.getAddTerm(peak);
                const subTerm = this.getSubTerm(peak);
                const I1 = 0;
                var vals = [];
                vals.push(+peak.split("_")[1]);

                const val1 = ((countRatePeak["intensity"] - subTerm)/ this.bgCountRate[peak][0])*(1 + I1); // Didnt include (Fx - ABx) in numerator
                vals.push(val1);
                
                const val2_1 = Math.pow(Math.pow(countRatePeak["sigma"]**2 + addTerm**2, 0.5) / (countRatePeak["intensity"] - subTerm), 2);
                const val2_2 = Math.pow(this.bgCountRate[peak][1]/this.bgCountRate[peak][0], 2);
                const val2 = Math.abs(val1) *Math.pow(val2_1 + val2_2 , 0.5);
                vals.push(val2);
                this.beforeCamValues[peak] = vals;

<<<<<<< HEAD
                this.radonSeries_I62_table.push(vals);
=======
                if(countRatePeak.hasOwnProperty("intensity"))this.radonSeries_I62_table.push(vals);
>>>>>>> 7b7881f (Changes suggested by mail on 12/27/24)
            }
        });

        this.radonSeries_I63.map((peak) => {
            const countRatePeak = countRates[peak];
            if(countRatePeak){
                const addTerm = this.getAddTerm(peak);
                const subTerm = this.getSubTerm(peak);
                const I1 = 0;
                var vals = [];
                vals.push(+peak.split("_")[1]);

                const val1 = ((countRatePeak["intensity"] - subTerm)/ this.bgCountRate[peak][0])*(1 + I1); // Didnt include (Fx - ABx) in numerator
                vals.push(val1);
                
                const val2_1 = Math.pow(Math.pow(countRatePeak["sigma"]**2 + addTerm**2, 0.5) / (countRatePeak["intensity"] - subTerm), 2);
                const val2_2 = Math.pow(this.bgCountRate[peak][1]/this.bgCountRate[peak][0], 2);
                const val2 = Math.abs(val1) *Math.pow(val2_1 + val2_2 , 0.5);
                vals.push(val2);
                this.beforeCamValues[peak] = vals;

<<<<<<< HEAD
                this.radonSeries_I63_table.push(vals);
=======
                if(countRatePeak.hasOwnProperty("intensity"))this.radonSeries_I63_table.push(vals);
>>>>>>> 7b7881f (Changes suggested by mail on 12/27/24)
            }
        });

        this.radonSeries_I64.map((peak) => {
            const countRatePeak = countRates[peak];
            if(countRatePeak){
                const addTerm = this.getAddTerm(peak);
                const subTerm = this.getSubTerm(peak);
                const I1 = 0;
                var vals = [];
                vals.push(+peak.split("_")[1]);

                const val1 = ((countRatePeak["intensity"] - subTerm)/ this.bgCountRate[peak][0])*(1 + I1); // Didnt include (Fx - ABx) in numerator
                vals.push(val1);
                
                const val2_1 = Math.pow(Math.pow(countRatePeak["sigma"]**2 + addTerm**2, 0.5) / (countRatePeak["intensity"] - subTerm), 2);
                const val2_2 = Math.pow(this.bgCountRate[peak][1]/this.bgCountRate[peak][0], 2);
                const val2 = Math.abs(val1) *Math.pow(val2_1 + val2_2 , 0.5);
                vals.push(val2);
                this.beforeCamValues[peak] = vals;

<<<<<<< HEAD
                this.radonSeries_I64_table.push(vals);
=======
                if(countRatePeak.hasOwnProperty("intensity"))this.radonSeries_I64_table.push(vals);
>>>>>>> 7b7881f (Changes suggested by mail on 12/27/24)
            }
        });

        this.potassiumSeries.map((peak) => {
            const countRatePeak = countRates[peak];
            if(countRatePeak){
                const addTerm = this.getAddTerm(peak);
                const subTerm = this.getSubTerm(peak);
                var vals = [];
                vals.push(+peak.split("_")[1]);

                const val1 = (countRatePeak["intensity"] - subTerm) / this.bgCountRate[peak][0]; // Didnt include (Fx - ABx) in numerator
                vals.push(val1);
                const val2_1 = Math.pow(Math.pow(countRatePeak["sigma"]**2 + addTerm**2, 0.5) / (countRatePeak["intensity"] - subTerm), 2);
                const val2_2 = Math.pow(this.bgCountRate[peak][1]/this.bgCountRate[peak][0], 2);
                const val2 = Math.abs(val1) *Math.pow(val2_1 + val2_2 , 0.5);
                vals.push(val2);
                this.beforeCamValues[peak] = vals;

<<<<<<< HEAD
                this.potassiumSeries_table.push(vals);
=======
                if(countRatePeak.hasOwnProperty("intensity"))this.potassiumSeries_table.push(vals);
>>>>>>> 7b7881f (Changes suggested by mail on 12/27/24)
            }
        });

        return {
            "238U": this.uraniumSeries_I58_table,
            "226Ra": this.uraniumSeries_I59_table,
            "210Pb": this.uraniumSeries_I60_table,
            "232Th": this.radonSeries_I62_table,
            "228Ac": this.radonSeries_I63_table,
            "224Ra": this.radonSeries_I64_table,
            "40K": this.potassiumSeries_table
        }

<<<<<<< HEAD
        
=======
>>>>>>> 7b7881f (Changes suggested by mail on 12/27/24)
    }

    calculateCam(table){
        var num = 0;
        var den1 = 0, den2 = 0;
        for(let i=0;i<table.length;i++){
<<<<<<< HEAD
            num += table[i][1]*table[i][2];
            den1 += table[i][2];
            den2 += table[i][1];
        }
        return [num/den1, num/den2];
=======
            num += table[i][1]*Math.pow(table[i][2], -2);
            den1 += Math.pow(table[i][2], -2);
        }
        return [num/den1, Math.pow(den1, -0.5)];
>>>>>>> 7b7881f (Changes suggested by mail on 12/27/24)
    }

    calculateActivity(){
        var activity = {};
        
        const camData = this.calculateActivityStepOne();

<<<<<<< HEAD
        Object.keys(camData).forEach(key => {
            const vals = this.calculateCam(camData[key]);
            activity[key] = vals;
        })
=======
        console.log("Cam Data: ", camData);

        Object.keys(camData).forEach(key => {
            const vals = this.calculateCam(camData[key]);
            activity[key] = vals;
        });
        
>>>>>>> 7b7881f (Changes suggested by mail on 12/27/24)
        this.activity = activity;
        return activity;
    }

    calculateSecond(sig, act1, act2, int){
        return Math.abs(int/act1) * Math.pow((sig/int)**2 + (act2/act1)**2, 0.5); 
    }

    calculateAbundance(){

        const activity = this.calculateActivity();
<<<<<<< HEAD

=======
>>>>>>> 7b7881f (Changes suggested by mail on 12/27/24)
        var abundance = {};
        Object.keys(activity).forEach(key => {
            if(key !== "224Ra" && key !== "228Ac"){
                abundance[key] = [activity[key][0]/this.activityConsts[key][0], this.calculateSecond(activity[key][1], 
                    this.activityConsts[key][0],
                    this.activityConsts[key][1],
                    activity[key][0])]            
             }
        })

        return [activity, abundance];

    }

<<<<<<< HEAD
    getUraniumSeriesGraph(){
=======
    getUlineData(){
        const U1s_1 = [
            {x: 0, y: 24.4},
            {x: 1500, y: 24.4} 
        ]
        const U1s_2 = [
            {x: 0, y: 23.7},
            {x: 1500, y: 23.7} 
        ]
        const U1s = [U1s_1, U1s_2];
        
        const U2s_1 = [
            {x: 0, y: 24.7},
            {x: 1500, y: 24.7} 
        ]
        const U2s_2 = [
            {x: 0, y: 23.4},
            {x: 1500, y: 23.4} 
        ]
        const U2s = [U2s_1, U2s_2];
        
        const U238_1 = [
            {x: 0, y: 30.2},
            {x: 1500, y: 30.2} 
        ]
        const U238_2 = [
            {x: 0, y: 22.2},
            {x: 1500, y: 22.2} 
        ]
        const U238 = [U238_1, U238_2];
        
        const Ra226_1 = [
            {x: 0, y: 34.2},
            {x: 1500, y: 34.2} 
        ]
        const Ra226_2 = [
            {x: 0, y: 18.3},
            {x: 1500, y: 18.3} 
        ]
        const Ra226 = [Ra226_1, Ra226_2];
        
        const uLineData = [U1s, U2s, U238, Ra226];
        return uLineData;
    }

    getUraniumSeriesGraph(){
        const uLineData = this.getUlineData();
>>>>>>> 7b7881f (Changes suggested by mail on 12/27/24)
        var graphU = [];
        var duplicates = [];
        this.uraniumSeries_I58_table.map((peak) => {
            if(!duplicates.find((x) => x==peak[0])){
                graphU.push({
                    x: peak[0],
                    y: peak[1],
                    errorY: peak[2],
                    label: peak[0]
                  })
                duplicates.push(peak[0]);
            }
            
        });
        this.uraniumSeries_I59_table.map((peak) => {
            if(!duplicates.find((x) => x==peak[0])){
                graphU.push({
                    x: peak[0],
                    y: peak[1],
                    errorY: peak[2],
                    label: peak[0]
                })
                duplicates.push(peak[0]);
            }
        });
<<<<<<< HEAD
        return graphU;
    }

=======
        return [graphU, uLineData];
    }

    getThLineData(){
        const Th1s_1 = [
            {x: 0, y: 52.5},
            {x: 1500, y: 52.5} 
        ]
        const Th1s_2 = [
            {x: 0, y: 51.6},
            {x: 1500, y: 51.6} 
        ]
        const Th1s = [Th1s_1, Th1s_2];

        const Th2s_1 = [
            {x: 0, y: 52.9},
            {x: 1500, y: 52.9} 
        ]
        const Th2s_2 = [
            {x: 0, y: 51.1},
            {x: 1500, y: 51.1} 
        ]
        const Th2s = [Th2s_1, Th2s_2];

        const Ac228_1 = [
            {x: 0, y: 52.9},
            {x: 1500, y: 52.9} 
        ]
        const Ra224_1 = [
            {x: 0, y: 51.7},
            {x: 1500, y: 51.7} 
        ]
        const Th = [Ac228_1, Ra224_1];

        const thLineData = [Th1s, Th2s, Th];

        return thLineData;
    }
>>>>>>> 7b7881f (Changes suggested by mail on 12/27/24)

    getThoriumSeriesGraph(){
        var graphTh = [];
        var duplicates = [];
<<<<<<< HEAD

=======
        const thLineData = this.getThLineData();
>>>>>>> 7b7881f (Changes suggested by mail on 12/27/24)
        this.radonSeries_I62_table.map((peak) => {
            if(!duplicates.find((x) => x==peak[0])){

                graphTh.push({
                    x: peak[0],
                    y: peak[1],
                    errorY: peak[2],
                    label: peak[0]
                  })
                duplicates.push(peak[0]);

            }
            
        });
        this.radonSeries_I63_table.map((peak) => {
            if(!duplicates.find((x) => x==peak[0])){

                graphTh.push({
                    x: peak[0],
                    y: peak[1],
                    errorY: peak[2],
                    label: peak[0]
                  })
                duplicates.push(peak[0]);

            }
        });
        this.radonSeries_I64_table.map((peak) => {
            if(!duplicates.find((x) => x==peak[0])){

                graphTh.push({
                    x: peak[0],
                    y: peak[1],
                    errorY: peak[2],
                    label: peak[0]
                  })
                duplicates.push(peak[0]);

            }
        });
<<<<<<< HEAD
        return graphTh;
=======
        return [graphTh, thLineData];
>>>>>>> 7b7881f (Changes suggested by mail on 12/27/24)
    }





}