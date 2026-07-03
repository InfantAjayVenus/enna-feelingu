
# 🧾 enna-feelingu — Android UI Design System (v1)

---

## 🎯 1. Design Principles

**Primary goals (derived from PRD):**

* ⚡ Fast (<30 sec interaction)
* 👆 Thumb-first ergonomics
* 😊 Emotion-first UI (emoji-led)
* 🧘 Calm + minimal (low cognitive load)
* 🇮🇳 Subtle Tamil-local identity (not loud branding)

---

## 🎨 2. Color System

### 🌞 Light Theme

| Role            | Color      | Hex       |
| --------------- | ---------- | --------- |
| Background      | Soft White | `#F7F8FA` |
| Surface         | Pure White | `#FFFFFF` |
| Primary         | Calm Green | `#4CAF50` |
| Primary Variant | Deep Green | `#2E7D32` |
| Accent          | Soft Amber | `#FFC107` |
| Text Primary    | Near Black | `#1C1C1E` |
| Text Secondary  | Grey       | `#6B7280` |
| Border          | Light Grey | `#E5E7EB` |
| Error           | Soft Red   | `#EF4444` |

---

### 🌚 Dark Theme

| Role            | Color      | Hex       |
| --------------- | ---------- | --------- |
| Background      | Dark Base  | `#121212` |
| Surface         | Card Dark  | `#1E1E1E` |
| Primary         | Soft Green | `#66BB6A` |
| Primary Variant | Green Glow | `#81C784` |
| Text Primary    | White      | `#FFFFFF` |
| Text Secondary  | Grey       | `#A1A1AA` |
| Border          | Dark Grey  | `#2A2A2A` |
| Error           | Soft Red   | `#F87171` |

---

### 😊 Mood Color Mapping

| Range | Meaning  | Color                                  |
| ----- | -------- | -------------------------------------- |
| 1–4   | Negative | `#EF4444` (Red)                        |
| 5     | Neutral  | `#9CA3AF` (Grey)                       |
| 6–10  | Positive | `#4CAF50` → `#81C784` (Green gradient) |

---

## 🔤 3. Typography

### Font Family

* **Primary**: `Inter` (Expo-friendly, modern)
* Fallback: System font (Roboto on Android)

---

### Type Scale

| Usage             | Size | Weight | Line Height |
| ----------------- | ---- | ------ | ----------- |
| Screen Title      | 20sp | 600    | 28          |
| Section Header    | 16sp | 600    | 24          |
| Body              | 14sp | 400    | 20          |
| Caption           | 12sp | 400    | 16          |
| Button            | 14sp | 600    | 20          |
| Large Emoji Label | 18sp | 500    | 24          |

---

## 📏 4. Spacing System (8pt Grid)

| Token | Value |
| ----- | ----- |
| xs    | 4dp   |
| sm    | 8dp   |
| md    | 16dp  |
| lg    | 24dp  |
| xl    | 32dp  |

---

### Layout Rules

* Screen padding: **16dp horizontal**
* Section spacing: **24dp**
* Card padding: **16dp**
* Button height: **48dp**

---

## 🔲 5. Component System

---

### 🎚 5.1 Mood Slider (Primary Component)

#### Structure

* Range: **1 → 10 (step = 1)**
* Track height: `4dp`
* Thumb size: `20dp`
* Active color: `#4CAF50`
* Inactive track: `#E5E7EB`

#### Emoji Display

* Size: `48dp`
* Position: Above slider
* Dynamic mapping:

  * 1–2 😡
  * 3–4 😞
  * 5 😐
  * 6–7 🙂
  * 8–10 😄

---

### 📝 5.2 Text Input

| Property      | Value         |
| ------------- | ------------- |
| Height        | 80–100dp      |
| Border Radius | 12dp          |
| Border        | 1dp `#E5E7EB` |
| Padding       | 12dp          |
| Placeholder   | Grey          |

---

### 🔘 5.3 Buttons

#### Primary Button

* Height: `48dp`
* Radius: `12dp`
* Background: `#4CAF50`
* Text: White
* Elevation: 2

#### Secondary Button

* Background: `#F3F4F6`
* Text: `#1C1C1E`

#### Disabled

* Background: `#E5E7EB`
* Text: `#9CA3AF`

---

### 🧾 5.4 Cards

| Property   | Value              |
| ---------- | ------------------ |
| Background | Surface            |
| Radius     | 16dp               |
| Padding    | 16dp               |
| Elevation  | 1–2                |
| Border     | optional `#E5E7EB` |

---

### 📊 5.5 Chart

* Line color: `#4CAF50`
* Stroke width: `3dp`
* Dot size: `6dp`
* Grid: subtle (`#E5E7EB`)
* Axis labels: 12sp

---

### 🏷 5.6 Status Indicators

| State        | Icon | Style            |
| ------------ | ---- | ---------------- |
| Logged       | ✔    | Green            |
| Skipped      | ⏭    | Grey             |
| Auto-skipped | ⚡    | Yellow           |
| Overridden   | 🔁   | Purple `#8B5CF6` |

---

## 📱 6. Screen Specifications

---

### 🟢 6.1 Check-In Screen

#### Layout

```
[Header]
Time Range (14sp)
Prompt

[Emoji Display]

[Slider]

[Text Input]

[Buttons: Skip | Save]
```

#### Key Rules

* No scroll unless keyboard opens
* Save disabled until mood selected
* Instant feedback via Snackbar

---

### 🔔 6.2 Notification

* Title: 16sp bold
* Body: 14sp
* Actions:

  * Quick
  * Skip
  * Open

---

### ⏭ 6.3 Skip Screen

* Center illustration (emoji faded)
* Message centered
* CTA button full-width

---

### 🔁 6.4 Override Bottom Sheet

* Height: ~40% screen
* Rounded top: 24dp
* Actions stacked:

  * Primary (Apply)
  * Secondary (Keep)

---

### 📅 6.5 Retroactive Logging

#### Timeline List

* Row height: `56dp`
* Left: Time
* Right: Status + chevron

---

### 📜 6.6 History List

#### Item Layout

```
[Emoji] [Mood Score]
[Time]
[Activity Text]
[Status Badge]
```

* Spacing: 12dp vertical
* Card-based

---

### 📊 6.7 Chart View

* Toggle: List | Chart
* Chart height: 220dp
* Summary stats below

---

### ⚙️ 6.8 Settings

* Time picker (native)
* Hour grid:

  * Chip size: 40dp
  * Selected: green fill
  * Unselected: outline

---

### 📤 6.9 Export

* Bottom sheet
* Radio buttons for format
* List for time range

---

### ✅ 6.10 Export Success

* Large check icon: 64dp
* Message centered
* CTA: Share/Open

---

## 🎛 7. Iconography

* Use: **Material Icons (Expo vector-icons)**
* Style: outlined/minimal
* Size:

  * Small: 16dp
  * Default: 24dp

---

## 🌗 8. Dark Mode Rules

* No pure black overlays on surfaces
* Increase contrast for text
* Reduce elevation shadows
* Use lighter green (`#66BB6A`)

---

## ⚡ 9. Motion & Feedback

| Interaction  | Animation      |
| ------------ | -------------- |
| Slider move  | Smooth (150ms) |
| Save         | Snackbar fade  |
| Navigation   | Slide          |
| Button press | Scale 0.96     |

---

## 🧱 10. Expo Implementation Notes

#### Libraries

* `react-native-reanimated` → animations
* `react-native-gesture-handler` → slider
* `expo-haptics` → feedback
* `react-native-svg` → chart

---

#### Theme Object Example

```ts
export const theme = {
  light: {
    bg: "#F7F8FA",
    surface: "#FFFFFF",
    primary: "#4CAF50",
    text: "#1C1C1E",
  },
  dark: {
    bg: "#121212",
    surface: "#1E1E1E",
    primary: "#66BB6A",
    text: "#FFFFFF",
  }
}
```

---

## 🧩 11. Accessibility

* Touch targets ≥ 48dp
* Contrast ≥ WCAG AA
* Emoji + number (not emoji-only)
* Haptic feedback on selection

---

## 📦 12. Asset Requirements

* No custom illustrations required (v1)
* Use:

  * Native emojis
  * Material icons

---
