const localStorageTheme = localStorage.getItem("theme");
if (localStorageTheme)
  document.documentElement.dataset.theme = localStorageTheme;
else {
  const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");
  document.documentElement.dataset.theme = systemSettingDark.matches
    ? "dark"
    : "light";
}

const themeToggle = document.querySelector("[data-theme-toggle]");
themeToggle.addEventListener("click", () => {
  const newTheme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";

  const newCta =
    newTheme === "dark" ? "Change to light theme" : "Change to dark theme";
  themeToggle.setAttribute("aria-label", newCta);
  themeToggle.setAttribute("title", newCta);

  document.documentElement.dataset.theme = newTheme;

  localStorage.setItem("theme", newTheme);
});
