import './App.css';
import React from 'react';
import Characters from './components/Characters';
import Character from './components/Character';
import Comics from './components/Comics';
import Comic from './components/Comic';
import Home from './components/Home';
import SeriesList from './components/SeriesList';
import Series from './components/Series';
import Navigation from './components/Navigation';
import { useRoutes } from 'react-router-dom';
const App = () => {
  let element = useRoutes([
    {
      path: '/',
      element: [<Navigation />,<Home/>]
    },
    {
      path: 'characters',
      // element: [<Navigation/>,<Characters/>],
      children: [
        {path: 'page/:page', element: [<Navigation/>,<Characters/>]},
        {path: ':id', element: [<Navigation/>, <Character/>]}
      ]
    },
    {
      path: 'comics',
      // element: [<Navigation/>,<Comics/>]
      children: [
        {path: 'page/:page', element: [<Navigation/>,<Comics/>]},
        {path: ':id', element: [<Navigation/>, <Comic/>]}
      ]
    },
    {
      path: 'series',
      // element: [<Navigation/>,<SeriesList/>]
      children: [
        {path: 'page/:page', element: [<Navigation/>,<SeriesList/>]},
        {path: ':id', element: [<Navigation/>, <Series/>]}
      ]
    }
  ])
  return element;
}
export default App;
