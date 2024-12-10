import { act } from "react";

export class ActivityProcessor {
    constructor(sampleData, intensityData) {
        this.sampleData = sampleData;
        this.intensityData = intensityData;
        this.background = {
            "40K_1460.822": [0.00015, 0.00007],
            "214Pb_295.2228": [0.00046, 0.00011],
            "214Pb_351.9321": [0.00041, 0.00011],
            "214Bi_609.321": [0.00037, 0.00009],
            "298Tl_583.187": [0.00017, 0.00009]
        };
        this.bgCountRate = {
            "40K_1460.822": [0.344424498411723, 0.001237063375072],
            "234Th_63.29": [1.023542137857730, 0.003714212379299],
            "230Th_67.672": [0.120565918405086, 0.002291424915271],
            "234Th_92.59": [1.329100032178770, 0.015613259303650],
            "235U_143.76": [0.169678425278705, 0.001630749364407],
            "235U_185.715": [0.556264302166526, 0.041394583078785],
            "234mPa_1001.03": [0.034772493723368, 0.000660634206564],
            "214Pb_241.9950": [1.124907152516270, 0.003774933118246],
            "214Pb_295.2228": [2.435195785007380, 0.006943778272153],
            "214Pb_351.9321": [3.916051823064390, 0.010619548377979],
            "214Bi_609.320": [2.256471503893620, 0.006457835461313],
            "214Bi_1120.294": [0.417351215241201, 0.001770922935256],
            "210Pb_46.539": [1.058527184248070, 0.003718770339825],
            "228Ac_129.065": [0.364415313817806, 0.003964416956036],
            "228Ac_338.320": [1.112821297494730, 0.011141816166642],
            "228Ac_911.204": [0.968600626160885, 0.009685045216520],
            "228Ac_968.971": [0.567426639941459, 0.005810340875216],
            "212Pb_238.632": [6.538597476504180, 0.063477823509564],
            "212Pb_300.087": [0.282147935787264, 0.003090486023260],
            "212Bi_727.330": [0.329075072840319, 0.003487179848056],
            "208Tl_583.187": [1.400997240517890, 0.013954991124813],
            "208Tl_860.557": [0.175037443321402, 0.001949071120900],
            "137Cs_661.657": [4.632204519045070, 0.095908218862377],
            "241Am_59.5409": [8.520726850045780, 0.349403846655479]
        };

        this.abundanceConsts = {
            "238U": [12.347, 0.008],
            "226Ra": [12.347, 0.008],
            "210Pb": [12.347, 0.008],
            "232Th": [4.07, 0.003],
            "40K": [315.7449, 0.93096]
        }
        
        this.uraniumSeries_I58= ["234Th_63.29",  "234Th_92.59", "234Th_92.59", "235U_143.76", "235U_185.715", "234mPa_1001.03"];
        this.uraniumSeries_I59 = ["214Pb_295.2228", "214Pb_351.9321","214Bi_609.320", "214Bi_1120.294"];
        this.uraniumSeries_I60 = ["210Pb_46.539"];
        this.radonSeries_I62 = ["228Ac_338.320", "228Ac_911.204", "228Ac_968.971", "212Pb_238.632", "208Tl_583.187", "208Tl_860.557"];
        this.radonSeries_I63 = ["228Ac_129.065", "228Ac_338.320", "228Ac_911.204", "228Ac_968.971"];
        this.radonSeries_I64 = ["212Pb_238.632", "212Pb_300.087", "212Bi_727.330", "208Tl_583.187", "208Tl_860.557"];
        this.potassiumSeries = ["40K_1460.822"];

        this.uraniumSeries_I58_table = [];
        this.uraniumSeries_I59_table = [];
        this.uraniumSeries_I60_table = [];
        this.radonSeries_I62_table = [];
        this.radonSeries_I63_table = [];
        this.radonSeries_I64_table = [];
        this.potassiumSeries_table = [];

    }

    analyze(){
        return this.calculateAbundance();
    }
        

    calculateCountRate(){
        const weight = this.sampleData["weight"]
        const liveTime = this.sampleData["liveTime"]
        const deadTime = this.sampleData["realTime"]

        var countRates = {};
        this.intensityData.map(peak => {
            let countRatePeak = {};
            countRatePeak["name"] = peak["name"]; 
            let bgInt = 0;
            let bgSig = 0;
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
        console.log("Count Rates: ", countRates);
        return countRates;

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

    calculateActivityStepOne(){
        
        const countRates = this.calculateCountRate();
        
        this.uraniumSeries_I58.map((peak) => {
            const countRatePeak = countRates[peak];
            if(countRatePeak){
                const addTerm = 0;
                const subTerm = 0;
                var vals = [];
                vals.push(+peak.split("_")[1]);
                const val1 = (countRatePeak["intensity"] - subTerm) / this.bgCountRate[peak][0]; // Didnt include (Fx - ABx) in numerator
                vals.push(val1);
                const val2_1 = Math.pow(Math.pow(countRatePeak["sigma"]**2 + addTerm**2, 0.5) / (countRatePeak["intensity"] - subTerm), 2);
                const val2_2 = Math.pow(this.bgCountRate[peak][1]/this.bgCountRate[peak][0], 2);
                const val2 = Math.abs(val1) * Math.pow(val2_1 + val2_2 , 0.5);
                vals.push(val2);

                this.uraniumSeries_I58_table.push(vals);
            }
        });

        this.uraniumSeries_I59.map((peak) => {
            const countRatePeak = countRates[peak];
            if(countRatePeak){
                const addTerm = 0;
                const subTerm = 0;
                const I1 = 0;
                var vals = [];
                vals.push(+peak.split("_")[1]);
                const val1 = ((countRatePeak["intensity"] - subTerm)/ this.bgCountRate[peak][0])*(1 + I1); // Didnt include (Fx - ABx) in numerator
                vals.push(val1);
                
                const val2_1 = Math.pow(Math.pow(countRatePeak["sigma"]**2 + addTerm**2, 0.5) / (countRatePeak["intensity"] - subTerm), 2);
                const val2_2 = Math.pow(this.bgCountRate[peak][1]/this.bgCountRate[peak][0], 2);
                const val2 = Math.abs(val1) * Math.pow(val2_1 + val2_2 , 0.5);
                vals.push(val2);

                this.uraniumSeries_I59_table.push(vals);
            }
        });

        this.uraniumSeries_I60.map((peak) => {
            const countRatePeak = countRates[peak];
            if(countRatePeak){
                const addTerm = 0;
                const subTerm = 0;
                const I1 = 0;
                var vals = [];
                vals.push(+peak.split("_")[1]);
                const val1 = ((countRatePeak["intensity"] - subTerm)/ this.bgCountRate[peak][0])*(1 + I1); // Didnt include (Fx - ABx) in numerator
                vals.push(val1);
                
                const val2_1 = Math.pow(Math.pow(countRatePeak["sigma"]**2 + addTerm**2, 0.5) / (countRatePeak["intensity"] - subTerm), 2);
                const val2_2 = Math.pow(this.bgCountRate[peak][1]/this.bgCountRate[peak][0], 2);
                const val2 = Math.abs(val1) * Math.pow(val2_1 + val2_2 , 0.5);
                vals.push(val2);

                this.uraniumSeries_I60_table.push(vals);
            }
        });

        this.radonSeries_I62.map((peak) => {
            const countRatePeak = countRates[peak];
            if(countRatePeak){
                const addTerm = 0;
                const subTerm = 0;
                const I1 = 0;
                var vals = [];
                vals.push(+peak.split("_")[1]);

                const val1 = ((countRatePeak["intensity"] - subTerm)/ this.bgCountRate[peak][0])*(1 + I1); // Didnt include (Fx - ABx) in numerator
                vals.push(val1);
                
                const val2_1 = Math.pow(Math.pow(countRatePeak["sigma"]**2 + addTerm**2, 0.5) / (countRatePeak["intensity"] - subTerm), 2);
                const val2_2 = Math.pow(this.bgCountRate[peak][1]/this.bgCountRate[peak][0], 2);
                const val2 = Math.abs(val1) *Math.pow(val2_1 + val2_2 , 0.5);
                vals.push(val2);

                this.radonSeries_I62_table.push(vals);
            }
        });

        this.radonSeries_I63.map((peak) => {
            const countRatePeak = countRates[peak];
            if(countRatePeak){
                const addTerm = 0;
                const subTerm = 0;
                const I1 = 0;
                var vals = [];
                vals.push(+peak.split("_")[1]);

                const val1 = ((countRatePeak["intensity"] - subTerm)/ this.bgCountRate[peak][0])*(1 + I1); // Didnt include (Fx - ABx) in numerator
                vals.push(val1);
                
                const val2_1 = Math.pow(Math.pow(countRatePeak["sigma"]**2 + addTerm**2, 0.5) / (countRatePeak["intensity"] - subTerm), 2);
                const val2_2 = Math.pow(this.bgCountRate[peak][1]/this.bgCountRate[peak][0], 2);
                const val2 = Math.abs(val1) *Math.pow(val2_1 + val2_2 , 0.5);
                vals.push(val2);

                this.radonSeries_I63_table.push(vals);
            }
        });

        this.radonSeries_I64.map((peak) => {
            const countRatePeak = countRates[peak];
            if(countRatePeak){
                const addTerm = 0;
                const subTerm = 0;
                const I1 = 0;
                var vals = [];
                vals.push(+peak.split("_")[1]);

                const val1 = ((countRatePeak["intensity"] - subTerm)/ this.bgCountRate[peak][0])*(1 + I1); // Didnt include (Fx - ABx) in numerator
                vals.push(val1);
                
                const val2_1 = Math.pow(Math.pow(countRatePeak["sigma"]**2 + addTerm**2, 0.5) / (countRatePeak["intensity"] - subTerm), 2);
                const val2_2 = Math.pow(this.bgCountRate[peak][1]/this.bgCountRate[peak][0], 2);
                const val2 = Math.abs(val1) *Math.pow(val2_1 + val2_2 , 0.5);
                vals.push(val2);

                this.radonSeries_I64_table.push(vals);
            }
        });

        this.potassiumSeries.map((peak) => {
            const countRatePeak = countRates[peak];
            if(countRatePeak){
                const addTerm = 0;
                const subTerm = 0;
                var vals = [];
                vals.push(+peak.split("_")[1]);

                const val1 = (countRatePeak["intensity"] - subTerm) / this.bgCountRate[peak][0]; // Didnt include (Fx - ABx) in numerator
                vals.push(val1);
                const val2_1 = Math.pow(Math.pow(countRatePeak["sigma"]**2 + addTerm**2, 0.5) / (countRatePeak["intensity"] - subTerm), 2);
                const val2_2 = Math.pow(this.bgCountRate[peak][1]/this.bgCountRate[peak][0], 2);
                const val2 = Math.abs(val1) *Math.pow(val2_1 + val2_2 , 0.5);
                vals.push(val2);

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

    calculateActivity(){
        var activity = {};
        
        const camData = this.calculateActivityStepOne();

        Object.keys(camData).forEach(key => {
            const vals = this.calculateCam(camData[key]);
            activity[key] = vals;
        })
        return activity;
    }

    calculateSecond(sig, abun1, abun2, int){
        return Math.abs(int/abun1) * Math.pow((sig/int)**2 + (abun2/abun1)**2, 0.5); 
    }

    calculateAbundance(){

        const activity = this.calculateActivity();

        var abundance = {};
        Object.keys(activity).forEach(key => {
            if(key !== "224Ra" && key !== "228Ac"){
                abundance[key] = [activity[key][0]/this.abundanceConsts[key][0], this.calculateSecond(activity[key][1], 
                    this.abundanceConsts[key][0],
                    this.abundanceConsts[key][1],
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