import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import expect from "expect";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

export function getEntireBucket(getPage, pageOptions) {
  return async dispatch => {
    return dispatch(getPage(pageOptions)).then(pageResult => {
      if (pageResult.hasOwnProperty("NextMarker")) {
        return dispatch(
          getEntireBucket(getPage, {
            ...pageOptions,
            ...{ nextMarker: pageResult.NextMarker }
          })
        );
      }
    });
  };
}

describe("0", () => {
  it("1", () => {
    const lastPageNumber = 5;
    const expectedActions = [...Array(lastPageNumber + 1).keys()]
      .slice(1)
      .map(NextMarker => {
        if (NextMarker < lastPageNumber) {
          return {
            type: "page",
            NextMarker
          };
        }
        return { type: "page" };
      });

    const store = mockStore({ pages: [] });

    const getNextPageDetails = ({ nextMarker }) => dispatch => {
      if (nextMarker < lastPageNumber - 1) {
        return Promise.resolve(
          dispatch({
            type: "page",
            NextMarker: nextMarker + 1
          })
        );
      }
      return Promise.resolve(
        dispatch({
          type: "page"
        })
      );
    };

    return store
      .dispatch(getEntireBucket(getNextPageDetails, { nextMarker: 0 }))
      .then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});
