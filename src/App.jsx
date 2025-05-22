import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Discover from './components/Discover/Discover';
import Search from './components/Search/Search';
import Services from './components/Services/Services';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/discover' element={<Discover />} />
        <Route path='/search' element={<Search />} />
        <Route path='/services' element={<Services />} />
      </Routes>
    </div>
  );
}

export default App;
