import { HopeProvider } from '@hope-ui/solid'
import Home from './containers/Home'
import "./App.css";

function App() {
  return (
    <HopeProvider>
      <Home />
    </HopeProvider>
  );
}

export default App;
