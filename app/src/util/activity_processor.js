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
    }

    calculateCountRate(){
        const weight = this.sampleData["weight"]
        const liveTime = this.sampleData["liveTime"]
        const deadTime = this.sampleData["realTime"]

        var countRates = [];

        this.intensityData.map(peak => {
            let countRatePeak = {};
            countRatePeak["name"] = peak["name"]; 
            let bgInt = 0;
            let bgSig = 0;
            if(this.background[peak["name"]] !== null){
                bgInt = this.background[peak["name"]][0];
                bgSig = this.background[peak["name"]][1];
            }

            let div = peak["intensity"] / weight;
            if(this.background[peak["name"]] !== null){
                div = div - bgInt;
            }
            
            if(div > 0){
                countRatePeak["intensity"] = div / weight;
                const componentA = (peak["sigma"]/liveTime)**2 + bgSig**2;
                const componentB = ((peak["intensity"]/liveTime) - countRatePeak["intensity"])**2;
                const componentC = (0.0001/weight)**2;
                countRatePeak["sigma"] = Math.pow(componentA/componentB + componentC, 0.5);
            }
            countRates.add(countRatePeak);
        });

        return countRates;

    }

}