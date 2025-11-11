module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        gold: '#BFA14A',
        offwhite: '#F8F5F0',
        deepblack: '#111111',
        burgundy: '#6B0B1A',
        royal: '#4B0F5D'
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['Poppins', 'sans-serif']
      },
      backgroundImage: {
        // Use an asset served from /public to ensure production availability
        'phulkari-pattern': "url('/phulkari-pattern.svg')"
      }
    }
  },
  plugins: []
}
