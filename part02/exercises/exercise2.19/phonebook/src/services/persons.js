import axios from 'axios';

const baseUrl = 'http://localhost:3001/persons';

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then(response => response.data);
};

const create = (newPerson) => {
    const request = axios.post(baseUrl, newPerson);
    return request.then(response => response.data);
};

const deletePerson = (id) => {
    const request =  axios.delete(`${baseUrl}/${id}`);
    return request.then(response => response.data);
}

const update = (id, personToUpdate) => {
    const request = axios.put(`${baseUrl}/${id}`, personToUpdate);
    return request.then(response => response.data);
};

const actions = {
    getAll,
    create,
    deletePerson,
    update
};

export default actions;