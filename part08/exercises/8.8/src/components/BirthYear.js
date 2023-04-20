import { useMutation } from "@apollo/client";
import { useState } from "react";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";
import Select from 'react-select';

const BirthYear = ({authorNames}) => {
    const [name, setName] = useState('');
    const [year, setYear] = useState(1);

    const [selectedOption, setSelectedOption] = useState(null);

    const [addBirthYear] = useMutation(EDIT_AUTHOR, {
        refetchQueries: [{ query: ALL_AUTHORS }]
      });


      const submit = (event) => {
        event.preventDefault();
        addBirthYear({variables: {name, setBornTo: parseInt(year)}});

        setYear(1);
    };

    const options = authorNames.map(name => ({value: name, label: name}));
  

    return (<div>
        <form onSubmit={submit}>
            <h2>Set Birth Year</h2>
            <div>name: 
                <Select
                    key={selectedOption?.value + ''}
                    defaultValue={selectedOption}
                    options={options}
                    onChange={(event) => {
                        if (event.value && event.value.length !== 0) {
                            setName(event.value)
                        }
                    }} />
            </div>
            <div>born: <input type="number" value={year} onChange={(event) => { setYear(event.target.value) }}></input></div>
            <div><button type="submit">Update Author</button>
            </div>
        </form>
    </div>);
};



export default BirthYear;