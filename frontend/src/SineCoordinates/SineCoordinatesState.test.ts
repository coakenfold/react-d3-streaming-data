import { configureStore } from "@reduxjs/toolkit";
import sineCoordinates from "./SineCoordinatesState";
import {
  updateRealtime,
  replaceLog,
  resetRealtime,
  initialState,
} from "./SineCoordinatesState";

describe("State", () => {
  let store: any;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        sineCoordinates,
      },
    });
    expect(store.getState().sineCoordinates).toStrictEqual(initialState);
  });
  test("Has default state", () => {
    const { sineCoordinates } = store.getState();
    expect(sineCoordinates).toStrictEqual(initialState);
  });
  test("Can update `realtime`", () => {
    const data = { timestamp: "can update", x: 1, y: 1 };
    store.dispatch(updateRealtime(data));
    expect(store.getState().sineCoordinates.realtime).toStrictEqual([data]);
  });
  test("Can reset `realtime`", () => {
    const data = { timestamp: "can reset > step 1", x: 1, y: 1 };
    store.dispatch(updateRealtime(data));
    expect(store.getState().sineCoordinates.realtime).toStrictEqual([data]);
    store.dispatch(resetRealtime());
    expect(store.getState().sineCoordinates.realtime).toStrictEqual(
      initialState.realtime
    );
  });
  test("Can replace `log`", () => {
    const data = [{ timestamp: "can replace log", x: 1, y: 1 }];
    store.dispatch(replaceLog(data));
    expect(store.getState().sineCoordinates.log).toStrictEqual(data);
  });
});
