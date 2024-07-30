import * as React from "react"

export const CaseFilterContext = React.createContext({
  appliedCaseFilters: null,
  setAppliedCaseFilters: () => {},
});
