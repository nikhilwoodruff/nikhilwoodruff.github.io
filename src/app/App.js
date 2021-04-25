import logo from '../images/logo.svg';
import '../css/App.css';
import { Container, Row, Col } from 'react-bootstrap';
import Notebook from './nbviewer';
import { Blog } from '../app/blog';

function App() {
  return (
    <Blog />
  );
}

export default App;
