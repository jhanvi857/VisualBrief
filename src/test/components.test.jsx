import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import Hero from "../components/Hero"

describe("Hero Component", () => {
  it("renders hero section with headline", () => {
    render(<Hero />)
    const heading = screen.getByText(/Transform Long PDFs into/i)
    expect(heading).toBeInTheDocument()
  })

  it("renders CTA buttons", () => {
    render(<Hero />)
    const startButton = screen.getByText(/Get Started Free/i)
    expect(startButton).toBeInTheDocument()
  })

  it("displays feature bullets", () => {
    render(<Hero />)
    const feature = screen.getByText(/AI-powered summaries/i)
    expect(feature).toBeInTheDocument()
  })
})
