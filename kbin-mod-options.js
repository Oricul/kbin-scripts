/*
    Name:           kbin-mod-options
    Version:        0.1
    Description:    Attempt at standardizing mod options.
    Author:         0rito
    License:        MIT
*/
const styles = `
    .switch {
        position: relative;
        //display: inline-block;
        display: block;
        width: 36px;
        height: 24px;
    }

    .switch input {
        display: none;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--kbin-bg);
        --webkit-transition: .4s;
        transition: .4s;
    }

    .slider:before {
        position: absolute;
        content: '';
        height: 12px;
        width: 12px;
        left: 2px;
        top: 2px;
        background-color: var(--kbin-meta-text-color);
        --webkit-transition: .4s;
        transition: .4s;
    }

    input:checked + .slider {
        background-color: var(--kbin-success-color);
    }

    input:focus + .slider {
        box-shadow: 0 0 1px var(--kbin-success-color);
    }

    input:checked + .slider:before {
        --webkit-transform: translateX(20px);
        --ms-transform: translateX(20px);
        transform: translateX(20px);
    }
`
const styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const settingsList = document.querySelector(".settings-list");

function kmoAddHeader(title, info = {}) {
    if (typeof title === 'undefined') {
        throw new Error('kmoAddHeader - title is undefined')
    }
    const headerText = document.createElement('strong');
    headerText.textContent = title;
    if (Object.keys(info).length > 0) {
        const infoIcon = document.createElement('i');
        infoIcon.className = 'fa-solid fa-circle-info';
        infoIconStyle = 'margin-left: 10px; '
        if (typeof info.color !== 'undefined') {
            infoIconStyle += "color: " + info.color + "; ";
        } else {
            infoIconStyle += "color var(--kbin-meta-text-color); ";
        }
        infoIcon.style = infoIconStyle;
        let infoIconTextContent = '';
        if (typeof info.author !== 'undefined') {
            infoIconTextContent += "Author: " + info.author + "\n";
        }
        if (typeof info.version !== 'undefined') {
            infoIconTextContent += "Version: " + info.version + "\n";
        }
        if (typeof info.license !== 'undefined') {
            infoIconTextContent += "License: " + info.license + "\n";
        }
        if (typeof info.url !== 'undefined') {
            infoIconTextContent += "Website: " + info.url;
        }
        infoIcon.title = infoIconTextContent;
        headerText.appendChild(infoIcon);
    }
    settingsList.appendChild(headerText);
}

function kmo_createSettingRow(title = '') {
    const settingDiv = document.createElement('div');
    settingDiv.className = 'row';
    settingDiv.style = 'align-items: center;';
    if (title.length > 0) {
        settingDiv.title = title;
    }
    return settingDiv;
}

function kmo_createSettingName(name) {
    const settingSpan = document.createElement('span');
    settingSpan.style = 'margin-left: 10px;';
    settingSpan.textContent = name;
    return settingSpan;
}

function kmo_createDropDownOption(name, value, selected = false) {
    const option = document.createElement('option');
    option.innerHTML = name;
    option.label = name;
    option.value = value;
    if (selected === true) {
        option.selected = true;
    }
    return option;
}

function kmoAddToggle(settingName, currentValue, description = '') {
    if (typeof settingName === 'undefined') {
        throw new Error('kmoAddToggle - settingName is undefined');
    }
    if (typeof currentValue === 'undefined') {
        throw new Error('kmoAddToggle - currentValue is undefined');
    }
    const settingDiv = kmo_createSettingRow(description);
    const settingNameSpan = kmo_createSettingName(settingName);
    settingDiv.appendChild(settingNameSpan);
    const toggleDiv = document.createElement('div');
    toggleDiv.style = 'height: 10px;';
    const toggleLabel = document.createElement('label');
    toggleLabel.className = 'switch';
    const toggleInput = document.createElement('input');
    toggleInput.type = 'checkbox';
    if (currentValue === true) {
        toggleInput.checked = true;
    }
    const sliderDiv = document.createElement('div');
    sliderDiv.className = 'slider';
    toggleLabel.appendChild(toggleInput);
    toggleLabel.appendChild(sliderDiv);
    toggleDiv.appendChild(toggleLabel);
    settingDiv.appendChild(toggleDiv);
    settingsList.appendChild(settingDiv);
    return toggleInput;
}

function kmoGetToggle(toggle) {
    return toggle.checked;
}

function kmoAddDropDown(settingName, options, currentValue, description = '') {
    if (typeof settingName === 'undefined') {
        throw new Error('kmoAddDropDown - settingName is undefined');
    }
    if (typeof options === 'undefined') {
        throw new Error('kmoAddDropDown - options are undefined');
    }
    if (typeof currentValue === 'undefined') {
        throw new Error('kmoAddDropDown - currentValue is undefined');
    }
    if (typeof options !== 'object') {
        throw new Error('kmoAddDropDown - options are not an object');
    }
    const settingDiv = kmo_createSettingRow(description);
    const settingSpan = kmo_createSettingName(settingName);
    const dropDown = document.createElement('select');
    const fixName = settingName.replace(' ', '-');
    dropDown.name = fixName;
    dropDown.className = fixName + '-selector';
    dropDown.style = 'border: none; padding: 0px 10px; border-radius: 5px;';
    options.forEach(option => {
        const optionEntry = kmo_createDropDownOption(option.name, option.value, ((currentValue === option.value) ? true : false));
        dropDown.appendChild(optionEntry);
    });
    settingDiv.appendChild(settingSpan);
    settingDiv.appendChild(dropDown);
    settingsList.appendChild(settingDiv);
    return dropDown;
}

function kmoGetDropDown(dropDown) {
    return dropDown.value;
}

function kmoAddButton(settingName, buttonLabel, description = '') {
    if (typeof settingName === 'undefined') {
        throw new Error('kmoAddButton - settingName is undefined');
    }
    if (typeof buttonLabel === 'undefined') {
        throw new Error('kmoAddButton - buttonLabel is undefined');
    }
    const settingDiv = kmo_createSettingRow(description);
    const settingSpan = kmo_createSettingName(settingName);
    const button = document.createElement('button');
    button.innerHTML = buttonLabel;
    settingDiv.appendChild(settingSpan);
    settingDiv.appendChild(button);
    settingsList.appendChild(settingDiv);
    return button;
}

function kmoAddColorDropper(settingName, currentColor, description = '') {
    if (typeof settingName === 'undefined') {
        throw new Error('kmoAddColorDropper - settingName is undefined');
    }
    if (typeof currentColor === 'undefined') {
        throw new Error('kmoAddColorDropper - currentColor is undefined');
    }
    const settingDiv = kmo_createSettingRow(description);
    const settingSpan = kmo_createSettingName(settingName);
    const colorDropper = document.createElement('input');
    colorDropper.type = 'color';
    if (currentColor.length === 4) {
        let fixedCurrentColor = '';
        const charArray = [...currentColor];
        charArray.forEach(char => {
            if (char === '#') {
                fixedCurrentColor += '#';
            } else {
                fixedCurrentColor += char + char;
            }
        });
        currentColor = fixedCurrentColor;
    }
    colorDropper.value = currentColor;
    settingDiv.appendChild(settingSpan);
    settingDiv.appendChild(colorDropper);
    settingsList.appendChild(settingDiv);
    return colorDropper;
}