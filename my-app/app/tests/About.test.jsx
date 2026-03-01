import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AboutPage from "../about/page";

describe("AboutPage Component", () => {

  test("renders hero heading", () => {
    render(<AboutPage />);
    
    const heading = screen.getByText(/MEETS INTELLIGENCE/i);
    expect(heading).toBeInTheDocument();
  });

  test("renders mission section", () => {
    render(<AboutPage />);
    
    const mission = screen.getByText(/OUR MISSION/i);
    expect(mission).toBeInTheDocument();
  });

  test("renders vision section", () => {
    render(<AboutPage />);
    
    const vision = screen.getByText(/OUR VISION/i);
    expect(vision).toBeInTheDocument();
  });

  test("renders core values title", () => {
    render(<AboutPage />);
    
    const coreValues = screen.getByText(/CORE/i);
    expect(coreValues).toBeInTheDocument();
  });

  test("renders stats numbers", () => {
    render(<AboutPage />);
    
    expect(screen.getByText("50k+")).toBeInTheDocument();
    expect(screen.getByText("1M+")).toBeInTheDocument();
    expect(screen.getByText("24/7")).toBeInTheDocument();
  });

  test("renders call to action button", () => {
    render(<AboutPage />);
    
    const button = screen.getByRole("button", { name: /get started free/i });
    expect(button).toBeInTheDocument();
  });

});