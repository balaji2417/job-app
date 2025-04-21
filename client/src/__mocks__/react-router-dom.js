const mockUseNavigate = jest.fn();

module.exports = {
  MemoryRouter: ({ children }) => children,
  useNavigate: () => mockUseNavigate,
  useLocation: () => ({ pathname: "/" }),
  useParams: () => ({}),
  Link: ({ children }) => children,
  Navigate: () => null,
  Outlet: () => null,
  Routes: ({ children }) => children,
  Route: () => null,
};