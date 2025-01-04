import './App.css';
import Home from './pages/Home';
import Initial from './pages/Initial';
import Profile from './pages/Profile';
import Validation from './pages/Validation';
import { Provider } from 'react-redux';
import { store } from './store';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import PeakAnalysis from './pages/PeakAnalysis';
import Catalogue from './pages/Catalogue';
import Ref from './pages/Ref';
import Analysis from './pages/Analysis';
import Results from './pages/Results';
import Metadata from './pages/metadata';

export default function App() {
  return (
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element = {<Home/>}/>
            <Route path="/initial-calibration" element = {<Initial/>}/>
            <Route path="/profile" element = {<Profile/>}/>
            <Route path="/validation" element={<Validation/>}/>
            <Route path="/peak-analysis" element={<PeakAnalysis/>}/>
            <Route path="/catalogue" element={<Catalogue/>}/>
            <Route path="/ref" element={<Ref/>}/>
            <Route path="/analysis" element={<Analysis/>}/>
            <Route path="/results" element={<Results/>}/>
            <Route path="/metadata" element={<Metadata/>}/>
          </Routes>
        </Router>
      </Provider>
  );
}

