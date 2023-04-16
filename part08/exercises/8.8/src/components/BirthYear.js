import { useMutation } from "@apollo/client";
import { useState } from "react";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

const BirthYear = () => {
    const [name, setName] = useState('');
    const [year, setYear] = useState(1);

    const [addBirthYear] = useMutation(EDIT_AUTHOR, {
        refetchQueries: [{ query: ALL_AUTHORS }]
      });


      const submit = (event) => {
        event.preventDefault();

        console.log("submitting birth year");
    
        console.log({variables: {name, setBornTo: year}});
        addBirthYear({variables: {name, setBornTo: parseInt(year)}});

        setName('');
        setYear(1);
    };

    return (<div>
        <form onSubmit={submit}>
            <h2>Set Birth Year</h2>
            <div>name: <input type="text" value={name} onChange={({target}) => { setName(target.value) }}></input></div>
            <div>born: <input type="number" value={year} onChange={({target}) => { setYear(target.value) }}></input></div>
            <div><button type="submit">Update Author</button>
            </div>
        </form>
    </div>);
};



export default BirthYear;