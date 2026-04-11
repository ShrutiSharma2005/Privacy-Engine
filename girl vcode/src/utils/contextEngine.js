export const getContext = () => {
  const hour = new Date().getHours();
  let timeOfDay = 'Night';
  if (hour >= 5 && hour < 12) timeOfDay = 'Morning';
  else if (hour >= 12 && hour < 17) timeOfDay = 'Afternoon';
  else if (hour >= 17 && hour < 21) timeOfDay = 'Evening';

  return { timeOfDay, hour };
};

export const initThemeContext = () => {
  // Simple check for system dark mode
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const applyTheme = (theme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (theme === 'light') {
    document.documentElement.classList.remove('dark');
  }
};
