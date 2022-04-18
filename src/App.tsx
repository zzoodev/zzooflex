import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Tv from "./Routes/Tv";
import Search from "./Routes/Search";
import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path={`${process.env.PUBLIC_URL}/tv*`} element={<Tv />} />
        <Route
          path={`${process.env.PUBLIC_URL}/search*`}
          element={<Search />}
        />
        <Route path={`${process.env.PUBLIC_URL}/*`} element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
