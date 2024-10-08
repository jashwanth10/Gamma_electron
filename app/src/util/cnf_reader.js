// Read UInt8
import { Buffer } from 'buffer';

function uint8At(buffer, pos) {
    return buffer.readUInt8(pos);
  }
  
  // Read UInt16 Little Endian
  function uint16At(buffer, pos) {
    return buffer.readUInt16LE(pos);
  }
  
  // Read UInt32 Little Endian
  function uint32At(buffer, pos) {
    return buffer.readUInt32LE(pos);
  }
  
  // Read UInt64 Little Endian
  function uint64At(buffer, pos, bigNumber = false) {
    const low = buffer.readUInt32LE(pos);
    const high = buffer.readUInt32LE(pos + 4);
    if(bigNumber){
      return BigInt(high) * BigInt(0x100000000) + BigInt(low);
    }
    return high * 0x100000000 + low;
  }
  
  // Read PDP-11 Floating Point Format
  function pdp11FloatAt(buffer, pos) {
    const word1 = buffer.readUInt16LE(pos + 2);
    const word2 = buffer.readUInt16LE(pos);
    const combined = Buffer.alloc(4);
    combined.writeUInt16LE(word1, 0);
    combined.writeUInt16LE(word2, 2);
    return combined.readFloatLE(0) / 4.0;
  }

  function bitwiseNotBigInt(bigIntValue) {
    // Convert BigInt to binary string, removing the '0b' prefix
    const binaryStr = bigIntValue.toString(2);
    
    // Pad the binary string to a multiple of 64 bits (for consistent bit length)
    const paddedLength = Math.ceil(binaryStr.length / 64) * 64;
    const paddedBinaryStr = binaryStr.padStart(paddedLength, '0');

    // Invert bits using a map (0 -> 1 and 1 -> 0)
    const invertedBinaryStr = paddedBinaryStr.split('').map(bit => (bit === '0' ? '1' : '0')).join('');

    // Convert back to BigInt
    return BigInt('0b' + invertedBinaryStr);
  }
  
  // Read Time
  function timeAt(buffer, pos) {
    const timeValue = bitwiseNotBigInt(uint64At(buffer, pos, true));
    return Number(timeValue) * 1e-7;
  }
  
  // Read DateTime
  function datetimeAt(buffer, pos) {
    const timeValue = uint64At(buffer, pos);
    return new Date((timeValue / 10000000 - 3506716800) * 1000);
  }
  
  // Read String
  function stringAt(buffer, pos, length) {
    return buffer.toString('utf8', pos, pos + length).replace(/\0/g, '').trim();
  }

  export function readCnfFile(file, writeOutput = false) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            const buf = Buffer.from(content);
            const readDic = parseCnfContent(buf); // Implement this function based on your parsing logic
            
            if (writeOutput) {
                // Handle writing to file or displaying content if needed
                // For browsers, you might use `Blob` to create downloadable files
                downloadFile('output2.txt', JSON.stringify(readDic, null, 2));
            }
            console.log("File Data: ", readDic);
            const nameWithDate = file.name + " : " + new Date().toISOString();

            resolve({ readDic, nameWithDate });

        };
        reader.onerror = (error) => reject(error);
        
        reader.readAsArrayBuffer(file); // Or use other methods like `readAsText` based on your needs
    });
}

function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function parseCnfContent(buffer) {
    const readData = {};
    let i = 0;
    let offs_param = 0;
  
    while (true) {
      const secHeader = 0x70 + i * 0x30;
      const secIdHeader = uint32At(buffer, secHeader);
  
      if (secIdHeader === 0x00) break;
  
      const secLoc = uint32At(buffer, secHeader + 0x0a);
      switch (secIdHeader) {
        case 0x00012000:
          offs_param = secLoc
          console.log("Hi: ", offs_param);
          Object.assign(readData, getEnergyCalibration(buffer, offs_param));
          Object.assign(readData, getDateTime(buffer, offs_param));
          Object.assign(readData, getShapeCalibration(buffer, offs_param));
          break;
        case 0x00012001:
          const off_str = secLoc;
          Object.assign(readData, getStrings(buffer, off_str));
          break;
        case 0x00012004:
          const offs_mark = secLoc;
          Object.assign(readData, getMarkers(buffer, offs_mark));
          break;
        case 0x00012005:
          const offs_chan = secLoc
          Object.assign(readData, getChannelData(buffer, offs_param, offs_chan));
          break;
        default:
          break;
      }
  
      i += 1;
    }
  
    if (readData['Channels'] && readData['Energy coefficients']) {
      readData['Energy'] = convertChannelsToEnergy(
        readData['Channels'],
        readData['Energy coefficients']
      );
    }
  
    if (
      readData['Channels'] &&
      readData['Left marker'] !== undefined &&
      readData['Right marker'] !== undefined
    ) {
      readData['Counts in markers'] = integrateMarkers(
        readData['Channels data'],
        readData['Left marker'],
        readData['Right marker']
      );
    }
  
    // if (writeOutput) {
    //   const outputFilename = `${filename}.txt`;
    // //   writeToFile(outputFilename, readData);
    // }
  
    return readData;
  }

  function getStrings(buffer, offset) {
    return {
      'Sample name': stringAt(buffer, offset + 0x0030, 0x40),
      'Sample id': stringAt(buffer, offset + 0x0070, 0x10),
      'Sample type': stringAt(buffer, offset + 0x00b0, 0x10),
      'Sample unit': stringAt(buffer, offset + 0x00c4, 0x40),
      'User name': stringAt(buffer, offset + 0x02d6, 0x18),
      'Sample description': stringAt(buffer, offset + 0x036e, 0x100),
    };
  }
  
  function getEnergyCalibration(buffer, offset) {
    const calibOffset = offset + 0x30 + uint16At(buffer, offset + 0x22);
    return {
      'Energy coefficients': [
        pdp11FloatAt(buffer, calibOffset + 0x44),
        pdp11FloatAt(buffer, calibOffset + 0x48),
        pdp11FloatAt(buffer, calibOffset + 0x4c),
        pdp11FloatAt(buffer, calibOffset + 0x50),
      ],
      'Energy unit': stringAt(buffer, calibOffset + 0x5c, 0x11),
      'MCA type': stringAt(buffer, calibOffset + 0x9c, 0x10),
      'Data source': stringAt(buffer, calibOffset + 0x108, 0x10),
    };
  }
  
  function getShapeCalibration(buffer, offset) {
    const calibOffset = offset + 0x30 + uint16At(buffer, offset + 0x22);
    return {
      'Shape coefficients': [
        pdp11FloatAt(buffer, calibOffset + 0xdc),
        pdp11FloatAt(buffer, calibOffset + 0xe0),
        pdp11FloatAt(buffer, calibOffset + 0xe4),
        pdp11FloatAt(buffer, calibOffset + 0xe8),
      ],
    };
  }
  
  function getDateTime(buffer, offset) {
    const timeOffset = offset + 0x30 + uint16At(buffer, offset + 0x24);
    return {
      'Start time': datetimeAt(buffer, timeOffset + 0x01),
      'Real time': timeAt(buffer, timeOffset + 0x09),
      'Live time': timeAt(buffer, timeOffset + 0x11),
    };
  }
  
  function getMarkers(buffer, offset) {
    return {
      'Left marker': uint32At(buffer, offset + 0x007a),
      'Right marker': uint32At(buffer, offset + 0x008a),
    };
  }
  
  function getChannelData(buffer, offset, readData) {
    const nChannels = uint8At(buffer, offset + 0x00ba) * 256;

    const dataOffset = readData + 0x200;
    const channelsData = [];
  
    for (let i = 0; i < nChannels; i++) {
      channelsData.push(buffer.readUInt32LE(dataOffset + i * 4));
    }
  
    return {
      'Number of channels': nChannels,
      'Channels data': channelsData,
      'Channels': Array.from({ length: nChannels }, (_, idx) => idx + 1),
      'Total counts': channelsData.reduce((a, b) => a + b, 0),
      'Measurement mode': stringAt(buffer, offset + 0xb0, 0x03),
    };
  }
  
  function convertChannelsToEnergy(channels, coefficients) {
    return channels.map(
      (ch) =>
        coefficients[0] +
        coefficients[1] * ch +
        coefficients[2] * Math.pow(ch, 2) +
        coefficients[3] * Math.pow(ch, 3)
    );
  }
  
  function integrateMarkers(channelsData, leftMarker, rightMarker) {
    const slice = channelsData.slice(leftMarker - 1, rightMarker);
    return slice.reduce((a, b) => a + b, 0);
  }

//   function writeToFile(filename, data) {
//     const lines = [];
//     lines.push(`#`);
//     lines.push(`# Sample name: ${data['Sample name']}`);
//     lines.push(`#`);
//     lines.push(`# Sample id: ${data['Sample id']}`);
//     lines.push(`# Sample type: ${data['Sample type']}`);
//     lines.push(`# User name: ${data['User name']}`);
//     lines.push(`# Sample description: ${data['Sample description']}`);
//     lines.push(`#`);
//     lines.push(`# Start time: ${data['Start time']}`);
//     lines.push(`# Real time (s): ${data['Real time'].toFixed(3)}`);
//     lines.push(`# Live time (s): ${data['Live time'].toFixed(3)}`);
//     lines.push(`#`);
//     lines.push(`# Total counts: ${data['Total counts']}`);
//     lines.push(`#`);
//     lines.push(`# Left marker: ${data['Left marker']}`);
//     lines.push(`# Right marker: ${data['Right marker']}`);
//     lines.push(`# Counts in markers: ${data['Counts in markers']}`);
//     lines.push(`#`);
//     lines.push(`# Energy calibration coefficients (E = sum(Ai * n**i))`);
//     data['Energy coefficients'].forEach((coef, idx) => {
//       lines.push(`#    A${idx} = ${coef.toExponential(6)}`);
//     });
//     lines.push(`# Energy unit: ${data['Energy unit']}`);
//     lines.push(`#`);
//     lines.push(
//       `# Shape calibration coefficients (FWHM = B0 + B1*E^(1/2)  Low Tail= B2 + B3*E)`
//     );
//     data['Shape coefficients'].forEach((coef, idx) => {
//       lines.push(`#    B${idx} = ${coef.toExponential(6)}`);
//     });
//     lines.push(`#`);
//     lines.push(`# Channel data`);
//     lines.push(
//       `#     n     energy(${data['Energy unit']})     counts     rate(1/s)`
//     );
//     lines.push(`#--------------------------------------------------`);
  
//     data['Channels'].forEach((channel, idx) => {
//       const energy = data['Energy'][idx];
//       const counts = data['Channels data'][idx];
//       const rate = counts / data['Live time'];
//       lines.push(
//         `${channel.toString().padStart(4)}\t${energy.toExponential(
//           3
//         )}\t${counts}\t${rate.toExponential(3)}`
//       );
//     });
  
//     fs.writeFileSync(filename, lines.join('\n'));
//   }
  
  