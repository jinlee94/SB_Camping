import { RouterProvider } from 'react-router-dom';
import root from './router/root';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


function App() {
  return (
    <RouterProvider router={root}/>
  );
}

export default App;
