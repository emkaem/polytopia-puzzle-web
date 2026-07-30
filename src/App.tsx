import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { PuzzlesPage } from './pages/PuzzlesPage'
import './index.css'

function Nav() {
  return (
    <nav className="site-nav">
      <div className="site-nav__inner">
        <NavLink to="/" className="site-nav__logo">
          Polytopia<span>Fan</span>
        </NavLink>
        <ul className="site-nav__links">
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/puzzles" className={({ isActive }) => isActive ? 'active' : ''}>
              Puzzles
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      Fan website — not officially affiliated with Midjiwan AB or The Battle of Polytopia.
    </footer>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/puzzles" element={<PuzzlesPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
