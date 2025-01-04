const { default: daisyui } = require('daisyui');

module.exports = {
    theme: {
      extend: {},
    },
    content: [
      './src/renderer/components/*.{js,jsx,ts,tsx}', // Ensure all files that use Tailwind CSS are included
      './src/renderer/pages/*.{js,jsx,ts,tsx}', // Ensure all files that use Tailwind CSS are included
      './src/renderer/*.{js,jsx,ts,tsx}', // Ensure all files that use Tailwind CSS are included
    
    ],
    plugins: [require('daisyui')],
    daisyui: {
      themes: ["light"],
    }
  };