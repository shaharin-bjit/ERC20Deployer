import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DeployPage from './pages/DeployPage';
import TokensPage from './pages/TokensPage';
import { Web3Provider } from './context/Web3Context';

function App() {
  return (
    <Web3Provider>
      <Layout>
        <Routes>
          <Route path="/" element={<DeployPage />} />
          <Route path="/tokens" element={<TokensPage />} />
        </Routes>
      </Layout>
    </Web3Provider>
  );
}

export default App;