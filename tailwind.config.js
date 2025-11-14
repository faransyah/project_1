/** @type {import('tailwindcss').Config} */
export default {
  // Bagian ini adalah yang paling penting
  content: [
    "./index.html", // Memindai file HTML utama
    "./src/**/*.{vue,js,ts,jsx,tsx}", // Memindai semua file .vue dan .js/ts di dalam folder src
  ],
  theme: {
    extend: {
      // Anda bisa menambahkan kustomisasi font di sini jika mau
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}