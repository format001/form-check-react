import {useRef} from 'react';
import FormCheck from './FormCheck';


function App () {

    const formRef = useRef(null);

    const formData = {
        realname: '',
        age: 0,
        gender: 'male',
        occupation: '',
        hobbies: [],
        intro: ''
    }

    const validators = {
        realname: (value) => ({
            reg: value.length >= 2 && value.length <= 10,
            msg: 'Realname: 2-10'
        }),
        age: (value) => ({
            reg: !isNaN(Number(value)) && Number(value) <= 150,
            msg: 'Age: type number and max 150'
        }),
        gender: null,
        occupation: (value) => ({
            reg: value.length > 0,
            msg: 'Occupation: one must be selected'
        }),
        hobbies: (value) => ({
            reg: value.length > 0,
            msg: 'Hobbies: must select one'
        }),
        intro: (value) => ({
            reg: value.length > 10,
            msg: 'Introduction: min 10'
        })
    }

    const {
        realname,
        age,
        gender,
        occupation,
        hobbies,
        intro
    } = FormCheck.create(formRef, '.user-form', {
        formData,
        validators,
        pass (key, value) {
            console.log('Pass', key, value)
        },
        noPass (key, value, msg) {
            console.log('Nopass,', key, value, msg);
        },
        handleSubmit (formData) {
            console.log(formData);
        }
    })

    return (
        <div>
            <div ref={formRef}>
                <p>
                    <input
                        type="text"
                        className="user-form"
                        name="realname"
                        placeholder="Realname"
                        defaultValue={realname.state}
                    />
                </p>
                <p>
                    <input
                        type="number"
                        className="user-form"
                        name="age"
                        placeholder="Age"
                        defaultValue={age.state}
                    />
                </p>
                <p>
                    <input
                        type="radio"
                        className="user-form"
                        name="gender"
                        defaultValue="male"
                    /> Male
                    <input
                        type="radio"
                        className="user-form"
                        name="gender"
                        defaultValue="female"
                        defaultChecked
                    /> Female
                </p>
                <p>
                    <select
                        className="user-form"
                        name="occupation"
                        defaultValue={occupation.state}
                    >
                        <option value="">Please choose ...</option>
                        <option value="teacher">Teacher</option>
                        <option value="police">Police</option>
                    </select>
                </p>
                <p>
                    <input
                        type="checkbox"
                        className="user-form"
                        name="hobbies"
                        defaultValue="music"
                    /> Music
                    <input
                        type="checkbox"
                        className="user-form"
                        name="hobbies"
                        defaultValue="travel"
                    /> Travel
                    <input
                        type="checkbox"
                        className="user-form"
                        name="hobbies"
                        defaultValue="football"
                    /> Football
                </p>
                <p>
          <textarea
              className="user-form"
              name="intro"
              placeholder="Self Introduction"
              defaultValue={intro.state}
          ></textarea>
                </p>
                <p>
                    <button className="user-form">Submit</button>
                </p>
            </div>
        </div>
    )
}

export default App
