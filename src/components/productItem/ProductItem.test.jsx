import { test, describe, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { WishContext } from "../../context/wishContext";
import { BagProvider } from "../../context/bagContext";
import ProductItem from "./ProductItem";
import {
  mockProductData,
  mockAuthContextValue,
  mockWishContextValue,
} from "../../tests/mockData";

// Mock the productService module
import * as productService from "../../services/productService";

describe("ProductItem", () => {
  mockAuthContextValue.isAuthenticated = true;

  test("ProductItem renders correctly", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContextValue}>
          <WishContext.Provider value={mockWishContextValue}>
            <BagProvider>
              <ProductItem {...mockProductData} />
            </BagProvider>
          </WishContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Check if the product name is rendered
    expect(screen.getByText(mockProductData.name)).toBeInTheDocument();

    // Check if the product price is rendered correctly
    expect(
      screen.getByText(`$${mockProductData.price.toFixed(2)}`)
    ).toBeInTheDocument();

    // Check if the product image is rendered
    const img = screen.getByAltText(mockProductData.name);
    expect(img).toBeInTheDocument();
    expect(img.src).toContain(mockProductData.images[0]);

    // Check if the "Quick View" button is rendered
    expect(screen.getByText("Quick View")).toBeInTheDocument();
  });

  test("Quick View functionality works", async () => {
    productService.getProductById.mockResolvedValueOnce(mockProductData);
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContextValue}>
          <WishContext.Provider value={mockWishContextValue}>
            <BagProvider>
              <ProductItem {...mockProductData} />
            </BagProvider>
          </WishContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Click the "Quick View" button to display the QuickView component
    const quickViewButton = screen.getByText("Quick View");
    fireEvent.click(quickViewButton);

    // Wait for the QuickView component to render with the mock data
    await waitFor(() =>
      expect(productService.getProductById).toHaveBeenCalledWith(
        mockProductData._id
      )
    );

    // Check if the close button inside QuickView is rendered
    const closeButton = screen.getByRole("button", {
      name: /close/i,
    });

    expect(closeButton).toBeInTheDocument();

    // Click the close button to close the QuickView component
    fireEvent.click(closeButton);

    // Check if the QuickView component is closed
    expect(closeButton).not.toBeInTheDocument();
  });

  test("Product is not wish", () => {
    mockWishContextValue.isWish.mockReturnValue(false);
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContextValue}>
          <WishContext.Provider value={mockWishContextValue}>
            <BagProvider>
              <ProductItem {...mockProductData} />
            </BagProvider>
          </WishContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Check if the wish button is rendered
    const wishButton = screen.getByAltText("ICON");
    expect(wishButton.src).toContain("icon-heart-01.png");

    // Check if the wish button is functional
    fireEvent.click(wishButton);
    expect(mockWishContextValue.addWish).toHaveBeenCalledWith(
      mockProductData._id
    );
  });

  test("Product is wish", () => {
    mockWishContextValue.isWish.mockReturnValue(true);
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContextValue}>
          <WishContext.Provider value={mockWishContextValue}>
            <BagProvider>
              <ProductItem {...mockProductData} />
            </BagProvider>
          </WishContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Check if the wish button is rendered
    const wishButton = screen.getByAltText("ICON");
    expect(wishButton.src).toContain("icon-heart-02.png");

    // Check if the wish button is functional
    fireEvent.click(wishButton);
    expect(mockWishContextValue.addWish).toHaveBeenCalledWith(
      mockProductData._id
    );
  });

  test("Check if the wish button is functional", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContextValue}>
          <WishContext.Provider value={mockWishContextValue}>
            <BagProvider>
              <ProductItem {...mockProductData} />
            </BagProvider>
          </WishContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    const wishButton = screen.getByAltText("ICON");
    fireEvent.click(wishButton);
    expect(mockWishContextValue.addWish).toHaveBeenCalledWith(
      mockProductData._id
    );
  });

  // Check if Wish button is not visible when user is authenticated
  test("Wish button is not visible when user is not authenticated", () => {
    mockAuthContextValue.isAuthenticated = false;
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContextValue}>
          <WishContext.Provider value={mockWishContextValue}>
            <BagProvider>
              <ProductItem {...mockProductData} />
            </BagProvider>
          </WishContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    const wishButton = screen.queryByAltText("ICON");
    expect(wishButton).toBeNull();
  });
});