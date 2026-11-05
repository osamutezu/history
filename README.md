# HISTORY NETWORK v8.4 — INSPECTOR FIX

Fixes regression in v8.3 based on the screenshot: focusNode() could not invoke openInspectorFor(), because the latter was function-scoped inside activate(). Now the inspector callback is explicitly shared and assigned during activation.

Desktop inspector docks to the opposite side of the selected node's horizontal position; actual diagram viewport width is reduced by a 380px CSS reservation on the corresponding side. The options panel also reserves space on its side. Both panels remain independently hideable. Mobile retains drawers.

No historical records or relations changed. Built directly from actual v8.3 files. All previous timeline/network functionality preserved.

All five inline JS scripts passed node --check; ZIP integrity passed. Browser runtime visual test not performed.
