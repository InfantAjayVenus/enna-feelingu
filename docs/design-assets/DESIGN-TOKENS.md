# 🧱 1. Token Philosophy

We’ll structure tokens in 3 layers:

1. **Primitive tokens** → raw values (colors, spacing)
2. **Semantic tokens** → meaning (bg, text, mood)
3. **Component tokens** → optional (buttons, cards)

👉 This keeps your system scalable when you add charts, history, etc.

---

# 📦 2. NativeWind Config (tailwind.config.js)

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,ts,tsx}",
    "./app/**/*.{js,ts,tsx}",
    "./components/**/*.{js,ts,tsx}",
    "./features/**/*.{js,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🎯 BRAND
        primary: {
          DEFAULT: "#4CAF50",
          dark: "#66BB6A",
          deep: "#2E7D32",
        },

        accent: "#FFC107",

        // 🧠 BACKGROUND
        bg: {
          light: "#F7F8FA",
          dark: "#121212",
        },

        surface: {
          light: "#FFFFFF",
          dark: "#1E1E1E",
        },

        // 📝 TEXT
        text: {
          primary: {
            light: "#1C1C1E",
            dark: "#FFFFFF",
          },
          secondary: {
            light: "#6B7280",
            dark: "#A1A1AA",
          },
        },

        // ⚠️ STATES
        border: {
          light: "#E5E7EB",
          dark: "#2A2A2A",
        },

        error: {
          light: "#EF4444",
          dark: "#F87171",
        },

        // 😊 MOOD SCALE
        mood: {
          negative: "#EF4444",
          neutral: "#9CA3AF",
          positive: "#4CAF50",
          positiveLight: "#81C784",
        },

        // 🔁 STATUS
        status: {
          skipped: "#9CA3AF",
          auto: "#F59E0B",
          overridden: "#8B5CF6",
          logged: "#4CAF50",
        },
      },

      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
      },

      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },

      fontSize: {
        xs: ["12px", "16px"],
        sm: ["14px", "20px"],
        base: ["14px", "20px"],
        md: ["16px", "24px"],
        lg: ["18px", "24px"],
        xl: ["20px", "28px"],
      },

      boxShadow: {
        card: "0px 1px 2px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
};
```

---

# 🌗 3. Dark Mode Setup (CRITICAL)

NativeWind uses `class` strategy:

```js
module.exports = {
  darkMode: "class",
};
```

---

### Theme Toggle Hook

```ts
import { useColorScheme } from "react-native";
import { useEffect } from "react";
import { setColorScheme } from "nativewind";

export function useThemeSync() {
  const scheme = useColorScheme();

  useEffect(() => {
    setColorScheme(scheme === "dark" ? "dark" : "light");
  }, [scheme]);
}
```

---

# 🎯 4. Semantic Utility Classes (Reusable Patterns)

Create a helper file:

```ts
// tokens.ts

export const ui = {
  screen: "flex-1 bg-bg-light dark:bg-bg-dark px-md",
  
  card: "bg-surface-light dark:bg-surface-dark rounded-lg p-md shadow-card",

  textPrimary: "text-text-primary-light dark:text-text-primary-dark",
  textSecondary: "text-text-secondary-light dark:text-text-secondary-dark",

  buttonPrimary:
    "bg-primary dark:bg-primary-dark h-12 rounded-md items-center justify-center",

  buttonPrimaryText: "text-white font-semibold text-sm",

  buttonSecondary:
    "bg-gray-100 dark:bg-neutral-800 h-12 rounded-md items-center justify-center",

  input:
    "border border-border-light dark:border-border-dark rounded-md p-sm text-text-primary-light dark:text-text-primary-dark",

  row: "flex-row items-center",
};
```

---

# 😊 5. Mood Token Helpers (IMPORTANT)

You’ll need logic-based tokens:

```ts
export function getMoodColor(score: number) {
  if (score <= 4) return "text-mood-negative";
  if (score === 5) return "text-mood-neutral";
  return "text-mood-positive";
}

export function getMoodBg(score: number) {
  if (score <= 4) return "bg-red-100 dark:bg-red-900";
  if (score === 5) return "bg-gray-100 dark:bg-gray-800";
  return "bg-green-100 dark:bg-green-900";
}
```

---

# 🧩 6. Component-Level Tokens

---

## 🎚 Slider (custom styling wrapper)

```ts
export const sliderStyles = {
  track: "h-1 bg-border-light dark:bg-border-dark rounded-full",
  active: "bg-primary",
  thumb: "w-5 h-5 bg-primary rounded-full",
};
```

---

## 🧾 Card Variants

```ts
export const cardVariants = {
  default: "bg-surface-light dark:bg-surface-dark",
  skipped: "opacity-60",
  auto: "border border-yellow-400",
  overridden: "border border-purple-500",
};
```

---

## 🔘 Button Variants

```ts
export const button = {
  primary:
    "bg-primary dark:bg-primary-dark h-12 rounded-md items-center justify-center",

  secondary:
    "bg-gray-100 dark:bg-neutral-800 h-12 rounded-md items-center justify-center",

  disabled:
    "bg-gray-200 dark:bg-neutral-700 h-12 rounded-md items-center justify-center",
};
```

---

# 📱 7. Example Screen (Check-in)

```tsx
import { View, Text, TextInput, Pressable } from "react-native";
import { ui } from "@/tokens";

export default function CheckInScreen() {
  return (
    <View className={ui.screen}>
      
      <Text className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
        2:00 – 3:00 PM
      </Text>

      <Text className="mt-sm text-text-secondary-light dark:text-text-secondary-dark">
        How are you feeling?
      </Text>

      {/* Emoji */}
      <Text className="text-5xl text-center my-lg">😄</Text>

      {/* Slider placeholder */}
      <View className="h-1 bg-border-light dark:bg-border-dark rounded-full mb-lg" />

      {/* Input */}
      <TextInput
        placeholder="What did you do this hour?"
        className={ui.input}
        multiline
      />

      {/* Buttons */}
      <View className="flex-row gap-md mt-lg">
        <Pressable className="flex-1 bg-gray-100 dark:bg-neutral-800 h-12 rounded-md items-center justify-center">
          <Text>Skip</Text>
        </Pressable>

        <Pressable className="flex-1 bg-primary dark:bg-primary-dark h-12 rounded-md items-center justify-center">
          <Text className="text-white font-semibold">Save</Text>
        </Pressable>
      </View>
    </View>
  );
}
```

---

# ⚡ 8. Motion Tokens (Optional but Powerful)

```ts
export const motion = {
  fast: 150,
  normal: 250,
  slow: 350,
};
```

Use with Reanimated.

---

# 🧠 9. Naming Convention (Important for Scale)

| Type      | Example                   |
| --------- | ------------------------- |
| Color     | `bg-surface-light`        |
| Semantic  | `text-text-primary-light` |
| Component | `buttonPrimary`           |
| State     | `status-skipped`          |

---