export const THEME_KEY = "theme";

/** Runs in <head> before paint so the saved (or system) theme never flashes. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(!t)t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";if(t==="light")document.documentElement.setAttribute("data-theme","light")}catch(e){}})()`;
