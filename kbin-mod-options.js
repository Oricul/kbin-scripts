/*
    Name:           kbin-mod-options
    Version:        0.4.1
    Description:    Standardize kbin mod options for ease-of-use.
    Author:         0rito
    License:        MIT
*/
const kmoStyles = `
    .switch {
        position: relative;
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
        border-radius: var(--kbin-rounded-edges-radius);
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
        border-radius: var(--kbin-rounded-edges-radius);
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

    .kmo-settings-row.expanded {
        display: block !important;
    }

    .kmo-settings-header {
        border-bottom: var(--kbin-sidebar-header-border);
        color: var(--kbin-sidebar-header-text-color);
        margin-bottom: 0.5em;
    }

    .kmo-settings-row {
        display: none;
        animation: showKmoSettingsRow .25s ease-in-out;
    }

    .kmo-settings-row .row:hover {
        background-color: var(--kbin-button-primary-hover-bg) !important;
    }

    .kmo-settings-row .row {
        max-height: 20px;
    }

    .kmo-settings-row.expanded div.row {
        justify-content: space-between;
        display:flex;
    }

    .kmo-settings-row.expanded .row div {
        color: var(--kbin-meta-text-color);
        display: inline-block;
        margin-bottom: .5rem;
    }

    @keyframes showKmoSettingsRow {
        0% {
            opacity: 0;
            transform: translateY(-1.5em);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .kmo-settings-slider {
        -webkit-appearance: none;
        appearance: none;
        outline: none;
        opacity: 0.7;
        -webkit-transition: .2s;
        transition: opacity .2s;
        height: 8px;
        outline: none;
    }

    .kmo-settings-slider:hover {
        opacity: 1;
        cursor: pointer;
    }

    .kmo-settings-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        height: 10px;
        width: 10px;
    }

    .kmo-settings-slider::-moz-range-thumb {
        appearance: none;
        height: 10px;
        width: 10px;
    }
`
const styleSheet = document.createElement('style');
styleSheet.innerText = kmoStyles;
document.head.appendChild(styleSheet);

const ourSection = document.createElement('div');
ourSection.className = 'kmo-settings-list';
document.querySelector('#settings.section').appendChild(ourSection);
const settingsList = ourSection;

function kmoCreateObserver({funcToCall, nodeType = 'id', nodeToWatch = 'content', watchSubtree = false} = {}) {
    if (typeof funcToCall === 'undefined') {
        throw new Error('kmoCreateObserver - funcToCall is undefined');
    }
    let targetNode;
    if (nodeType === 'id') {
        targetNode = document.getElementById(nodeToWatch);
        if (nodeToWatch === 'content') {
            targetNode = targetNode.children[0];
        }
    } else if (nodeType === 'class') {
        targetNode = document.getElementsByClassName(nodeToWatch);
    } else {
        targetNode = document.querySelectorAll(nodeToWatch);
    }
    let config = { childList: true };
    if (watchSubtree) {
        config.subtree = true;
    }

    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type === 'childList') {
                funcToCall();
            }
        }
    }
    let observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
    return observer;
}

function kmoAddHeader(title, info = {}) {
    if (typeof title === 'undefined') {
        throw new Error('kmoAddHeader - title is undefined')
    }
    const headerDiv = document.createElement('div');
    headerDiv.className = 'kmo-settings-header';
    const headerText = document.createElement('strong');
    headerText.textContent = title;
    if (Object.keys(info).length > 0) {
        const infoIcon = document.createElement('i');
        infoIcon.className = 'fa-solid fa-circle-info';
        let infoIconStyle = 'margin-left: 10px; '
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
    const show_icon = document.createElement('i');
    show_icon.className = 'fa-solid fa-chevron-down';
    show_icon.setAttribute('aria-hidden', 'true');
    show_icon.style = 'float:right; text-align: center; margin-top: 0.2rem; margin-right: 10px; cursor: pointer; color: var(--kbin-meta-text-color);';
    headerText.appendChild(show_icon);
    const childDiv = document.createElement('div');
    childDiv.className = 'kmo-settings-row';
    headerDiv.appendChild(headerText);
    settingsList.appendChild(headerDiv);
    settingsList.appendChild(childDiv);
    show_icon.addEventListener("click", () => {
        kmoToggleSettings(show_icon, childDiv);
    });
    return childDiv;
}

function kmoToggleSettings(toggle, settingDiv) {
    if (typeof toggle === 'undefined') {
        throw new Error('kmoToggleSettings - toggle is undefined');
    }
    if (typeof settingDiv === 'undefined') {
        throw new Error('kmoToggleSettings - settingDiv is undefined');
    }
    toggle.classList.toggle('fa-chevron-up');
    toggle.classList.toggle('fa-chevron-down');
    settingDiv.classList.toggle('expanded');
}

function kmo_createSettingRow(title = '') {
    const settingDiv = document.createElement('div');
    settingDiv.className = 'row';
    settingDiv.style = 'align-items: center; max-height: 20px;';
    if (title.length > 0) {
        settingDiv.title = title;
    }
    return settingDiv;
}

function kmo_createSettingName(name) {
    const settingSpan = document.createElement('span');
    settingSpan.style = 'margin-left: 10px; vertical-align: middle;';
    settingSpan.textContent = name;
    const spanDiv = document.createElement('div');
    spanDiv.appendChild(settingSpan);
    return spanDiv;
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

function kmoAddToggle(settingDiv, settingName, currentValue, description = '') {
    if (typeof settingDiv === 'undefined') {
        throw new Error('kmoAddToggle - settingDiv is undefined');
    }
    if (typeof settingName === 'undefined') {
        throw new Error('kmoAddToggle - settingName is undefined');
    }
    if (typeof currentValue === 'undefined') {
        throw new Error('kmoAddToggle - currentValue is undefined');
    }
    const thisSettingDiv = kmo_createSettingRow(description);
    const settingNameSpan = kmo_createSettingName(settingName);
    thisSettingDiv.appendChild(settingNameSpan);
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
    thisSettingDiv.appendChild(toggleDiv);
    settingDiv.appendChild(thisSettingDiv);
    settingsList.appendChild(settingDiv);
    return toggleInput;
}

function kmoGetToggle(toggle) {
    return toggle.checked;
}

function kmoAddDropDown(settingDiv, settingName, options, currentValue, description = '') {
    if (typeof settingDiv === 'undefined') {
        throw new Error('kmoAddDropDown - settingDiv is undefined');
    }
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
    const thisSettingDiv = kmo_createSettingRow(description);
    const settingSpan = kmo_createSettingName(settingName);
    settingSpan.style.verticalAlign = 'middle';
    const dropDown = document.createElement('select');
    const fixName = settingName.replace(' ', '-');
    dropDown.name = fixName;
    dropDown.className = fixName + '-selector';
    dropDown.style = 'border: none; padding: 0px 10px; border-radius: 5px; vertical-align: middle; display: inline-block;';
    options.forEach(option => {
        const optionEntry = kmo_createDropDownOption(option.name, option.value, ((currentValue === option.value) ? true : false));
        dropDown.appendChild(optionEntry);
    });
    thisSettingDiv.appendChild(settingSpan);
    const dropDownDiv = document.createElement('div');
    dropDownDiv.appendChild(dropDown);
    thisSettingDiv.appendChild(dropDownDiv);
    settingDiv.appendChild(thisSettingDiv);
    settingsList.appendChild(settingDiv);
    return dropDown;
}

function kmoGetDropDown(dropDown) {
    return dropDown.value;
}

function kmoAddButton(settingDiv, settingName, buttonLabel, description = '') {
    if (typeof settingDiv === 'undefined') {
        throw new Error('kmoAddButton - settingDiv is undefined');
    }
    if (typeof settingName === 'undefined') {
        throw new Error('kmoAddButton - settingName is undefined');
    }
    if (typeof buttonLabel === 'undefined') {
        throw new Error('kmoAddButton - buttonLabel is undefined');
    }
    const thisSettingDiv = kmo_createSettingRow(description);
    const settingSpan = kmo_createSettingName(settingName);
    const button = document.createElement('button');
    button.innerHTML = buttonLabel;
    thisSettingDiv.appendChild(settingSpan);
    thisSettingDiv.appendChild(button);
    settingDiv.appendChild(thisSettingDiv);
    settingsList.appendChild(settingDiv);
    return button;
}

function kmoAddColorDropper(settingDiv, settingName, currentColor, description = '') {
    if (typeof settingDiv === 'undefined') {
        throw new Error('kmoAddColorDropper - settingDiv is undefined');
    }
    if (typeof settingName === 'undefined') {
        throw new Error('kmoAddColorDropper - settingName is undefined');
    }
    if (typeof currentColor === 'undefined') {
        throw new Error('kmoAddColorDropper - currentColor is undefined');
    }
    const thisSettingDiv = kmo_createSettingRow(description);
    const settingSpan = kmo_createSettingName(settingName);
    const colorDropper = document.createElement('input');
    colorDropper.style.maxHeight = '20px';
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
    thisSettingDiv.appendChild(settingSpan);
    thisSettingDiv.appendChild(colorDropper);
    settingDiv.appendChild(thisSettingDiv);
    settingsList.appendChild(settingDiv);
    return colorDropper;
}

function kmoAddSlider(settingDiv, settingName, currentValue, minValue, maxValue, description = '') {
    if (typeof settingDiv === 'undefined') {
        throw new Error('kmoAddSlider - settingDiv is undefined');
    }
    if (typeof settingName === 'undefined') {
        throw new Error('kmoAddSlider - settingName is undefined');
    }
    if (typeof currentValue === 'undefined') {
        throw new Error('kmoAddSlider - currentValue is undefined');
    }
    if (typeof minValue === 'undefined') {
        throw new Error('kmoAddSlider - minValue is undefined');
    }
    if (typeof maxValue === 'undefined') {
        throw new Error('kmoAddSlider - maxValue is undefined');
    }
    const thisSettingDiv = kmo_createSettingRow(description);
    const settingSpan = kmo_createSettingName(settingName);
    const sliderDiv = document.createElement('div');
    const slider = document.createElement('input');
    const sliderValue = document.createElement('label');
    const pId = settingName.replace(' ', '') + 'Value';
    sliderValue.style.display = 'inline-block';
    sliderValue.style.verticalAlign = 'middle';
    sliderValue.style.marginRight = '10px';
    sliderValue.id = pId;
    sliderValue.for = pId;
    sliderValue.innerText = currentValue;
    slider.setAttribute('oninput', pId + '.innerText = this.value');
    slider.style.verticalAlign = 'middle';
    slider.className = 'kmo-settings-slider';
    slider.type = 'range';
    slider.min = minValue;
    slider.max = maxValue;
    slider.value = currentValue;
    thisSettingDiv.appendChild(settingSpan);
    sliderDiv.appendChild(sliderValue);
    sliderDiv.appendChild(slider);
    thisSettingDiv.appendChild(sliderDiv);
    settingDiv.appendChild(thisSettingDiv);
    settingsList.appendChild(settingDiv);
    return slider;
}