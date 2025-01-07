export class Processor {
    constructor(energyCoefficients=[], data={}, activeProfileData={}, name='default') {
      this.data = data;
      this.name = name;
      this.activeProfileData = activeProfileData;
      this.channels = this.data['channels'];
      this.counts = this.data['channelData'];
      this.energies = this.data['energy'];
      this.peaks = {};
      this.fwhm = {};
      this.energyPortion = {};
      this.BFHE = {};
      this.BFBE = {};
      this.roi = {};
      this.roiPeak = {};
      this.bfStep = {};
      this.coupsNet = {};
      this.interestRegionCounts = {};
      this.interestRegionEnergies = {};
      this.interestRegionIndices = {};
      this.channelsPortion = {};
      this.sigma = {};
      this.intensity = {};

      this.A0 =  energyCoefficients[0]
      this.A1 = energyCoefficients[1]
      this.A2 = energyCoefficients[2]
      // this.A0 = -0.112812706517562;
      // this.A1 = 0.189462966214524;
      // this.A2 =  5.39639461869184 * Math.pow(10, -9);

    }

    getRefCurveData(){
      return [
        {x: 46.539, y: 0.58},
        {x: 59.5409, y: 0.59},
        {x: 63.29, y:0.59},
        {x:67.672, y:0.61},
        {x:129.07, y:0.79},
        {x:238.632, y:0.90},
        {x:295.2228, y:0.88},
        {x:338.32, y:0.99},
        {x:351.9321, y:0.98},
        {x:609.32, y:1.19},
        {x:661.657, y:1.21},
        {x:911.2040, y:1.46},
        {x:968.971, y:1.51},
        {x:1120.294, y:1.59},
        {x:1460.822, y:1.87}
      ]
    }

    setEnergyCoefficients(energyCoefficients=[]) {
      this.A0 =  energyCoefficients[0]
      this.A1 = energyCoefficients[1]
      this.A2 = energyCoefficients[2]
    }
  
    analyze() {
      this.energies = this.channels.map(x => this.peakCalibration(x));
      this.calculateInterestRegion(this.activeProfileData);
      this.calculateFwhm(this.activeProfileData);
      this.calculatePeakPositions(this.activeProfileData);
      this.calculateNarrowPeakPortion(this.activeProfileData);
    }

    activityCalculationStepOne (peakData) {
      this.calculateInterestRegion(peakData);
      this.calculateFwhm(peakData);
      this.calculatePeakPositions(peakData);
      this.calculateNarrowPeakPortion(peakData);
      return this.performPeakAnalysis(peakData);
    }
  
    peakCalibration(pos) {
      return this.A0 * (pos ** 0) +
             this.A1 * (pos ** 1) +
             this.A2 * (pos ** 2);
    }
  
    extractPortions(lower, upper) {
      const lowerInd = this.minIndexGreaterThan(this.energies, lower);
      const upperInd = Math.min(this.maxIndexLessThan(this.energies, upper));
      return [lowerInd, upperInd];
    }
  
    extractIndex(energy) {
      return this.maxIndexLessThan(this.energies, energy);
    }
  
    calculatePeakPositions(isotopeData) {
      isotopeData.forEach(isotope => {
        const lower = isotope["energy"] - isotope["limit_BE_Rpic_left"];
        const upper = +isotope["energy"] + +isotope["limit_HE_Rpic_left"];
        const [lowerInd, upperInd] = this.extractPortions(lower, upper);
        const countsPortion = this.counts.slice(lowerInd, upperInd + 1);
        const channelsPortion = this.channels.slice(lowerInd, upperInd + 1);
        const energyPortion = this.energies.slice(lowerInd, upperInd + 1);
  
        this.roi[isotope["name"] + "_" + isotope["energy"]] = {
          total_hits: this.sum(countsPortion),
          num_channels: countsPortion.length,
          total_bf_under_peak: countsPortion.length * (
            (this.BFBE[isotope["name"] + "_" + isotope["energy"]]?.hits_per_channel + this.BFHE[isotope["name"] + "_" + isotope["energy"]]?.hits_per_channel) / 2
          ),
          net_hits: this.sum(countsPortion) - (countsPortion.length * (
            (this.BFBE[isotope["name"] + "_" + isotope["energy"]]?.hits_per_channel + this.BFHE[isotope["name"] + "_" + isotope["energy"]]?.hits_per_channel) / 2
          ))
        };

        // Lc Calculation
        let dic = this.roi[isotope["name"] + "_" + isotope["energy"]];
        this.roi[isotope["name"] + "_" + isotope["energy"]]["lc"] = 1.645 * Math.pow((dic.total_bf_under_peak*(1 + dic.num_channels/(Number(isotope["nb_canaux_BFBE"]) + Number(isotope["nb_canaux_BFHE"])))), 0.5); 
        let temp_sum = 0;
        for(var i=0;i<this.coupsNet[isotope["name"] + "_" + isotope["energy"]].length;i++){
          temp_sum += this.coupsNet[isotope["name"] + "_" + isotope["energy"]][i] * this.channelsPortion[isotope["name"] + "_" + isotope["energy"]][i];
        }
        temp_sum /= this.sum(this.coupsNet[isotope["name"] + "_" + isotope["energy"]]);
        this.peaks[isotope["name"] + "_" + isotope["energy"]] = temp_sum;
        this.energyPortion[isotope["name"] + "_" + isotope["energy"]] = energyPortion[this.argmax(countsPortion)];

        // Activity calculation
        this.intensity[isotope["name"] + "_" + isotope["energy"]] =this.roi[isotope["name"] +"_"+ isotope["energy"]]["total_hits"] - this.sum(this.bfStep[isotope["name"] + "_" + isotope["energy"]])
        
        this.sigma[isotope["name"] + "_" + isotope["energy"]] = Math.sqrt(+this.roi[isotope["name"] +"_"+ isotope["energy"]]["total_hits"]
          + (((this.roi[isotope["name"] + "_" +isotope["energy"]]["num_channels"] / isotope["nb_canaux_BFBE"]) ** 2 )*(this.BFBE[isotope["name"] + "_" + isotope["energy"]]["total_hits"]/4)
          + ((this.roi[isotope["name"] + "_" +isotope["energy"]]["num_channels"] / isotope["nb_canaux_BFHE"]) ** 2 )*(this.BFHE[isotope["name"] + "_" + isotope["energy"]]["total_hits"]/4)
        ));
      });
    }
  
    calculateInterestRegion(isotopeData) {
      isotopeData.forEach(isotope => {
        const lower = isotope["energy"] - isotope["limit_BE_Rpic_right"];
        const leftIndex = this.extractIndex(lower) - 2 * isotope["nb_canaux_BFBE"] + 1;
        const rightIndex = +leftIndex + +isotope["range"] - 1;
  
        this.interestRegionEnergies[isotope["name"] + "_" + isotope["energy"]] = this.energies.slice(leftIndex, rightIndex);
        this.interestRegionIndices[isotope["name"] + "_" + isotope["energy"]] = [leftIndex, rightIndex];
        this.interestRegionCounts[isotope["name"] + "_" + isotope["energy"]] = this.counts.slice(leftIndex, rightIndex);
      });
    }

    optimizeCoefficients(interestPeaks) {
      const specialPeaks = ["59.5409", "67.672", "129.07", "661.657", "968.971"];
      const new_interestPeaks = interestPeaks.filter(peak => !specialPeaks.includes(peak.energy));
      this.calculateNewCoeff(new_interestPeaks);
      this.energies = this.channels.map(x => this.peakCalibration(x));
      this.analyze();
      return [this.A0, this.A1, this.A2];
    }

    calculateNewCoeff(interestPeaks) {
      const profileEnergies = Array.from(interestPeaks.map((x) => +x["energy"]));
      const profilePeakNames = Array.from(interestPeaks.map((x) => x["name"] + "_" + x["energy"]));
      const profilePeaks0 = Object.keys(this.peaks).filter(x => profilePeakNames.includes(x));
      const profilePeaks = profilePeaks0.map(x => this.peaks[x]);


      const M3 = this.sum(profilePeaks);
      const M4 = profilePeaks.length;
      const M5 = this.sum(profileEnergies);
      const M6 = this.sumSq(profilePeaks);
      const M7 = this.sumQu(profilePeaks);
      const M8 = this.sumPow4(profilePeaks);
      const M9 = this.sumProd(profileEnergies, profilePeaks);
      const M10 = this.sumProdSquare(profileEnergies, profilePeaks);

      const M12 = M4*(M6*M8-M7*M7) - M3*(M3*M8-M6*M7) + M6*(M3*M7-M6*M6);

      this.A0 = (M5*(M6*M8-M7*M7)+M9*(M7*M6-M3*M8)+M10*(M3*M7-M6*M6) )/M12;
      this.A1 = ( M5*(M6*M7-M3*M8)+M9*(M4*M8-M6*M6)+M10*(M3*M6-M4*M7) )/M12;
      this.A2 = ( M5*(M3*M7-M6*M6)+M9*(M3*M6-M4*M7)+M10*(M4*M6-M3*M3) )/M12

    }
  
    calculateFwhm(isotopeData) {
      isotopeData.forEach(isotope => {
        const lower = isotope["energy"] - isotope["limit_BE_Rpic_left"];
        const upper = +isotope["energy"] + +isotope["limit_HE_Rpic_left"];
        const [lowerInd, upperInd] = this.extractPortions(lower, upper);
        const energyValLeft = isotope["energy"] - isotope["limit_BE_Rpic_right"];
        // const energyValLeft = (isotope["name"] == "40K_1460.822") ? isotope["energy"] - isotope["limit_HE_Rpic_left"] : isotope["energy"] - isotope["limit_BE_Rpic_right"];

        const leftIndex = this.minIndexGreaterThan(this.energies, energyValLeft);
        const leftCountPortion = this.counts.slice(leftIndex - isotope["nb_canaux_BFBE"], leftIndex);
        const leftCoupsTotal = this.sum(leftCountPortion);
        const leftCoupsPerCanal = leftCoupsTotal / isotope["nb_canaux_BFBE"];
        
        this.BFBE[isotope["name"] + "_" + isotope["energy"]] = {
          total_hits: leftCoupsTotal,
          hits_per_channel: leftCoupsPerCanal,
          indices: [leftIndex - isotope["nb_canaux_BFBE"], Math.min(leftIndex + 1, 8191)]
        };
  
        const energyValRight = +isotope["energy"] + +isotope["limit_HE_Rpic_right"];
        const rightIndex = this.extractIndex(energyValRight);
        const rightCountPortion = this.counts.slice(rightIndex+1, +rightIndex + +isotope["nb_canaux_BFHE"]+1);
        const rightCoupsTotal = this.sum(rightCountPortion);
        const rightCoupsPerCanal = rightCoupsTotal / isotope["nb_canaux_BFHE"];
  
        this.BFHE[isotope["name"] + "_" + isotope["energy"]] = {
          total_hits: rightCoupsTotal,
          hits_per_channel: rightCoupsPerCanal,
          indices: [rightIndex, Math.min(+rightIndex + +isotope["nb_canaux_BFHE"] + 1, 8191)]
        };
  
        const countsPortion = this.counts.slice(lowerInd, upperInd + 1);
        this.channelsPortion[isotope["name"] + "_" + isotope["energy"]] = this.channels.slice(lowerInd, upperInd+1);
        this.bfStep[isotope["name"] + "_" + isotope["energy"]] = countsPortion.map((_, i) => 
          leftCoupsPerCanal + (rightCoupsPerCanal - leftCoupsPerCanal) * (this.sum(countsPortion.slice(0, i+1)) / this.sum(countsPortion))
        );
  
        const coupsNets = countsPortion.map((count, i) => count - this.bfStep[isotope["name"] + "_" + isotope["energy"]][i]);
        this.coupsNet[isotope["name"] + "_" + isotope["energy"]] = coupsNets;
        const energyPortion = this.energies.slice(lowerInd, upperInd + 1);
        const minus = this.sum(coupsNets.map((net, i) => net * energyPortion[i])) / this.sum(coupsNets);
  
        this.fwhm[isotope["name"] + "_" + isotope["energy"]] = 2.36 * Math.sqrt(
          (this.sum(coupsNets.map((net, i) => net * (energyPortion[i] ** 2))) / this.sum(coupsNets)) - minus ** 2
        );
      });
    }
  
    calculateNarrowPeakPortion(isotopeData) {
      isotopeData.forEach(isotope => {
        const lower = isotope["energy"] - isotope["larger_region_pic"] / 2;
        const upper = +isotope["energy"] + +isotope["larger_region_pic"] / 2;
        const [lowerInd, upperInd] = this.extractPortions(lower, upper);
        const countsPortion = this.counts.slice(lowerInd, upperInd + 1);
  
        this.roiPeak[isotope["name"] + "_" + isotope["energy"]] = {
          total_hits: this.sum(countsPortion),
          num_channels: countsPortion.length,
          total_bf_under_peak: this.roi[isotope["name"] + "_" + isotope["energy"]].num_channels * (
            (this.BFBE[isotope["name"] + "_" + isotope["energy"]]?.hits_per_channel + this.BFHE[isotope["name"] + "_" + isotope["energy"]]?.hits_per_channel) / 2
          ),
          net_hits: this.sum(countsPortion) - this.roi[isotope["name"] + "_" + isotope["energy"]].num_channels * (
            (this.BFBE[isotope["name"] + "_" + isotope["energy"]]?.hits_per_channel + this.BFHE[isotope["name"] + "_" + isotope["energy"]]?.hits_per_channel) / 2
          )
        };
      });
    }

    getResidualPlotMetrics(isotopeData) {
      const residuals = isotopeData.map(isotope => this.peakCalibration(this.peaks[isotope["name"] + "_" + isotope["energy"]]) - isotope["energy"]);
      const energies = isotopeData.map(isotope => isotope["energy"]);
      
    }
  
    performPeakAnalysis(isotopeData) {
      let returnData = [];
      isotopeData.map((isotope, index) => {
        const x = this.interestRegionEnergies[isotope["name"] + "_" + isotope["energy"]]
        const y1 = this.interestRegionCounts[isotope["name"] + "_" + isotope["energy"]]

        // Peak Area
        let a = new Array(this.energies.length).fill(0);

        const left = isotope["energy"] - isotope["limit_BE_Rpic_left"];
        const right = +isotope["energy"] + +isotope["limit_HE_Rpic_left"];

        const [leftIndex, rightIndex] = this.extractPortions(left, right);
        a = this.updateArray(a, this.counts, leftIndex, rightIndex);
        const y2 = a.slice(this.interestRegionIndices[isotope["name"] + "_" + isotope["energy"]][0], this.interestRegionIndices[isotope["name"] + "_" + isotope["energy"]][1])
        
        // BF Step

        a = new Array(this.energies.length).fill(0);
        a = this.updateArray2(a, this.bfStep[isotope["name"] + "_" + isotope["energy"]], leftIndex, rightIndex);
        const y3 = a.slice(this.interestRegionIndices[isotope["name"] + "_" + isotope["energy"]][0], this.interestRegionIndices[isotope["name"] + "_" + isotope["energy"]][1]);
        const y4 = y1.map((v,i) => y3[i] !== 0 ? v - y3[i] : 0);

        returnData.push({
            "id": index,
            "name": isotope["name"] + "_" + isotope["energy"],
            "BFBE": this.BFBE[isotope["name"] + "_" + isotope["energy"]],
            "BFHE": this.BFHE[isotope["name"] + "_" + isotope["energy"]],
            "region": this.roi[isotope["name"] + "_" + isotope["energy"]],
            "pic": this.roiPeak[isotope["name"] + "_" + isotope["energy"]],
            "sigma": +this.roi[isotope["name"] + "_" + isotope["energy"]]["lc"] < +this.intensity[isotope["name"] + "_" + isotope["energy"]] ? this.sigma[isotope["name"] + "_" + isotope["energy"]] : 0,
            "intensity": +this.roi[isotope["name"] + "_" + isotope["energy"]]["lc"] < +this.intensity[isotope["name"] + "_" + isotope["energy"]] ? this.intensity[isotope["name"] + "_" + isotope["energy"]] : 0,
            "results": {
                "fwhm": this.fwhm[isotope["name"] + "_" + isotope["energy"]],
                "peak_channel": this.peaks[isotope["name"] + "_" + isotope["energy"]],
                "peak_energy": this.energyPortion[isotope["name"] + "_" + isotope["energy"]],
                "sigma": isotope["larger_region_pic"] * 2.36 / this.fwhm[isotope["name"] + "_" + isotope["energy"]]
            },
            "labels": x.map(num => Math.ceil(num * 100)/100),
            "plotData": [
              { "label": 'Counts', "data": y1, "borderColor": 'blue', "fill": false, "pointRadius": 0 },
              { "label": 'BF Step', "data": y3, "borderColor": 'red', "fill": false, "pointRadius": 0 },
              { "label": 'Peak', "data": y4, "borderColor": 'green', "fill": false, "pointRadius": 0 }
            ],
            
        })
      })
      return returnData;
    }
    
    peakAnalysisForRequiredPeaks() {

    } 

    sum(array) {
      return array.reduce((acc, val) => acc + val, 0);
    }

    sumSq(array) {
      return array.reduce((acc, val) => acc + val*val, 0);
    }

    sumQu(array) {
      return array.reduce((acc, val) => acc + val*val*val, 0);
    }

    sumPow4(array) {
      return array.reduce((acc, val) => acc + val*val*val*val, 0);
    }

    sumProd(array1, array2) {
      return array1.reduce((acc, val, ind) => acc + val*array2[ind], 0);
    }

    sumProdSquare(array1, array2) {
      return array1.reduce((acc, val, ind) => acc + val*array2[ind]*array2[ind], 0);
    }

    updateArray(a, sourceArray, leftIndex, rightIndex) {
      for (let i = leftIndex; i <= rightIndex; i++) {
          a[i] = sourceArray[i];
      }
      return a;
    }

    updateArray2(a, sourceArray, leftIndex, rightIndex) {
      for (let i = leftIndex; i <= rightIndex; i++) {
          a[i] = sourceArray[i-leftIndex];
      }
      return a;
    }

    minIndexGreaterThan(array, value) {
      for (let i = 0; i < array.length; i++) {
        if (array[i] >= value) {
          return i;
        } 
      }
      return array.length;
    }
  
    maxIndexLessThan(array, value) {
      let maxIndex = 0;
      for (let i = 0; i < array.length; i++) {
        if (array[i] <= value) {
          maxIndex = i;
        } else {
          break;
        }
      }
      return maxIndex;
    }
  
    argmax(array) {
      return array.reduce((maxIdx, val, idx, arr) => val > arr[maxIdx] ? idx : maxIdx, 0);
    }
  }
  