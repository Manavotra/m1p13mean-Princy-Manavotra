module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
daisyui: {
  themes: [
    {
      "malltheme-light": {
        primary: "#000000",
        "primary-content": "#ffffff",
        secondary: "#4ade80",
        "secondary-content": "#052e16",
        accent: "#94a3b8",
        neutral: "#1f2937",
        "base-100": "#f8fafc",
        "base-200": "#f1f5f9",
        "base-300": "#e2e8f0",
        "base-content": "#1e293b",
        info: "#3b82f6",
        success: "#22c55e",
        warning: "#f59e0b",
        error: "#ef4444",
      },
      "malltheme-dark": {
        primary: "#ffffff",
        "primary-content": "#0b1220",
        secondary: "#22c55e",
        "secondary-content": "#052e16",
        accent: "#94a3b8",
        neutral: "#0b1220",
        "base-100": "#0b1220",
        "base-200": "#0f172a",
        "base-300": "#111c33",
        "base-content": "#e2e8f0",
        info: "#60a5fa",
        success: "#22c55e",
        warning: "#fbbf24",
        error: "#f87171",
      },
    },
  ],
}
};