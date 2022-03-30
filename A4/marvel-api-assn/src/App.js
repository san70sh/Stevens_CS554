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
import FourOFour from './components/FourOFour';
const App = () => {
  let element = useRoutes([
    {
      path: '/',
      element: [<Home/>]
    },
    {
      path: 'characters',
      children: [
        {
          exact: true,
          index: true,
          element: [<Navigation/>,<FourOFour/>]
        },
        {
          path: 'page/:page', element: [<Navigation/>,<Characters/>]
        },
        {
          path: ':id',
          element: [<Navigation/>, <Character/>],
          children: [
            {path:'comics', element: [<Navigation/>, <Comics/>]},
            {path:'series', element: [<Navigation/>, <SeriesList/>]}
          ]
        }, {
          path: '*',
          element: [<Navigation/>,<FourOFour/>]
        }
      ]
    },
    {
      path: 'comics',
      children: [
        {
          exact: true,
          index: true,
          element: [<Navigation/>,<FourOFour/>]
        },
        {
          path: 'page/:page',
          element: [<Navigation/>,<Comics/>]
        },
        {
          path: ':id',
          // element: [<Navigation/>, <Comic/>],
          children: [
            {index: true, element: [<Navigation/>, <Comic/>]},
            {path:'characters', element: [<Navigation/>, <Characters/>]},
            {path:'series', element: [<Navigation/>, <SeriesList/>]}
          ]
        }, {
          path: '*',
          element: [<Navigation/>,<FourOFour/>]
        }
      ]
    },
    {
      path: 'series',
      children: [
        {exact: true, index: true, element: [<Navigation/>,<FourOFour/>]},
        {path: 'page/:page', element: [<Navigation/>,<SeriesList/>]},
        {
          path: ':id',
          element: [<Navigation/>, <Series/>],
          children: [
            {path:'comics', element: [<Navigation/>, <Comics/>]},
            {path:'characters', element: [<Navigation/>, <Characters/>]}
          ]
        }
      ]
    },{
      path: '*',
      element: [<Navigation/>,<FourOFour/>]
    },
  ])
  return element;
}
export default App;
