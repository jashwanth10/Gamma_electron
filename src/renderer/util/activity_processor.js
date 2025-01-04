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
        
        this.uraniumSeries_I58= ["234Th_63.29",  "234Th_67.672", "234Th_92.59", "235U_143.76", "235U_185.715", "234mPa_1001.03"];
        this.uraniumSeries_I59 = ["214Pb_295.2228", "214Pb_351.9321","214Bi_609.320", "214Bi_1120.294"]; // J52 -- 226Ra
        this.uraniumSeries_I60 = ["210Pb_46.539"];
        this.radonSeries_I62 = ["228Ac_338.320", "228Ac_911.204", "228Ac_968.971", "212Pb_238.632", "208Tl_583.187", "208Tl_860.557"]; //J55 -- 232Th
        this.radonSeries_I63 = ["228Ac_129.07", "228Ac_338.320", "228Ac_911.204", "228Ac_968.971"];
        this.radonSeries_I64 = ["212Pb_238.632", "212Pb_300.087", "212Bi_727.330", "208Tl_583.187", "208Tl_860.557"];
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
        this.col_AGAH["235U_185.715"] = [0.000088, 0.000007];
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
        }else if(peak === "235U_185.715" || peak === "214Pb_351.9321" || peak === "228Ac_338.320" || peak === "212Pb_300.087"){
            return this.activity["226Ra"];
        }
        return [1, 0];
    }

    calculateCols(){
        // P - efficiencySecondary Y - emissionRate
        for(const [key, value] of Object.entries(this.col_AAAB)){
            const acic = this.getColId(key);
            let val1 = 100 * acic[0] * this.efficiencySecondary[key][0] * this.emissionRate[key][0]; 
            if(key === "235U_185.715" || key === "214Pb_351.9321" || key === "228Ac_338.320" || key === "212Pb_300.087"){
                val1 = 100 * acic[0] * this.activityRatio[0] * this.efficiencySecondary[key][0] * this.emissionRate[key][0];
            }
            if((this.emissionRate[key][0] !== 0) && (this.efficiency[key][0] !== 0)){
                let val2 = val1 * Math.pow( Math.pow((this.emissionRate[key][1]/this.emissionRate[key][0]), 2) 
                            + Math.pow((acic[1]/acic[0]), 2) 
                            + Math.pow((this.efficiency[key][1]/this.efficiency[key][0]) ,2), 0.5);
                if(key === "235U_185.715" || key === "214Pb_351.9321" || key === "228Ac_338.320" || key === "212Pb_300.087"){
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
        }else if(peak === "235U_185.715"){
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
        }else if(peak === "235U_185.715"){
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
        
        this.uraniumSeries_I58.map((peak) => {
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
                const val2 = Math.abs(val1) * Math.pow(val2_1 + val2_2 , 0.5);
                vals.push(val2);
                this.beforeCamValues[peak] = vals;
                this.uraniumSeries_I58_table.push(vals);
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

                this.uraniumSeries_I59_table.push(vals);
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

                this.uraniumSeries_I60_table.push(vals);
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

                this.radonSeries_I62_table.push(vals);
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

                this.radonSeries_I63_table.push(vals);
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

                this.radonSeries_I64_table.push(vals);
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

                this.potassiumSeries_table.push(vals);
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

        
    }

    calculateCam(table){
        var num = 0;
        var den1 = 0, den2 = 0;
        for(let i=0;i<table.length;i++){
            num += table[i][1]*table[i][2];
            den1 += table[i][2];
            den2 += table[i][1];
        }
        return [num/den1, num/den2];
    }

    calculateActivity(){
        var activity = {};
        
        const camData = this.calculateActivityStepOne();

        Object.keys(camData).forEach(key => {
            const vals = this.calculateCam(camData[key]);
            activity[key] = vals;
        })
        this.activity = activity;
        return activity;
    }

    calculateSecond(sig, act1, act2, int){
        return Math.abs(int/act1) * Math.pow((sig/int)**2 + (act2/act1)**2, 0.5); 
    }

    calculateAbundance(){

        const activity = this.calculateActivity();

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

    getUraniumSeriesGraph(){
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
        return graphU;
    }


    getThoriumSeriesGraph(){
        var graphTh = [];
        var duplicates = [];

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
        return graphTh;
    }





}