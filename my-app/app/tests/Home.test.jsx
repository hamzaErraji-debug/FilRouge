import { render, screen, fireEvent } from '@testing-library/react'
import Home from '../page'

// ✅ Mock next/image (because Next Image breaks in Jest)
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />
  },
}))

// ✅ Create mock for router.push
const pushMock = jest.fn()

// ✅ Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

// ✅ Mock child components (unit testing = isolate component)
jest.mock('../components/Home/ProductsCard', () => ({
  TrendingGear: () => <div data-testid="trending-gear" />,
}))

jest.mock('../components/Home/CategorieAndProgramSection', () => ({
  ShopByCategoriesAndFeaturedProgram: () => (
    <div data-testid="categories-section" />
  ),
}))

jest.mock('../components/Home/ProgramsCard', () => ({
  ProgramsSection: () => <div data-testid="programs-section" />,
}))

describe('Home Component', () => {

  it('renders the main heading', () => {
    render(<Home />)

    expect(
      screen.getByText(/UNLEASH YOUR/i)
    ).toBeInTheDocument()
  })

  it('renders both CTA buttons', () => {
    render(<Home />)

    expect(
      screen.getByRole('button', { name: /shop now/i })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /view us/i })
    ).toBeInTheDocument()
  })

  it('navigates to /shop when Shop Now is clicked', () => {
    render(<Home />)

    const shopButton = screen.getByRole('button', {
      name: /shop now/i,
    })

    fireEvent.click(shopButton)

    expect(pushMock).toHaveBeenCalledWith('/shop')
  })

  it('navigates to /about when View Us is clicked', () => {
    render(<Home />)

    const viewButton = screen.getByRole('button', {
      name: /view us/i,
    })

    fireEvent.click(viewButton)

    expect(pushMock).toHaveBeenCalledWith('/about')
  })

  it('renders child sections', () => {
    render(<Home />)

    expect(screen.getByTestId('trending-gear')).toBeInTheDocument()
    expect(screen.getByTestId('categories-section')).toBeInTheDocument()
    expect(screen.getByTestId('programs-section')).toBeInTheDocument()
  })
})