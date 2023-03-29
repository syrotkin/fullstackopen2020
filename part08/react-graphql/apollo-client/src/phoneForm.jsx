import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { EDIT_NUMBER } from "./queries";

const PhoneForm = ({setError}) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const [changeNumber, result] = useMutation(EDIT_NUMBER);

    useEffect(() => {
        console.log({result});
        if(result.data && result.data.editNumber === null) {
            setError("Person " + name + " not found");
        }
    }, [result.data]); // eslint-disable-line

    const submit = (event) => {
        event.preventDefault();

        changeNumber({ variables: { name, phone } });

        setName('');
        setPhone('');
    };

    return (
      <div>
        <h2>change number</h2>

        <form onSubmit={submit}>
          <div>
            Name: <input
              value={name}
              onChange={({ target }) => setName(target.value)}
            />
          </div>
          <div>
            Phone: <input
              value={phone}
              onChange={({ target }) => setPhone(target.value)}
            />
          </div>
          <button type="submit">Change number</button>
        </form>
      </div>
    );
};

export default PhoneForm;