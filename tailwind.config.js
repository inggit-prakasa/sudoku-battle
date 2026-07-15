/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35', // Orange primary accent
          hover: '#E5502A',   // Darker orange for hover/active state
          light: '#FFF0EB',  // Light orange/peach tint
        },
        background: '#F5F5F0', // Neubrutalist warm grey/ivory
        card: '#ffffff',       // White card background
        main: '#111111',       // Solid black text/theme color
        border: '#111111',     // Solid black borders
        neutralBorder: '#D4D4D4', // Neutral grey border for inputs
        muted: '#5F5E5A',      // Neutral gray for secondary text/labels
        accent: {
          light: '#F5F5F0',   // Given cell background (neutral light grey)
          select: '#FFE6DC',  // Selected cell background (soft orange/peach)
          highlight: '#FAFAFA', // Row/col highlight background
          error: '#FEE2E2',   // Error cell background (pale red)
          errorText: '#EF4444' // Red color for error text
        }
      },
      borderWidth: {
        3: '3px',
      },
      boxShadow: {
        'flat-lg': '8px 8px 0px 0px #111111',
        flat: '4px 4px 0px 0px #111111',
        'flat-orange': '4px 4px 0px 0px #FF6B35',
        'flat-sm': '3px 3px 0px 0px #111111',
      }
    },
  },
  plugins: [],
}
