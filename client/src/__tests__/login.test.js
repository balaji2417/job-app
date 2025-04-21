import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../Login"; // Login component
import { useAuthUser } from "../AuthContext"; // Correct import path for AuthContext

// Mock the AuthContext (no need to mock react-router-dom, it's already mocked)
jest.mock("../AuthContext", () => ({
  useAuthUser: jest.fn(),
}));


// We're using the manual mock for react-router-dom that we created in src/__mocks__
// No need to mock it here again

describe("Login Component", () => {
  const mockRegister = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthUser.mockReturnValue({ register: mockRegister });
    
    // Import the mock directly from the mocked module
    const reactRouterDom = require("react-router-dom");
    reactRouterDom.useNavigate.mockReturnValue(mockNavigate);
  });

  // Helper function to fill out the form
  const fillForm = ({
    firstName = "",
    lastName = "",
    email = "",
    password = "",
    dob = "",
  }) => {
    if (firstName)
      fireEvent.change(screen.getByPlaceholderText("First Name"), {
        target: { value: firstName },
      });
    if (lastName)
      fireEvent.change(screen.getByPlaceholderText("Last Name"), {
        target: { value: lastName },
      });
    if (email)
      fireEvent.change(screen.getByPlaceholderText("Enter your Mail Id"), {
        target: { value: email },
      });
    if (password)
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: password },
      });
    if (dob)
      fireEvent.change(screen.getByPlaceholderText("Enter your DOB"), {
        target: { value: dob },
      });
  };

  test("shows error if fields are empty", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Simulate clicking the "Sign Up" button
    fireEvent.click(screen.getByText("Sign Up"));

    // Wait for the error message to appear
    expect(await screen.findByText("Fill in all fields!")).toBeInTheDocument();
  });

  test("calls register function on form submit", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Fill in the form fields with valid data
    fillForm({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      dob: "1990-01-01",
    });

    // Simulate clicking the "Sign Up" button
    fireEvent.click(screen.getByText("Sign Up"));

    // Wait for the form submission
    await waitFor(() => expect(mockRegister).toHaveBeenCalledTimes(1));

    // Check if navigation was called after registration
    expect(mockNavigate).toHaveBeenCalledWith("/welcome"); // Adjust as per your route
  });
});
