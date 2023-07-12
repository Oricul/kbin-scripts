# kbin-scripts

This read-me will cover scripts that need additional information ONLY.

# kbin-mod-options

## Description

The purpose of this script is to allow mods to more easily implement settings.

## Patch Notes

### 0.1.0 - Initial Release

### 0.2.0 - Breaking change. By default, settings will be collapsed as a drawer.

#### 0.2.2 - Compatibility fix for KUP (Kbin Usability Pack) 0.2.1+.

#### 0.2.3 - Style changes + animations.

#### 0.2.4 - Bug-fix for Kbin/kbin-core#666.

### 0.3.0 - New feature: Observers!

### 0.4.0 - New feature: Sliders!

## Functionality

### Header

```javascript
kmoAddHeader(<modName>, <{author: 'name', version: 'versionNumber', license: 'licenseType', url: 'modUrl'}>);
```

- modName - required
- info object - optional

#### Example

```javascript
const settingHeader = kmoAddHeader("kbin-mod-options examples", {
  author: "Ori",
  version: "0.1",
  license: "MIT",
  url: "https://github.com/Oricul",
});
```

![Header Example](https://files.catbox.moe/vjknsd.gif)

### Toggle Switch

```javascript
kmoAddToggle(<headerChildDiv>, <settingLabel>, <settingValue>, <settingDescription>);
```

- headerChildDiv - required
- settingLabel - required
- settingValue - required
- settingDescription - optional

#### Example

```javascript
// Create toggle switch
const settingEnabled = kmoAddToggle(
  settingHeader,
  "Enabled",
  true,
  "Turns this mod on or off."
);
// Listen for toggle
settingEnabled.addEventListener("click", () => {
  // Log enabled state to console.
  console.log(kmoGetToggle(settingEnabled));
});
```

![Toggle Switch Example](https://files.catbox.moe/5yxjr0.gif)

### Drop-Down

```javascript
kmoAddDropDown(<headerChildDiv>, <settingLabel>, <[{name: 'friendlyName', value: 'backendValue'},{name: 'friendlyNameTwo', value: 'backendValueTwo'}]>, <currentSetting>, <settingDescription>);
```

- headerChildDiv - required
- settingLabel - required
- options array - required
- name/value in options array - required
- currentSetting - required
- settingDescription - optional

#### Example

```javascript
// Create drop down
const font = kmoAddDropDown(
  settingHeader,
  "Font",
  [
    {
      name: "Arial",
      value: "font-arial",
    },
    {
      name: "Consolas",
      value: "font-consolas",
    },
  ],
  "font-consolas",
  "Choose a font for kbin."
);
// Listen for drop down change
font.addEventListener("change", () => {
  // Log drop down selection to console.
  console.log(kmoGetDropDown(font));
});
```

![Drop-Down Example](https://files.catbox.moe/t6q3dv.gif)

### Button

```javascript
kmoAddButton(<headerChildDiv>, <settingLabel>, <buttonLabel>, <settingDescription>);
```

- headerChildDiv - required
- settingLabel - required
- buttonLabel - required
- settingDescription - optional

#### Example

```javascript
// Create button const
const resetButton = kmoAddButton(
  settingHeader,
  "Default Settings",
  "Reset",
  "Resets settings to defaults."
);
// Listen for button press.
resetButton.addEventListener("click", () => {
  // Log press to console.
  console.log("button pressed!");
});
```

![Button Example](https://files.catbox.moe/tm7m8s.gif)

### Color Dropper

```javascript
kmoAddColorDropper(<headerChildDiv>, <settingLabel>, <currentColor>, <settingDescription>);
```

- headerChildDiv - required
- settingLabel - required
- currentColor - required
- settingDescription - optional

#### Example

```javascript
// Create color dropper const
const primaryColor = kmoAddColorDropper(
  settingHeader,
  "Primary Color",
  "#0ff",
  "Select primary theme color"
);
// Listen for new color change
primaryColor.addEventListener("change", () => {
  // Log color selection out to console.
  console.log(primaryColor.value);
});
```

![Color Dropper Example](https://files.catbox.moe/jcm99i.gif)

### Observer

This is for making infinite scroll support easier for mod creators and not an actual setting module.

```javascript
kmoCreateObserver({<funcToCall: yourFunctionNameHere>[, nodeType: 'id'][, nodeToWatch: 'content'][, watchSubtree: false]});
```

NOTE: You're passing an object here that allows for named arguments. Please review example closely.

- funcToCall - required
- nodeType - optional
- nodeToWatch - optional
- watchSubtree - optional

#### Example

```javascript
// Create observer for main content feed.
const myObserver = kmoCreateObserver({ funcToCall: updateNewContent });
// Example function
function updateNewContent() {
  // Do stuff here
}
// Stop observing, maybe your addon is toggled off?
function shutdown() {
  myObserver.disconnect();
}
```

```javascript
// Maybe you want to watch perry.dev's subscription panel list
const mySubObserver = kmoCreateObserver({
  funcToCall: subUpdate,
  nodeType: "class",
  nodeToWatch: "subscription-list",
});
// Example function
function subUpdate() {
  // Do stuff here
}
// Stop observering - doesn't have to be in a function, but it makes life easier.
function shutdown() {
  mySubObserver.disconnect();
}
```

### Slider

```javascript
kmoAddHeader(<headerChildDiv>, <settingLabel>, <currentValue>, <minValue>, <maxValue>[, <settingDescription>]);
```

- headerChildDiv - required
- settingLabel - required
- currentValue - required
- minValue - required
- maxValue - required
- settingDescription - optional

#### Example

```javascript
// Create slider const
const slider = kmoAddSlider(
  settingHeader,
  "Slider Name",
  5,
  1,
  10,
  "This is an example slider."
);
// Listen for slider to change value.
slider.addEventListener("change", () => {
  // Log new value out to console.
  console.log(slider.value);
});
```

![Slider Example](https://files.catbox.moe/t5nx2x.gif)

## Usage

Simply add kbin-mod-options to your script's requires.

```javascript
// @require    https://github.com/Oricul/kbin-scripts/raw/main/kbin-mod-options.js
```

### Example

```javascript
// ==UserScript==
// @name         kbin-mod-options-dev
// @namespace    https://github.com/Oricul
// @version      0.1
// @description  Attempt at standardizing mod options.
// @author       0rito
// @license      MIT
// @match        https://kbin.social/*
// @match        https://kbin.sh/*
// @icon         https://kbin.social/favicon.svg
// @grant        none
// @require      file://H:/GoogleDrive/Personal/Documents/GitHub/kbin-scripts/kbin-mod-options.js
// ==/UserScript==

(function () {
  "use strict";

  // Section header - kmoAddHeader(<modName>, {author: 'name', version: 'versionNumber', license: 'licenseType', url: 'modUrl'});
  // modName - required, author - optional, version - optional, license - optional, url - optional
  const settingHeader = kmoAddHeader("kbin-mod-options examples", {
    author: "Ori",
    version: "0.1",
    license: "MIT",
    url: "https://github.com/Oricul",
  });
  // Toggle switch - kmoAddToggle(<settingLabel>, <settingValue>, <settingDescription>);
  // settingLabel - required, settingValue - required, settingDescription - optional
  const settingOne = kmoAddToggle(
    settingHeader,
    "Enabled",
    true,
    "Turn this mod on or off."
  );
  // Listener for toggle switch - kmoGetToggle(<toggleSwitchVar>);
  // toggleSwitchVar - required
  settingOne.addEventListener("click", () => {
    console.log(kmoGetToggle(settingOne));
  });
  // Dropdown Menu - kmoAddDropDown(<settingLabel>, [{name: 'name', value: 'value'},{name: 'name2', value: 'value2'}], <currentSetting>, <settingDescription>);
  // settingLabel - required, name & value - required, currentSetting - required, settingDescription - optional
  const settingTwo = kmoAddDropDown(
    settingHeader,
    "Font",
    [
      {
        name: "Arial",
        value: "font-arial",
      },
      {
        name: "Consolas",
        value: "font-consolas",
      },
    ],
    "font-consolas",
    "Choose a site-wide font."
  );
  // Listener for dropdown menu - kmoGetDropDown(<dropDownVar>);
  // dropDownVar - required
  settingTwo.addEventListener("change", () => {
    console.log(kmoGetDropDown(settingTwo));
  });
  // Button - kmoAddButton(<settingLabel>, <buttonLabel>, <settingDescription>);
  // settingLabel - required, buttonLabel - required, settingDescription - optional
  const settingThree = kmoAddButton(
    settingHeader,
    "Default Settings",
    "Reset",
    "Resets settings to defaults."
  );
  // Listener example for buttons.
  settingThree.addEventListener("click", () => {
    console.log("button pressed");
  });
  // Color Dropper - kmoAddColorDropper(<settingLabel>, <currentColor>, <settingDescription>);
  // settingLabel - required, currentColor - required, settingDescription - optional
  const settingFour = kmoAddColorDropper(
    settingHeader,
    "Primary Color",
    "#0ff",
    "Select primary color for style."
  );
  // Listener example for color dropper.
  settingFour.addEventListener("change", () => {
    console.log(settingFour.value);
  });
})();
```
