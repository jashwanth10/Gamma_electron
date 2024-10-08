import './App.css';
import Home from './pages/Home';
import Initial from './pages/Initial';
import Profile from './pages/Profile';
import Validation from './pages/Validation';
import { Provider } from 'react-redux';
import { store } from './store';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PeakAnalysis from './pages/PeakAnalysis';
import Catalogue from './pages/Catalogue';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element = {<Home/>}/>
            <Route path="/initial-calibration" element = {<Initial/>}/>
            <Route path="/profile" element = {<Profile/>}/>
            <Route path="/validation" element={<Validation/>}/>
            <Route path="/peak-analysis" element={<PeakAnalysis/>}/>
            <Route path="/catalogue" element={<Catalogue/>}/>

          </Routes>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
