import {useEffect, useState} from "react";

const EVENT_MAP = {
    'text': 'input',
    'number': 'input',
    'textarea': 'input',
    'radio': 'click',
    'checkbox': 'click',
    'select-one': 'change',
    'submit': 'click'
}

export default class FormCheck {
    constructor (formRef, elClass, {
        formData,
        validators,
        pass,
        noPass,
        handleSubmit
    }) {
        this.formData = formData;
        this.formRef = formRef;
        this.elClass = elClass;
        this.validators = validators;
        this.pass = pass;
        this.noPass = noPass;
        this.handleSubmit = handleSubmit;
        this.result = {};

        FormCheck.stateMap = FormCheck.createStateMap(this.formData);

        this.addResult(this.formData);
        useEffect(() => {
            this.bindEvent();
        }, []);
    }

    bindEvent () {
        const oFormElements = this.formRef.current.querySelectorAll(this.elClass);

        oFormElements.forEach(el => {
            const {type} = el;
            el.addEventListener(EVENT_MAP[type], this.setValue.bind(this, el), false);
        })
    }

    async setValue (el) {
        const {type, name: key, value} = el;

        if (type === 'submit') {
            this.handleSubmitClick();
            return;
        }

        const {state, setState} = FormCheck.stateMap[key];
        let _value;

        await setState(arr => {
            if (type === 'checkbox') {
                _value = state.includes(value) ? arr.filter(item => item !== value)
                    : [...arr, value];
            } else {
                _value = value;
            }

            return _value;
        });
        this.validate(key, _value);
    }

    validate (key, value) {
        const keyValidator = this.validators[key];
        if (keyValidator) {
            const {reg, msg} = keyValidator(value);

            if (!reg) {
                this.setResult(key, false);
                this.noPass(key, value, msg);
                return;
            }

            this.setResult(key, true);
            this.pass(key, value);
        }
    }


    handleSubmitClick () {
        const falseIndex = Object.values(this.result).findIndex(item => !item);

        if (falseIndex !== -1) {
            const falseKey = Object.keys(this.result)[falseIndex];
            const {msg} = this.validators[falseKey](FormCheck.stateMap[falseKey].state);
            this.noPass(falseKey, FormCheck.stateMap[falseKey].state, msg);
            return;
        }

        this.handleSubmit(FormCheck.exportState(FormCheck.stateMap));
    }

    static exportState (data) {
        let result = {};

        for (let key in data) {
            result[key] = data[key].state;
        }

        return result;
    }

    static createStateMap (formData) {
        const stateMap = {};
        for (let key in formData) {
            const [state, setState] = useState(formData[key]);
            stateMap[key] = {
                state,
                setState
            };
        }

        return stateMap;
    }

    addResult (data) {
        for (let key in data) {
            if (this.validators[key]) {
                this.result[key] = false;
            }
        }
    }

    setResult (key, bool) {
        this.result[key] = bool;
    }

    static create (formRef, elClass, {
        formData,
        validators,
        pass,
        noPass,
        handleSubmit
    }) {
        new FormCheck(formRef, elClass, {
            formData,
            validators,
            pass,
            noPass,
            handleSubmit
        });

        return FormCheck.stateMap;
    }
}