import { render, screen } from "@testing-library/react";
import App from "./App";
import axios from "axios";
import { shallow, configure } from "enzyme";
import Products from "./Components/products";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

jest.mock("axios");

describe("testing procucts instance", () => {
  it("simple test", (done) => {
    axios.get.mockImplementation(() =>
      Promise.resolve({
        data: [
          {
            id: 2,
            attributes: {
              name: "Apples",
              country: "Italy",
              cost: 3,
              instock: 10,
              createdAt: "2022-01-21T03:43:46.818Z",
              updatedAt: "2022-01-24T00:34:00.795Z",
              publishedAt: "2022-01-21T03:43:46.818Z",
            },
          },
          {
            id: 3,
            attributes: {
              name: "Beans",
              country: "USA",
              cost: 2,
              instock: 5,
              createdAt: "2022-01-21T03:44:50.174Z",
              updatedAt: "2022-01-21T04:19:39.724Z",
              publishedAt: "2022-01-21T03:44:50.174Z",
            },
          },
          {
            id: 4,
            attributes: {
              name: "Oranges",
              country: "Spain",
              cost: 4,
              instock: 3,
              createdAt: "2022-01-21T03:45:32.217Z",
              updatedAt: "2022-01-21T04:19:14.797Z",
              publishedAt: "2022-01-21T03:45:32.217Z",
            },
          },
          {
            id: 5,
            attributes: {
              name: "Cabbage",
              country: "USA",
              cost: 1,
              instock: 8,
              createdAt: "2022-01-21T03:45:59.427Z",
              updatedAt: "2022-01-21T03:59:32.632Z",
              publishedAt: "2022-01-21T03:45:59.427Z",
            },
          },
        ],
        meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 4 } },
      })
    );
    const spy = jest.spyOn(axios, "get");
    const productInstance = shallow(<Products />);
    const input = productInstance.find("#das");
    input.simulate("change", { target: { value: "test" } });
    // console.log(productInstance);
    // const form = productInstance.find("form").first();
    // console.log({ form });
    // form.simulate("submit", {
    //   preventDefault() {},
    // });
    // console.log({
    //   state: productInstance.find(Products).dive().instance().state,
    // });
    // expect(spy).toBeCalled();
    done();
  });
});
