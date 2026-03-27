# Deferred Features — MVP Minimization

These components and features were removed for the initial launch and saved here for future use.

## Removed Views

### ProductView.tsx
- **What:** E-commerce product detail page ("The Table Mic")
- **Why deferred:** No purchase functionality needed for MVP
- **To restore:** Re-import in App.tsx, add `product` to ViewState, add goods section back to HomeView

### VoteView.tsx
- **What:** Voting + funding system for community-driven project selection
- **Why deferred:** Needs backend infrastructure, not MVP-critical
- **To restore:** Re-import in App.tsx, add `vote` to ViewState, add Vote pill + ticker item to HomeView

### ProposeProjectView.tsx
- **What:** Form for visitors to propose new research/writing projects
- **Why deferred:** Needs backend infrastructure, not MVP-critical
- **To restore:** Re-import in App.tsx, add `propose` to ViewState, add Propose pill + ticker item to HomeView

## Removed Sections

### Goods Section (HomeView)
- "goods, wares, and trinkets" section with The Table Mic link
- Goods navigation pill

### Tag Filter Pills (Thoughts Section)
- 8-tag filter grid (writing, DORA, research, politics, teams, scrollytelling, AI, data)
- Toggle + filter logic in HomeView

## Removed Nav Items
- Vote pill
- Propose pill
- Goods pill
- Listen pill (external Spotify link — kept in ticker + noises section instead)
- Ticker items: "HAVE AN IDEA? PROPOSE IT", "VOTE ON THE NEXT PROJECT", "THE TABLE MIC: COMING SOON"

## Placeholder Thoughts Removed
- Scrollytelling Article
- Documents Are Like Sunshine
- DORA Reports 2022–2025
- Team Archetypes
- 2026 Mayoral Race Predictions

These were link: '#' placeholders. Some may return as real content later.
