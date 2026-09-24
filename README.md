# cheap sensationalism

The studio site, drawn as a subway map. Everything Derek makes is a
**station**. Stations stop at **hubs** (each hub has its own launching page,
like `/music` or `/instruments`), and hubs sit on one of five **lines**,
named for what you do there: listen, read, use, play, guess.

Every map can be seen three ways, picked at the top: **list**, **table**, or
**network**. Whatever is on screen is in the URL, so it can be sent.

## where things are

| you want to | edit |
|---|---|
| add, rename, or move a station | `content/editions/2026-09.json` → `things` |
| change a launching page's headline, lede, or button | same file → `hubs` |
| change the advisories or the "elsewhere" links | same file → `advisories`, `elsewhere` |
| change how things look | `src/styles/site.css` (tokens are in `src/styles/tokens.css`) |

A station looks like this. Only `id`, `title`, `hubs`, `kind`, `status`,
`blurb`, `links` and `related` are required.

```json
{
  "id": "weird-weather",
  "title": "weird weather",
  "hubs": ["essays"],
  "kind": "data essay",
  "status": "live",
  "blurb": "How strange was your city’s winter?",
  "year": "2026",
  "updated": "2026-05",
  "links": [{ "label": "[read weird weather]", "url": "https://weather.cheapsensationalism.com" }],
  "source": "https://github.com/BrightsizeLife/Weird-weather",
  "related": ["virtue-and-vice"]
}
```

- `status` is one of `live` (in service), `wip` (under construction),
  `idea` (planned), `retired` (out of service). `note` says why, in a few words.
- Two or more `hubs` make it a **transfer station**. `related` draws a dashed
  line to any other station, on any line. These are the connections that
  ignore the hierarchy.
- `source` is only for **public** repositories. A private repo's name,
  link, or Vercel URL never goes in here: this repository is public, so
  anything in these files is published the moment it is pushed, whether or
  not the site shows it.

## versions you can send

- **Editions.** Each file in `content/editions/` is a dated snapshot of the
  whole map. `?edition=2026-05` shows the site as it was in May 2026, and
  keeps showing it. The `[copy a link to exactly this]` button at the
  bottom of every page pins the current edition into the link, so what you
  send does not change when the map does. To start a new edition, copy the
  latest file, rename it (`2026-12.json`), change its `id`, `published` and
  `note`, and edit away. The `/editions` page lists what opened and closed
  between editions.
- **Builds.** The footer names the commit each page was built from and
  links to it.

## running it

```
npm install
npm run dev        # http://localhost:3000
npm run check      # types, the edition files, and a production build
```

`npm run check:atlas` on its own checks the edition files and says in a
sentence what is wrong: a station pointing at a hub that does not exist, two
lines sharing a colour, a path that clashes with another.

## privacy and security, on purpose

- Nothing loads from anyone else's server: fonts are self-hosted, and there
  are no embeds, trackers, analytics, or cookies.
- `vercel.json` sends a strict Content-Security-Policy, so the browser
  refuses any script or font from elsewhere even if one is added by
  mistake. If you add an embed later, it has to be allowed there first.
- No API keys are built into the page.

## design

The PACT design system (white ground, black type, one indigo for everything
you can press, five colours held apart under colour blindness), with the
Cheap Sensationalism voice on top: lowercase headers, `[bracket]` actions,
`[WIP]` where it's true. The subway map is the structure; the jokes are in
the words.
