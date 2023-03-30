import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries"

const Books = (props) => {
  const allBooksResult = useQuery(ALL_BOOKS);
  console.log({ allBooksResult });
  
  if (!props.show) {
    return null
  }

  if (!allBooksResult || !allBooksResult.data || !allBooksResult.data.allBooks) {
    return null;
  }

  const books = allBooksResult.data.allBooks;

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
