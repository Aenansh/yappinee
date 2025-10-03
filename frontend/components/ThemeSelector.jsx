import { useThemeStore } from "../src/store/useThemeStore";
import { PaletteIcon } from "lucide-react";
import { THEMES } from "../src/constants/index";

const ThemeSelector = () => {
  const { theme: currTheme, setTheme } = useThemeStore();
  return (
    <div className="dropdown dropdown-end">
      <button className="btn btn-ghost btn-circle" tabIndex={0}>
        <PaletteIcon className="size-7" />
      </button>

      <div
        className="dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl w-56 border border-base-content/10 max-h-80 overflow-y-auto"
        tabIndex={0}
      >
        <div className="space-y-4">
          {THEMES.map((theme) => (
            <button
              key={theme.name}
              className={`w-full px-4 py3 rounded-xl flex items-center gap-3 transition-colors ${
                currTheme === theme.name
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-base-content/5"
              }`}
              onClick={() => setTheme(theme.name)}
            >
              <PaletteIcon className="size-4" />
              <span className="text-sm font-medium">{theme.label}</span>

              <div className="ml-auto flex gap-1">
                {theme.colors.map((color, i) => (
                  <span
                    className="size-2 rounded-full"
                    key={i}
                    style={{ backgroundColor: color }}
                  ></span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
