import { render, screen } from "@testing-library/react";
import { Chat } from "../Chat";

describe("Chat", () => {
  test("renders initial assistant message", () => {
    render(<Chat />);
    expect(screen.getByText("Hi! Ask me anything.")).toBeInTheDocument();
  });
});
