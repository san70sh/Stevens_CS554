import React from 'react';
import Characters from './components/Characters';
import Comics from './components/Comics';
import Series from './components/Series';
import Home from './components/Home';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div>
        <header>
          <h1>Marvel API</h1>
          <Link className='showLink' to='/'>Home</Link>
          <Link className='showLink' to='/characters'>Characters</Link>
          <Link className='showLink' to='/comics'>Comics</Link>
          <Link className='showLink' to='/series'>Series</Link>
        </header>
      </div>
      <Routes>
        <Route exact path='/' element={<Home/>}/>
        <Route path='/characters' element={<Characters/>}/>
        <Route path='/comics' element={<Comics/>}/>
        <Route path='/series' element={<Series/>}/>
      </Routes>
    </Router>
  );
};

export default App;
