module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FFB343",
        secondary: "#DB9A39",
        accent: "#FFF8E1",
        darkbrown: "#614419",
        success: "#38A169",
        error: "#E53E3E",
        warning: "#D69E2E",
        info: "#3182CE",
      },
      keyframes: {
        "progress-bar": {
          "0%": { width: "100%" },
          "100%": { width: "0%" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "progress-bar": "progress-bar 4s linear forwards",
        "fade-in-up": "fade-in-up 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
