import { createBrowserHistory } from "history";
import { RootState } from "./store";

export const history = createBrowserHistory();

export const selectLocation = (state: RootState) => state.router.location;
