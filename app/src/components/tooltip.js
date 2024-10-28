// InfoIconWithTooltip.js
import React, { useEffect, useState } from 'react';
import {Tooltip} from 'react-tooltip'
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome

const InfoIconWithTooltip = ({chart}) => {
    const [info, setInfo] = useState("");
    useEffect(() => {
        if(chart === "residual"){
            setInfo("Difference between observed and expected centroid peak position.<br/> These datapoints should scatter, randomly, with a mean of zero. <br/>A visible trend suggest an inadequate energy calibration")
        } else if(chart === "FWHM"){
            setInfo("Full Width at Half Maximum; a measure of the resolution of a spectrum, being the width of a peak (keV), at half the maximum peak height.<br/>The FWHM always increases with peak energy, in a predictable manner. <br/>These datapoints should overlap, within reason, the expected reference curve (for a single, full-energy peak).<br/> Datapoints that are situated significantly higher or lower is an indication of a problem. The most likely, due to a low peak count rate. <br/>Datapoints higher relative to the curve can be due to spectral interference, X-rays, or a single escape peak.");
        } else if (chart === "calib"){
            setInfo("Relation between calculated energy and its data channel, for specific peaks of interest.<br/> The datapoint will always follow a predictable curve, increasing with channels. <br/>A curve fit (2nd order polynomial) should pass (near) zero. <br/>The 2nd order term is extremely small, such that the curve is appear to us as a straight line. <br/>Data points that deviates should always prompt further scrutiny.<br/> Possible causes can be due to inadequate curve fit, a low peak count rate, or an inappropriate peak identification, among various other causes. <br/>The residual plot is complementary to this analysis and will always more sensitive in this validation process.");
        }
    }, [])
  return (
    <div>
              <a
            data-tooltip-id="my-tooltip"
            data-tooltip-html={info}
            data-tooltip-place="top"
            >
        <i className="fas fa-info-circle text-blue-500 text-2xl cursor-pointer"></i>
        </a>
      
        <Tooltip id="my-tooltip" multiline={true}/>
    </div>
   
  );
};

export default InfoIconWithTooltip;
